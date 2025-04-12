
import { useState } from 'react';
import { Move, Plus, MoreVertical, Trash2, FileText, PenLine, CalendarClock, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobs, JobStatus, JobApplication } from '@/contexts/JobContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Job status columns order
const BOARD_COLUMNS: JobStatus[] = ["To Apply", "Applied", "Interview", "Offer", "Rejected"];

const TrackerPage = () => {
  const { jobs, addJob, updateJob, deleteJob, updateJobStatus, getJobsByStatus, loading } = useJobs();
  const { user } = useAuth();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newJobUrl, setNewJobUrl] = useState("");
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddJob = async () => {
    if (!newJobTitle.trim() || !newJobCompany.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter job title and company name",
      });
      return;
    }

    await addJob({
      title: newJobTitle,
      company: newJobCompany,
      location: newJobLocation,
      description: newJobDescription,
      url: newJobUrl,
      status: "To Apply",
      notes: "",
    });

    // Reset form and close dialog
    setNewJobTitle("");
    setNewJobCompany("");
    setNewJobLocation("");
    setNewJobDescription("");
    setNewJobUrl("");
    setIsAddDialogOpen(false);
  };

  const handleEditJob = async () => {
    if (!editingJob) return;

    await updateJob(editingJob.id, editingJob);
    setEditingJob(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteJob = async (id: string) => {
    await deleteJob(id);
  };

  const handleEditDialogOpen = (job: JobApplication) => {
    setEditingJob({ ...job });
    setIsEditDialogOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, job: JobApplication) => {
    e.dataTransfer.setData('jobId', job.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    await updateJobStatus(jobId, status);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple mb-4" />
        <p className="text-gray-500">Loading your job applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Application Tracker</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-purple-dark">
              <Plus className="h-4 w-4 mr-2" /> Add Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
              <DialogDescription>
                Enter job details to track your application
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
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
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddJob}
                className="bg-brand-purple hover:bg-brand-purple-dark"
              >
                Add Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
          <p className="text-yellow-800 text-sm">
            You need to sign in to save your job applications. <Link to="/auth" className="text-brand-purple font-medium hover:underline">Sign in now</Link>
          </p>
        </div>
      )}

      <div className="kanban-grid overflow-x-auto pb-6">
        {BOARD_COLUMNS.map((status) => (
          <div key={status} className="min-w-[250px]">
            <Card
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              className="h-full"
            >
              <CardHeader className="p-3 border-b bg-gray-50">
                <CardTitle className="text-sm font-medium flex justify-between items-center">
                  <span>{status}</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {getJobsByStatus(status).length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3 min-h-[300px]">
                {getJobsByStatus(status).map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job)}
                    className="bg-white p-3 rounded-md border shadow-sm hover:shadow-md cursor-move transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-sm truncate max-w-[170px]" title={job.title}>
                          {job.title}
                        </h3>
                        <p className="text-xs text-gray-500 truncate max-w-[170px]" title={job.company}>
                          {job.company}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditDialogOpen(job)}>
                            <PenLine className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <Link to="/resume" className="w-full">
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" /> Create Resume
                            </DropdownMenuItem>
                          </Link>
                          <Link to="/cover-letter" className="w-full">
                            <DropdownMenuItem>
                              <PenLine className="h-4 w-4 mr-2" /> Create Cover Letter
                            </DropdownMenuItem>
                          </Link>
                          <Link to="/analyzer" className="w-full">
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" /> Analyze Fit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {job.location && (
                      <p className="text-xs text-gray-500 mb-1">{job.location}</p>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <CalendarClock className="h-3 w-3 mr-1" />
                      <span>
                        {job.status === "Applied" && job.dateApplied
                          ? `Applied: ${formatDate(job.dateApplied)}`
                          : `Added: ${formatDate(job.dateAdded)}`}
                      </span>
                    </div>
                    
                    {job.url && (
                      <div className="mt-2">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center text-brand-purple hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" /> View Job
                        </a>
                      </div>
                    )}
                    
                    {job.fitScore && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Match Score</span>
                          <span>{job.fitScore}%</span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded">
                          <div
                            className="h-full rounded bg-brand-purple"
                            style={{ width: `${job.fitScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {getJobsByStatus(status).length === 0 && (
                  <div className="h-24 flex items-center justify-center border border-dashed rounded-md">
                    <p className="text-sm text-gray-400">
                      {status === "To Apply" ? "Add jobs to track" : "Drag jobs here"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mt-2">
        <p className="flex items-center justify-center">
          <Move className="h-4 w-4 mr-2" /> Tip: Drag and drop jobs between columns to update status
        </p>
      </div>

      {editingJob && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
              <DialogDescription>
                Update job details and notes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Job Title</Label>
                <Input
                  id="edit-title"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={editingJob.company}
                  onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingJob.location}
                  onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">Job URL</Label>
                <Input
                  id="edit-url"
                  value={editingJob.url}
                  onChange={(e) => setEditingJob({ ...editingJob, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Job Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingJob.notes}
                  onChange={(e) => setEditingJob({ ...editingJob, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any notes about this application..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={editingJob.status}
                  onChange={(e) => setEditingJob({ 
                    ...editingJob, 
                    status: e.target.value as JobStatus,
                  })}
                >
                  {BOARD_COLUMNS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditJob}
                className="bg-brand-purple hover:bg-brand-purple-dark"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TrackerPage;
