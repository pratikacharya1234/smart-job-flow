
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileSignature, BarChart2, Trello, Plus, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useJobs, JobStatus } from '@/contexts/JobContext';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Dashboard = () => {
  const { user, updateProfile } = useUser();
  const { jobs, addJob } = useJobs();
  
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newJobUrl, setNewJobUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  
  // Calculate profile completion percentage
  useEffect(() => {
    let completedFields = 0;
    const totalFields = 6; // name, email, phone, location, title, summary
    
    if (user.name) completedFields++;
    if (user.email) completedFields++;
    if (user.phone) completedFields++;
    if (user.location) completedFields++;
    if (user.title) completedFields++;
    if (user.summary) completedFields++;
    
    setProfileProgress(Math.round((completedFields / totalFields) * 100));
  }, [user]);
  
  // Job statistics
  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter(job => job.status === "Applied" || job.status === "Interview" || job.status === "Offer").length;
  const interviewJobs = jobs.filter(job => job.status === "Interview" || job.status === "Offer").length;
  
  const handleAddJob = () => {
    if (newJobTitle && newJobCompany) {
      addJob({
        title: newJobTitle,
        company: newJobCompany,
        location: newJobLocation,
        description: newJobDescription,
        url: newJobUrl,
        status: "To Apply",
        notes: "",
      });
      
      // Reset form fields
      setNewJobTitle("");
      setNewJobCompany("");
      setNewJobLocation("");
      setNewJobDescription("");
      setNewJobUrl("");
      
      // Close dialog
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-purple-dark">
              <Plus className="h-4 w-4 mr-2" /> Add Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
              <DialogDescription>
                Enter job details to start tracking your application
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc."
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA (or Remote)"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Job URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/job"
                  value={newJobUrl}
                  onChange={(e) => setNewJobUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Paste the job description here"
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleAddJob}
                className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                disabled={!newJobTitle || !newJobCompany}
              >
                Add Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Welcome message */}
      <Card className="bg-gradient-to-r from-brand-purple/10 to-brand-purple-light/5 border-none">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-2">
            Welcome{user.name ? `, ${user.name}` : ''}!
          </h2>
          <p className="text-gray-600 mb-4">
            {profileProgress < 50 
              ? "Complete your profile to get personalized job recommendations."
              : "Track your job applications and create tailored resumes for each position."}
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-start sm:items-center">
            <div className="w-full sm:w-60">
              <div className="flex justify-between text-sm mb-1">
                <span>Profile completion</span>
                <span>{profileProgress}%</span>
              </div>
              <Progress value={profileProgress} className="h-2 w-full" />
            </div>
            {profileProgress < 100 && (
              <Link to="/dashboard">
                <Button size="sm" variant="outline">
                  Complete Profile
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Total Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalJobs}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Applied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{appliedJobs}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{interviewJobs}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalJobs > 0 ? Math.round((interviewJobs / totalJobs) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tools */}
      <div>
        <h2 className="text-xl font-bold mb-4">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/resume" className="block">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-brand-purple" />
                  Resume Generator
                </CardTitle>
                <CardDescription>
                  Create tailored resumes for each job application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI helps you highlight relevant skills and experience to match job requirements.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="flex items-center text-brand-purple hover:text-brand-purple-dark">
                  Create Resume <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
          
          <Link to="/cover-letter" className="block">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSignature className="h-5 w-5 mr-2 text-brand-purple" />
                  Cover Letter Builder
                </CardTitle>
                <CardDescription>
                  Generate custom cover letters in seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create compelling cover letters tailored to each job description and company.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="flex items-center text-brand-purple hover:text-brand-purple-dark">
                  Create Cover Letter <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
          
          <Link to="/analyzer" className="block">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-brand-purple" />
                  Job Match Analyzer
                </CardTitle>
                <CardDescription>
                  Check how well your profile matches job descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  See your match score and get suggestions to improve your resume for specific jobs.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="flex items-center text-brand-purple hover:text-brand-purple-dark">
                  Analyze Job Fit <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
      
      {/* Recent Applications */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Applications</h2>
          <Link to="/tracker">
            <Button variant="outline" size="sm" className="flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="overflow-hidden rounded-lg border">
          {jobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Job Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.slice(0, 5).map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{job.title}</td>
                      <td className="px-4 py-3 text-sm">{job.company}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === "Applied" ? "bg-blue-50 text-blue-700" :
                          job.status === "Interview" ? "bg-purple-50 text-purple-700" :
                          job.status === "Offer" ? "bg-green-50 text-green-700" :
                          job.status === "Rejected" ? "bg-red-50 text-red-700" :
                          "bg-gray-50 text-gray-700"
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(job.dateAdded).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-1">No job applications yet</h3>
              <p className="text-gray-500 mb-4">Start tracking your applications to see them here</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-brand-purple hover:bg-brand-purple-dark"
              >
                Add Your First Job
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
