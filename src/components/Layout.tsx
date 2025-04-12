
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { JobProvider } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Crown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: subscriptionData } = useQuery({
    queryKey: ["layout-subscription-status"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke("check-subscription");
        
        if (error) {
          console.error("Error checking subscription:", error);
          return { subscribed: false };
        }
        
        return data;
      } catch (error) {
        console.error("Failed to check subscription status:", error);
        return { subscribed: false };
      }
    },
  });

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
                  <Link to="/profile" className="text-sm text-gray-600 hover:text-brand-purple">
                    {user.user_metadata?.name || user.email}
                    {subscriptionData?.subscribed && (
                      <span className="ml-2 inline-flex items-center">
                        <Crown className="h-3 w-3 text-brand-purple mr-1" />
                        <span className="text-brand-purple text-xs">Premium</span>
                      </span>
                    )}
                  </Link>
                </div>
                {!subscriptionData?.subscribed && (
                  <Link to="/premium">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center text-brand-purple border-brand-purple hover:bg-brand-purple/10"
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      Upgrade
                    </Button>
                  </Link>
                )}
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
