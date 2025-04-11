
import { useState, useEffect } from 'react';
import { Loader2, Download, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useJobs } from '@/contexts/JobContext';
import { toast } from '@/components/ui/use-toast';

const ResumePage = () => {
  const { user, updateProfile } = useUser();
  const { jobs, saveResume } = useJobs();

  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("profile");

  // If there are jobs, pre-select the first one
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
      setJobDescription(jobs[0].description || "");
    }
  }, [jobs, selectedJobId]);

  const generateResume = () => {
    if (!user.name || !user.experiences.length) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please complete your profile with name and experience details.",
      });
      setCurrentTab("profile");
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing job description",
        description: "Please enter or select a job description to generate a tailored resume.",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const experienceText = user.experiences
        .map(
          (exp) =>
            `${exp.title} at ${exp.company} (${exp.startDate} - ${
              exp.isCurrentRole ? "Present" : exp.endDate
            }):\n${exp.description}`
        )
        .join("\n\n");

      const educationText = user.education
        .map(
          (edu) =>
            `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.endDate})`
        )
        .join("\n");

      const skillsText = user.skills.join(", ");

      const resumeContent = `
# ${user.name}
${user.title || "Professional"}
${user.email} | ${user.phone || "(Phone)"} | ${user.location || "(Location)"}

## PROFESSIONAL SUMMARY
${user.summary || "Experienced professional with a proven track record of success."}

## WORK EXPERIENCE
${experienceText || "No experience added yet."}

## EDUCATION
${educationText || "No education added yet."}

## SKILLS
${skillsText || "No skills added yet."}
      `;

      setGeneratedResume(resumeContent);
      
      // If a job was selected, save this resume for that job
      if (selectedJobId) {
        saveResume(selectedJobId, resumeContent);
        toast({
          title: "Resume saved",
          description: "Your resume has been saved for this job application",
        });
      }
      
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResume);
    toast({
      title: "Copied to clipboard",
      description: "Resume content has been copied to your clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_${user.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectJob = (jobId: string) => {
    const selectedJob = jobs.find(job => job.id === jobId);
    if (selectedJob) {
      setSelectedJobId(jobId);
      setJobDescription(selectedJob.description || "");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Resume Generator</h1>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="job">Job Description</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter your basic information for your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={user.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input 
                    id="title" 
                    value={user.title}
                    onChange={(e) => updateProfile({ title: e.target.value })}
                    placeholder="Software Engineer" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.email}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                    placeholder="john.doe@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={user.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    placeholder="(123) 456-7890" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={user.location}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    placeholder="San Francisco, CA" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea 
                    id="summary" 
                    value={user.summary}
                    onChange={(e) => updateProfile({ summary: e.target.value })}
                    placeholder="Briefly describe your professional background and goals" 
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("job")}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Experience card */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>
                Add your relevant work experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.experiences.map((exp) => (
                <div key={exp.id} className="border p-4 rounded-md space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{exp.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Edit functionality would go here
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {exp.company} | {exp.startDate} - {exp.isCurrentRole ? "Present" : exp.endDate}
                  </p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                + Add Experience
              </Button>
            </CardContent>
          </Card>
          
          {/* Education and Skills card */}
          <Card>
            <CardHeader>
              <CardTitle>Education & Skills</CardTitle>
              <CardDescription>
                Add your education and relevant skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Education</Label>
                {user.education.map((edu) => (
                  <div key={edu.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Edit functionality would go here
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {edu.institution} | {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}

                <Button className="w-full mt-2" variant="outline">
                  + Add Education
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => {
                          // Remove skill functionality
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 mt-2">
                  <Input placeholder="Add a new skill" />
                  <Button>Add</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setCurrentTab("job")}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="job" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Enter or select a job description to tailor your resume
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

              <div className="space-y-2">
                <Label htmlFor="job-description">
                  {jobs.length > 0
                    ? "Or enter a job description manually"
                    : "Enter job description"}
                </Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the full job description here to tailor your resume"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("profile")}>
                Back
              </Button>
              <Button 
                className="bg-brand-purple hover:bg-brand-purple-dark" 
                onClick={() => {
                  generateResume();
                  setCurrentTab("resume");
                }}
                disabled={!jobDescription.trim()}
              >
                Generate Resume <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Resume</CardTitle>
              <CardDescription>
                Your personalized resume tailored for this job
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-purple mb-4" />
                    <p>Generating your tailored resume...</p>
                  </div>
                </div>
              ) : generatedResume ? (
                <div className="border rounded-md p-4 whitespace-pre-line min-h-80 max-h-96 overflow-y-auto">
                  {generatedResume}
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-center">
                  <div>
                    <p className="mb-4 text-gray-500">
                      No resume generated yet. Please fill in your profile and job description, 
                      then click "Generate Resume".
                    </p>
                    <Button 
                      onClick={() => setCurrentTab("job")}
                      className="bg-brand-purple hover:bg-brand-purple-dark"
                    >
                      Start Generation Process
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("job")}>
                Back
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!generatedResume || isGenerating}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!generatedResume || isGenerating}
                >
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumePage;
