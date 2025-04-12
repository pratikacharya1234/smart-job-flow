
import PremiumFeatures from "@/components/PremiumFeatures";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

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

  // Show a banner if there's a success or error param
  const success = searchParams.get("success") === "true";
  const error = searchParams.get("error");
  
  return (
    <div className="min-h-screen bg-background">
      {(success || error) && (
        <div className={`p-4 mb-6 border rounded-lg ${
          success 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <div className="flex items-center">
            {success ? (
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
            )}
            <div>
              <h3 className="font-medium">
                {success ? "Payment Successful" : "Payment Failed"}
              </h3>
              <p className="text-sm">
                {success 
                  ? "Thank you for subscribing! You now have access to all premium features." 
                  : error ? decodeURIComponent(error) : "There was a problem processing your payment."
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto py-6">
        <PremiumFeatures />
      </div>
    </div>
  );
};

export default PremiumPage;
