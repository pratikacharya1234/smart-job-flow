
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, FileText, BarChart2, Trello, FileCheck, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const LandingPage = () => {
  const { login, user } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      setIsLoginOpen(false);
      toast({
        title: "Logged in successfully",
        description: "Welcome to AutoApply AI",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please enter both email and password",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b shadow-sm bg-white">
        <div className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-purple-dark bg-clip-text text-transparent">
          AutoApply AI
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            {user.isLoggedIn ? 'Dashboard' : 'Demo'}
          </Link>
          
          {user.isLoggedIn ? (
            <Link to="/dashboard">
              <Button variant="default" className="bg-brand-purple hover:bg-brand-purple-dark">
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-brand-purple hover:bg-brand-purple-dark">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign in to AutoApply AI</DialogTitle>
                  <DialogDescription>
                    Enter your details to access all features
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Button type="submit" className="bg-brand-purple hover:bg-brand-purple-dark">
                      Sign In
                    </Button>
                    <span className="text-sm text-gray-500">
                      Demo mode: any email/password works
                    </span>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
          Land Your Dream Job with AI-Powered <span className="bg-gradient-to-r from-brand-purple to-brand-purple-dark bg-clip-text text-transparent">Application Tools</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          AutoApply AI streamlines your job search with tailored resumes, cover letters, and job application tracking — all in one place.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/dashboard">
            <Button size="lg" className="bg-brand-purple hover:bg-brand-purple-dark">
              Try It Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg">
              Learn More
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3">AI Resume Generator</h3>
              <p className="text-gray-600">Create professionally tailored resumes for each job application with our AI assistant.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3">Cover Letter Builder</h3>
              <p className="text-gray-600">Generate customized cover letters that highlight your relevant skills and experiences.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3">Job Match Analysis</h3>
              <p className="text-gray-600">Get instant feedback on how well your profile matches a job description with our fit score.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Trello className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3">Application Tracker</h3>
              <p className="text-gray-600">Stay organized with a Kanban-style board to track all your job applications in one place.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3">Auto-Fill Forms</h3>
              <p className="text-gray-600">Save time by automatically filling application forms with your stored profile information.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3">One-Click Apply</h3>
              <p className="text-gray-600">Simulate one-click job applications with our browser extension simulation feature.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-8 bg-white hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">Free Plan</h3>
              <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic resume generator</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Simple cover letter templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Track up to 5 job applications</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic job match analysis</span>
                </li>
              </ul>
              <Link to="/dashboard">
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-8 bg-gradient-to-b from-brand-purple/5 to-white relative">
              <div className="absolute top-0 right-0 bg-brand-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
              <p className="text-4xl font-bold mb-6">$9<span className="text-lg text-gray-500 font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced AI resume generator</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom cover letter generator</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited job application tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Detailed job match analysis with recommendations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>One-click apply simulation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email notifications for job status updates</span>
                </li>
              </ul>
              <Link to="/dashboard">
                <Button className="w-full bg-brand-purple hover:bg-brand-purple-dark">
                  Buy Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-brand-purple text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Supercharge Your Job Search?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of job seekers who use AutoApply AI to land their dream jobs faster.</p>
          <Link to="/dashboard">
            <Button variant="secondary" size="lg">
              Try AutoApply AI Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 lg:px-24 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">AutoApply AI</h3>
            <p className="text-gray-600">Making job applications simpler, smarter, and more successful.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/resume" className="hover:text-brand-purple">Resume Builder</Link></li>
              <li><Link to="/cover-letter" className="hover:text-brand-purple">Cover Letter Generator</Link></li>
              <li><Link to="/analyzer" className="hover:text-brand-purple">Job Match Analyzer</Link></li>
              <li><Link to="/tracker" className="hover:text-brand-purple">Application Tracker</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-brand-purple">About Us</a></li>
              <li><a href="#" className="hover:text-brand-purple">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-purple">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-brand-purple">FAQ</a></li>
              <li><a href="#" className="hover:text-brand-purple">Contact</a></li>
              <li><a href="#" className="hover:text-brand-purple">Help Center</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AutoApply AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
