
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

export type JobStatus = "To Apply" | "Applied" | "Interview" | "Rejected" | "Offer";

export interface JobApplication {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  status: JobStatus;
  dateAdded: string;
  dateApplied?: string;
  notes: string;
  contactName?: string;
  contactEmail?: string;
  salary?: string;
  resumePath?: string;
  coverLetterPath?: string;
  fitScore?: number;
}

interface JobContextType {
  jobs: JobApplication[];
  addJob: (job: Omit<JobApplication, "id" | "dateAdded">) => Promise<void>;
  updateJob: (id: string, updates: Partial<JobApplication>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateJobStatus: (id: string, status: JobStatus) => Promise<void>;
  getJobsByStatus: (status: JobStatus) => JobApplication[];
  getJobById: (id: string) => JobApplication | undefined;
  generateFitScore: (jobDescription: string, resume: string) => number;
  savedResumes: Record<string, string>;
  savedCoverLetters: Record<string, string>;
  saveResume: (jobId: string, content: string) => void;
  saveCoverLetter: (jobId: string, content: string) => void;
  getResume: (jobId: string) => string | undefined;
  getCoverLetter: (jobId: string) => string | undefined;
  loading: boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [savedResumes, setSavedResumes] = useState<Record<string, string>>({});
  const [savedCoverLetters, setSavedCoverLetters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Load jobs from Supabase when user changes
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) {
        setJobs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('date_added', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Transform from database format to app format
          const transformedJobs = data.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location || '',
            description: job.description || '',
            url: job.url || '',
            status: job.status as JobStatus,
            dateAdded: job.date_added,
            dateApplied: job.date_applied,
            notes: job.notes || '',
            fitScore: job.fit_score || undefined
          }));
          setJobs(transformedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load job applications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    
    // Load resumes and cover letters from localStorage
    const savedResumeData = localStorage.getItem("autoapply_resumes");
    const savedCoverLetterData = localStorage.getItem("autoapply_cover_letters");
    
    if (savedResumeData) {
      try {
        setSavedResumes(JSON.parse(savedResumeData));
      } catch (error) {
        console.error("Failed to parse resume data:", error);
        localStorage.removeItem("autoapply_resumes");
      }
    }
    
    if (savedCoverLetterData) {
      try {
        setSavedCoverLetters(JSON.parse(savedCoverLetterData));
      } catch (error) {
        console.error("Failed to parse cover letter data:", error);
        localStorage.removeItem("autoapply_cover_letters");
      }
    }
  }, [user]);

  // Save resumes and cover letters to localStorage when they change
  useEffect(() => {
    if (Object.keys(savedResumes).length > 0) {
      localStorage.setItem("autoapply_resumes", JSON.stringify(savedResumes));
    }
  }, [savedResumes]);

  useEffect(() => {
    if (Object.keys(savedCoverLetters).length > 0) {
      localStorage.setItem("autoapply_cover_letters", JSON.stringify(savedCoverLetters));
    }
  }, [savedCoverLetters]);

  const addJob = async (job: Omit<JobApplication, "id" | "dateAdded">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      const newJob = {
        title: job.title,
        company: job.company,
        location: job.location || null,
        description: job.description || null,
        url: job.url || null,
        status: job.status,
        notes: job.notes || null,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert(newJob)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const transformedJob: JobApplication = {
          id: data.id,
          title: data.title,
          company: data.company,
          location: data.location || '',
          description: data.description || '',
          url: data.url || '',
          status: data.status as JobStatus,
          dateAdded: data.date_added,
          dateApplied: data.date_applied || undefined,
          notes: data.notes || '',
          fitScore: data.fit_score || undefined
        };

        setJobs(prev => [transformedJob, ...prev]);
        
        toast({
          title: "Job added",
          description: "New job has been added to your tracker",
        });
      }
    } catch (error) {
      console.error('Error adding job:', error);
      toast({
        title: "Error",
        description: "Failed to add job application",
        variant: "destructive",
      });
    }
  };

  const updateJob = async (id: string, updates: Partial<JobApplication>) => {
    if (!user) return;

    try {
      // Convert from app format to database format
      const dbUpdates: any = {};
      
      if ('title' in updates) dbUpdates.title = updates.title;
      if ('company' in updates) dbUpdates.company = updates.company;
      if ('location' in updates) dbUpdates.location = updates.location;
      if ('description' in updates) dbUpdates.description = updates.description;
      if ('url' in updates) dbUpdates.url = updates.url;
      if ('status' in updates) dbUpdates.status = updates.status;
      if ('notes' in updates) dbUpdates.notes = updates.notes;
      if ('fitScore' in updates) dbUpdates.fit_score = updates.fitScore;
      if ('dateApplied' in updates) dbUpdates.date_applied = updates.dateApplied;
      
      dbUpdates.date_updated = new Date().toISOString();

      const { error } = await supabase
        .from('jobs')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setJobs(prev =>
        prev.map(job => (job.id === id ? { ...job, ...updates } : job))
      );

      toast({
        title: "Job updated",
        description: "Job details have been updated",
      });
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "Failed to update job application",
        variant: "destructive",
      });
    }
  };

  const deleteJob = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setJobs(prev => prev.filter(job => job.id !== id));
      
      toast({
        title: "Job deleted",
        description: "Job has been removed from your tracker",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job application",
        variant: "destructive",
      });
    }
  };

  const updateJobStatus = async (id: string, status: JobStatus) => {
    if (!user) return;

    try {
      const job = jobs.find(job => job.id === id);
      if (!job) return;

      const updates: any = {
        status,
        date_updated: new Date().toISOString()
      };

      // If status is changing to Applied and it wasn't before, set application date
      if (status === "Applied" && job.status !== "Applied" && job.status !== "Interview" && job.status !== "Offer") {
        updates.date_applied = new Date().toISOString();
      }

      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setJobs(prev =>
        prev.map(job =>
          job.id === id
            ? {
                ...job,
                status,
                dateApplied: status === "Applied" && !job.dateApplied && 
                            job.status !== "Applied" && job.status !== "Interview" && job.status !== "Offer"
                  ? new Date().toISOString()
                  : job.dateApplied
              }
            : job
        )
      );

      toast({
        title: "Job status updated",
        description: `Job moved to "${status}" status`,
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
    }
  };

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status);
  };

  const getJobById = (id: string) => {
    return jobs.find((job) => job.id === id);
  };

  // Simple keyword-matching function to generate a fit score
  const generateFitScore = (jobDescription: string, resume: string): number => {
    if (!jobDescription || !resume) return 50; // Default score
    
    const jobWords = jobDescription.toLowerCase().split(/\W+/);
    const resumeWords = resume.toLowerCase().split(/\W+/);
    
    // Filter out common words
    const commonWords = new Set(["and", "the", "a", "an", "in", "on", "at", "to", "for", "of", "with"]);
    const filteredJobWords = jobWords.filter(word => !commonWords.has(word) && word.length > 2);
    
    // Count matches
    let matches = 0;
    filteredJobWords.forEach(word => {
      if (resumeWords.includes(word)) {
        matches++;
      }
    });
    
    // Calculate percentage match (with some weightage)
    const uniqueJobWords = new Set(filteredJobWords).size;
    const score = Math.min(100, Math.round((matches / Math.max(1, uniqueJobWords)) * 100) + 20);
    
    return score;
  };

  const saveResume = (jobId: string, content: string) => {
    setSavedResumes(prev => ({
      ...prev,
      [jobId]: content
    }));
  };

  const saveCoverLetter = (jobId: string, content: string) => {
    setSavedCoverLetters(prev => ({
      ...prev,
      [jobId]: content
    }));
  };

  const getResume = (jobId: string) => savedResumes[jobId];
  
  const getCoverLetter = (jobId: string) => savedCoverLetters[jobId];

  return (
    <JobContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        deleteJob,
        updateJobStatus,
        getJobsByStatus,
        getJobById,
        generateFitScore,
        savedResumes,
        savedCoverLetters,
        saveResume,
        saveCoverLetter,
        getResume,
        getCoverLetter,
        loading
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
