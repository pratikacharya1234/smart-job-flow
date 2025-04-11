
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2, ChevronRight, Upload, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUser } from '@/contexts/UserContext';
import { useJobs } from '@/contexts/JobContext';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

const AnalyzerPage = () => {
  const { user } = useUser();
  const { jobs, generateFitScore } = useJobs();

  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [userResume, setUserResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [isAddingJob, setIsAddingJob] = useState(false);

  // Generate user resume text based on profile
  useEffect(() => {
    if (user) {
      const experienceText = user.experiences
        .map(
          (exp) =>
            `${exp.title} at ${exp.company} (${exp.startDate} - ${
              exp.isCurrentRole ? "Present" : exp.endDate
            }): ${exp.description}`
        )
        .join(" ");

      const educationText = user.education
        .map(
          (edu) =>
            `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.endDate})`
        )
        .join(" ");

      const skillsText = user.skills.join(" ");

      const resumeContent = `
${user.name || ""}
${user.title || ""}
${user.summary || ""}
${experienceText}
${educationText}
${skillsText}
      `;

      setUserResume(resumeContent);
    }
  }, [user]);

  // If there are jobs, pre-select the first one
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      selectJob(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const selectJob = (jobId: string) => {
    const selectedJob = jobs.find(job => job.id === jobId);
    if (selectedJob) {
      setSelectedJobId(jobId);
      setJobTitle(selectedJob.title);
      setJobCompany(selectedJob.company);
      setJobDescription(selectedJob.description || "");
    }
  };

  const analyzeJobFit = () => {
    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing job description",
        description: "Please enter a job description to analyze.",
      });
      return;
    }

    if (!userResume.trim() && !user.experiences.length) {
      toast({
        variant: "destructive",
        title: "Missing resume data",
        description: "Please complete your profile or upload a resume to analyze job fit.",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Generate a job fit score using the utility function
      const score = generateFitScore(jobDescription, userResume);
      setFitScore(score);
      
      // Simulate AI analysis of missing skills
      const jobKeywords = ["collaboration", "teamwork", "communication", "javascript", "react", "typescript", "node.js", "agile", "project management"];
      const resumeKeywords = userResume.toLowerCase().split(/\W+/);
      
      // Find "missing" skills (this is a simple simulation)
      const missing = jobKeywords.filter(keyword => 
        !resumeKeywords.some(w => w.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      // Find "strengths" (this is a simple simulation)
      const strength = jobKeywords.filter(keyword => 
        resumeKeywords.some(w => w.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      setMissingSkills(missing.slice(0, 4)); // Limit to 4 "missing" skills
      setStrengths(strength.slice(0, 4)); // Limit to 4 "strengths"
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleAddJob = () => {
    if (!jobTitle.trim() || !jobCompany.trim() || !jobDescription.trim()) {
      toast({
        variant: "destructive", 
        title: "Missing information",
        description: "Please enter job title, company, and description."
      });
      return;
    }

    // Implementation for adding the job would go here
    // This is a placeholder
    toast({
      title: "Job added",
      description: "Job has been added to your tracker", 
    });
    
    setIsAddingJob(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Job Match Analyzer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Job Selection */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>
                Select or enter a job to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobs.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="job-select">Select from your saved jobs</Label>
                  <select
                    id="job-select"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={selectedJobId}
                    onChange={(e) => selectJob(e.target.value)}
                  >
                    <option value="">-- Select a job --</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} at {job.company}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {jobs.length > 0 ? "Or enter a new job manually" : "Enter job details"}
                </div>
                <Dialog open={isAddingJob} onOpenChange={setIsAddingJob}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" /> New Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Job</DialogTitle>
                      <DialogDescription>
                        Enter job details to analyze and save to your tracker
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-job-title">Job Title</Label>
                        <Input
                          id="new-job-title"
                          placeholder="Software Engineer"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-job-company">Company</Label>
                        <Input
                          id="new-job-company"
                          placeholder="Acme Inc."
                          value={jobCompany}
                          onChange={(e) => setJobCompany(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-job-description">Job Description</Label>
                        <Textarea
                          id="new-job-description"
                          placeholder="Paste the job description here"
                          rows={5}
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleAddJob}
                        className="bg-brand-purple hover:bg-brand-purple-dark"
                      >
                        Add & Analyze
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-brand-purple hover:bg-brand-purple-dark w-full"
                onClick={analyzeJobFit}
                disabled={!jobDescription.trim()}
              >
                Analyze Job Fit <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right column - Results */}
        <div className="lg:col-span-2">
          {isAnalyzing ? (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-brand-purple mb-4" />
                <h2 className="text-xl font-bold mb-2">Analyzing Job Fit</h2>
                <p className="text-gray-500">
                  We're comparing your skills and experience to the job requirements...
                </p>
              </div>
            </Card>
          ) : fitScore !== null ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Job Match Score</span>
                    {jobTitle && (
                      <span className="text-sm font-normal text-gray-500">
                        {jobTitle} at {jobCompany}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    How well your profile matches with this job
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full border-8 border-brand-purple flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold">{fitScore}%</span>
                    </div>
                    
                    <div className="text-center max-w-md mx-auto">
                      {fitScore >= 80 ? (
                        <p className="text-green-600 font-medium">
                          Excellent match! Your profile is very well aligned with this job.
                        </p>
                      ) : fitScore >= 60 ? (
                        <p className="text-amber-600 font-medium">
                          Good match! You have many of the required skills, with some areas to improve.
                        </p>
                      ) : (
                        <p className="text-red-600 font-medium">
                          Your profile needs some improvement to be competitive for this position.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                      Your Strengths
                    </CardTitle>
                    <CardDescription>
                      Skills that match the job requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {strengths.map((skill, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                            <span className="capitalize">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No direct matches found. Try updating your profile with more skills.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
                      Areas to Improve
                    </CardTitle>
                    <CardDescription>
                      Skills to add to your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {missingSkills.length > 0 ? (
                      <ul className="space-y-2">
                        {missingSkills.map((skill, index) => (
                          <li key={index} className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2 text-amber-600" />
                            <span className="capitalize">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No significant gaps found in your skills and experience!</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Recommendations</AlertTitle>
                <AlertDescription>
                  {fitScore >= 80 ? (
                    "You're a great match for this position. Emphasize your relevant skills in your resume and cover letter, and prepare to discuss specific examples during interviews."
                  ) : fitScore >= 60 ? (
                    "Consider improving your resume by adding the missing skills or highlighting relevant experiences. Focus your cover letter on your most applicable qualifications."
                  ) : (
                    "To improve your chances, consider adding the missing skills to your profile, taking relevant courses, or gaining more experience in these areas."
                  )}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center text-center">
              <div className="p-8 max-w-md">
                <h2 className="text-xl font-bold mb-4">Job Match Analysis</h2>
                <p className="text-gray-500 mb-6">
                  Enter a job description on the left and click "Analyze Job Fit" to see how well your profile matches the requirements.
                </p>
                <Button 
                  onClick={analyzeJobFit}
                  variant="outline"
                  disabled={!jobDescription.trim()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Start Analysis
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzerPage;
