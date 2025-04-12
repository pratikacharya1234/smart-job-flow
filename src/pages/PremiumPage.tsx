
import PremiumFeatures from "@/components/PremiumFeatures";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";

const PremiumPage = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Check for success or error parameters in the URL
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    
    if (success === "true") {
      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our premium plan!",
        variant: "default",
      });
    } else if (error) {
      toast({
        title: "Subscription error",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <PremiumFeatures />
      </div>
    </div>
  );
};

export default PremiumPage;
