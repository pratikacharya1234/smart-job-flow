
import { useState, useEffect } from 'react';
import { Loader2, Download, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from '@/contexts/UserContext';
import { useJobs } from '@/contexts/JobContext';
import { toast } from '@/components/ui/use-toast';

const CoverLetterPage = () => {
  const { user } = useUser();
  const { jobs, saveCoverLetter } = useJobs();

  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("job");

  // If there are jobs, pre-select the first one
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      const job = jobs[0];
      setSelectedJobId(job.id);
      setJobDescription(job.description || "");
      setCompanyName(job.company);
    }
  }, [jobs, selectedJobId]);

  const generateCoverLetter = () => {
    if (!user.name) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please complete your profile with your name.",
      });
      return;
    }

    if (!jobDescription.trim() || !companyName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter both a job description and company name.",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      let greeting = hiringManager 
        ? `Dear ${hiringManager},` 
        : "Dear Hiring Manager,";
      
      let intro;
      let body;
      let closing;
      
      if (tone === "professional") {
        intro = `I am writing to express my interest in the ${jobs.find(job => job.id === selectedJobId)?.title || "position"} at ${companyName}. With my background in ${user.title || "this field"} and relevant experience, I believe I would be a valuable addition to your team.`;
        
        body = `Throughout my career, I have developed strong skills in ${user.skills.slice(0, 3).join(", ") || "various areas"}, which align well with the requirements outlined in the job description. ${user.experiences.length > 0 ? `In my role as ${user.experiences[0].title} at ${user.experiences[0].company}, I gained substantial experience that would be directly relevant to this position.` : "My professional experience has prepared me well for this role."} I am particularly drawn to ${companyName} because of its reputation for excellence and innovation in the industry.`;
        
        closing = "I welcome the opportunity to discuss my qualifications further and how I can contribute to your team's success. Thank you for considering my application.";
      } else if (tone === "enthusiastic") {
        intro = `I'm thrilled to apply for the ${jobs.find(job => job.id === selectedJobId)?.title || "position"} at ${companyName}! As someone passionate about ${user.title || "this field"}, I'm excited about the opportunity to bring my energy and skills to your fantastic team.`;
        
        body = `I'm especially excited about ${companyName}'s work in the industry, and I believe my background in ${user.skills.slice(0, 3).join(", ") || "various areas"} makes me a perfect fit for this role. ${user.experiences.length > 0 ? `During my time at ${user.experiences[0].company} as a ${user.experiences[0].title}, I achieved significant results that I'm eager to replicate at ${companyName}.` : "Throughout my career, I've consistently delivered results that I'm eager to bring to your organization."}`;
        
        closing = "I'd love the chance to discuss how my enthusiasm and expertise can contribute to your team's continued success. Thank you for considering my application!";
      } else {
        intro = `I'm reaching out regarding the ${jobs.find(job => job.id === selectedJobId)?.title || "position"} at ${companyName}. My approach combines creativity with analytical thinking, which I believe would bring a unique perspective to your team.`;
        
        body = `What draws me to ${companyName} is your innovative approach to the industry. With my background in ${user.skills.slice(0, 3).join(", ") || "various areas"}, I see opportunities to contribute in ways that go beyond the traditional role expectations. ${user.experiences.length > 0 ? `While at ${user.experiences[0].company}, I developed unconventional solutions that drove real results, a mindset I would bring to ${companyName}.` : "I've consistently found ways to think outside the box while delivering tangible results."}`;
        
        closing = "I look forward to potentially discussing how my unique approach could benefit your team. Thank you for considering my application.";
      }

      const letterContent = `
${currentDate}

${greeting}

${intro}

${body}

${closing}

Sincerely,
${user.name}
${user.email}
${user.phone || ""}
`;

      setGeneratedLetter(letterContent);
      
      // If a job was selected, save this cover letter for that job
      if (selectedJobId) {
        saveCoverLetter(selectedJobId, letterContent);
        toast({
          title: "Cover letter saved",
          description: "Your cover letter has been saved for this job application",
        });
      }
      
      setIsGenerating(false);
      setCurrentTab("preview");
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied to clipboard",
      description: "Cover letter content has been copied to your clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover_letter_${user.name.replace(/\s+/g, "_")}_${companyName.replace(/\s+/g, "_")}.txt`;
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
      setCompanyName(selectedJob.company);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Cover Letter Generator</h1>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="job">Job Details</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="job" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>
                Enter details to personalize your cover letter
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
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hiring-manager">Hiring Manager Name (if known)</Label>
                <Input
                  id="hiring-manager"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  placeholder="John Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description *</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the full job description here to tailor your cover letter"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Cover Letter Tone</Label>
                <RadioGroup value={tone} onValueChange={setTone} className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">Professional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enthusiastic" id="enthusiastic" />
                    <Label htmlFor="enthusiastic">Enthusiastic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="creative" id="creative" />
                    <Label htmlFor="creative">Creative</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-brand-purple hover:bg-brand-purple-dark ml-auto"
                onClick={generateCoverLetter}
                disabled={!companyName.trim() || !jobDescription.trim()}
              >
                Generate Cover Letter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Cover Letter</CardTitle>
              <CardDescription>
                Your personalized cover letter for {companyName || "this company"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-purple mb-4" />
                    <p>Generating your tailored cover letter...</p>
                  </div>
                </div>
              ) : generatedLetter ? (
                <div className="border rounded-md p-4 whitespace-pre-line min-h-80 max-h-96 overflow-y-auto font-serif leading-relaxed">
                  {generatedLetter}
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-center">
                  <div>
                    <p className="mb-4 text-gray-500">
                      No cover letter generated yet. Please enter job details 
                      and click "Generate Cover Letter".
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
                  disabled={!generatedLetter || isGenerating}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!generatedLetter || isGenerating}
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

export default CoverLetterPage;
