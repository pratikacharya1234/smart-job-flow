
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { JobProvider } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <JobProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {user && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {user.user_metadata?.name || user.email}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </Button>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </JobProvider>
  );
};

export default Layout;
