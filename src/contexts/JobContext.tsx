
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

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
  addJob: (job: Omit<JobApplication, "id" | "dateAdded">) => void;
  updateJob: (id: string, updates: Partial<JobApplication>) => void;
  deleteJob: (id: string) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  getJobsByStatus: (status: JobStatus) => JobApplication[];
  getJobById: (id: string) => JobApplication | undefined;
  generateFitScore: (jobDescription: string, resume: string) => number;
  savedResumes: Record<string, string>;
  savedCoverLetters: Record<string, string>;
  saveResume: (jobId: string, content: string) => void;
  saveCoverLetter: (jobId: string, content: string) => void;
  getResume: (jobId: string) => string | undefined;
  getCoverLetter: (jobId: string) => string | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [savedResumes, setSavedResumes] = useState<Record<string, string>>({});
  const [savedCoverLetters, setSavedCoverLetters] = useState<Record<string, string>>({});

  // Load jobs from localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem("autoapply_jobs");
    const savedResumeData = localStorage.getItem("autoapply_resumes");
    const savedCoverLetterData = localStorage.getItem("autoapply_cover_letters");
    
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (error) {
        console.error("Failed to parse jobs data:", error);
        localStorage.removeItem("autoapply_jobs");
      }
    }
    
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
  }, []);

  // Save jobs to localStorage when they change
  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem("autoapply_jobs", JSON.stringify(jobs));
    }
  }, [jobs]);

  // Save resumes to localStorage when they change
  useEffect(() => {
    if (Object.keys(savedResumes).length > 0) {
      localStorage.setItem("autoapply_resumes", JSON.stringify(savedResumes));
    }
  }, [savedResumes]);

  // Save cover letters to localStorage when they change
  useEffect(() => {
    if (Object.keys(savedCoverLetters).length > 0) {
      localStorage.setItem("autoapply_cover_letters", JSON.stringify(savedCoverLetters));
    }
  }, [savedCoverLetters]);

  const addJob = (job: Omit<JobApplication, "id" | "dateAdded">) => {
    const newJob: JobApplication = {
      ...job,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
    };
    
    setJobs((prev) => [...prev, newJob]);
  };

  const updateJob = (id: string, updates: Partial<JobApplication>) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...updates } : job))
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const updateJobStatus = (id: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? {
              ...job,
              status,
              ...(status === "Applied" && !job.dateApplied
                ? { dateApplied: new Date().toISOString() }
                : {}),
            }
          : job
      )
    );
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
