
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  requirePremium?: boolean;
}

const ProtectedRoute = ({ children, requirePremium = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [checkingPremium, setCheckingPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user && requirePremium) {
        try {
          setCheckingPremium(true);
          const { data, error } = await supabase.functions.invoke("check-subscription");
          
          if (error) {
            console.error("Error checking subscription:", error);
            setIsPremium(false);
          } else {
            setIsPremium(data?.subscribed || false);
          }
        } catch (error) {
          console.error("Failed to check premium status:", error);
          setIsPremium(false);
        } finally {
          setCheckingPremium(false);
        }
      } else if (!requirePremium) {
        setIsPremium(true); // Not required, so effectively "is premium" for this route
      }
    };

    checkPremiumStatus();
  }, [user, requirePremium]);

  if (loading || (requirePremium && checkingPremium)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requirePremium && !isPremium) {
    return <Navigate to="/premium" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
