import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, FileText, BarChart2, Trello, FileCheck, Zap, ChevronDown, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

const LandingPage = () => {
  const { login, user } = useUser();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    const { error: loginError } = await signIn(email, password);
    setIsSubmitting(false);
    
    if (loginError) {
      setError(loginError.message);
    } else {
      setIsOpen(false);
      navigate('/dashboard');
      toast({
        title: "Logged in successfully",
        description: "Welcome to AutoApply AI",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("Please fill out all fields");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    const { error: signUpError } = await signUp(email, password, name);
    setIsSubmitting(false);
    
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setIsOpen(false);
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b shadow-sm bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-purple-dark bg-clip-text text-transparent">
          AutoApply AI
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-brand-purple transition-colors">
            {user.isLoggedIn ? 'Dashboard' : 'Demo'}
          </Link>
          
          {user.isLoggedIn ? (
            <Link to="/dashboard">
              <Button variant="default" className="bg-brand-purple hover:bg-brand-purple-dark">
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth" className="text-gray-600 hover:text-brand-purple transition-colors">
                Sign In
              </Link>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-brand-purple hover:bg-brand-purple-dark">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-brand-purple text-xl">
                      Welcome to AutoApply AI
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      Sign in or create an account to get started
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="register">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        {error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              type="text"
                              placeholder="John Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="register-password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 text-center bg-gradient-to-b from-white via-white to-brand-purple/5">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
          Land Your Dream Job with AI-Powered <span className="bg-gradient-to-r from-brand-purple to-brand-purple-dark bg-clip-text text-transparent">Application Tools</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          AutoApply AI streamlines your job search with tailored resumes, cover letters, and job application tracking — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-brand-purple hover:bg-brand-purple-dark">
                Try It Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
          </Dialog>
          <a href="#features">
            <Button variant="outline" size="lg" className="border-brand-purple text-brand-purple hover:bg-brand-purple/10">
              Learn More
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards with enhanced UI */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-brand-purple/20">
              <div className="bg-brand-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">AI Resume Generator</h3>
              <p className="text-gray-600">Create professionally tailored resumes for each job application with our AI assistant.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-brand-purple/20">
              <div className="bg-brand-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Cover Letter Builder</h3>
              <p className="text-gray-600">Generate customized cover letters that highlight your relevant skills and experiences.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-brand-purple/20">
              <div className="bg-brand-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Job Match Analysis</h3>
              <p className="text-gray-600">Get instant feedback on how well your profile matches a job description with our fit score.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-brand-purple/20">
              <div className="bg-brand-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Trello className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Application Tracker</h3>
              <p className="text-gray-600">Stay organized with a Kanban-style board to track all your job applications in one place.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-brand-purple/20">
              <div className="bg-brand-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Auto-Fill Forms</h3>
              <p className="text-gray-600">Save time by automatically filling application forms with your stored profile information.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-brand-purple/20">
              <div className="bg-brand-purple/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Check className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">One-Click Apply</h3>
              <p className="text-gray-600">Simulate one-click job applications with our browser extension simulation feature.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Simple Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-8 bg-white hover:shadow-md transition-shadow border-gray-200">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Free Plan</h3>
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
              <Link to="/auth?tab=register">
                <Button className="w-full border-brand-purple text-brand-purple hover:bg-brand-purple/10" variant="outline">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-8 bg-gradient-to-b from-brand-purple/10 to-white relative shadow-md">
              <div className="absolute top-0 right-0 bg-brand-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Pro Plan</h3>
              <p className="text-4xl font-bold mb-6">$5.99<span className="text-lg text-gray-500 font-normal">/month</span></p>
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
              <Link to="/premium">
                <Button className="w-full bg-brand-purple hover:bg-brand-purple-dark">
                  Buy Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Supercharge Your Job Search?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of job seekers who use AutoApply AI to land their dream jobs faster.</p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="lg">
                Try AutoApply AI Today
              </Button>
            </DialogTrigger>
          </Dialog>
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
