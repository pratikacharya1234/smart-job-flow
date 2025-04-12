
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Feature {
  name: string;
  free: boolean;
  premium: boolean;
}

const features: Feature[] = [
  { name: "Basic profile creation", free: true, premium: true },
  { name: "Job tracking", free: true, premium: true },
  { name: "Resume analysis", free: true, premium: true },
  { name: "Limited AI generations (3/month)", free: true, premium: true },
  { name: "Unlimited AI generations", free: false, premium: true },
  { name: "Export/import data", free: false, premium: true },
  { name: "No watermarks on documents", free: false, premium: true },
  { name: "Priority support", free: false, premium: true },
];

export default function PremiumFeatures() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Check subscription status
  const { data: subscriptionStatus, isLoading: checkingSubscription } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      if (!user) return { subscribed: false };
      
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
    enabled: !!user,
  });

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to subscribe to premium features.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("create-checkout");
      
      if (error) {
        throw error;
      }

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Upgrade to Premium</h1>
        <p className="text-muted-foreground mt-2">
          Unlock all features and supercharge your job applications
        </p>
      </div>

      {checkingSubscription ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      ) : subscriptionStatus?.subscribed ? (
        <div className="text-center p-6 bg-green-50 rounded-xl mb-8 border border-green-200">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-green-700">You're a Premium Member!</h2>
          <p className="text-green-600 mt-2">
            You have full access to all premium features. Thank you for your support!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Basic features to get started</CardDescription>
              <div className="text-3xl font-bold mt-2">$0</div>
            </CardHeader>
            <CardContent className="space-y-2">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center">
                  {feature.free ? (
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="mr-2 h-5 w-5 text-gray-300" />
                  )}
                  <span className={!feature.free ? "text-gray-400" : ""}>{feature.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-brand-purple bg-brand-purple/5">
            <CardHeader>
              <CardTitle>Premium Plan</CardTitle>
              <CardDescription>All features unlocked</CardDescription>
              <div className="text-3xl font-bold mt-2">$5.99<span className="text-base font-normal">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-2">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center">
                  {feature.premium ? (
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="mr-2 h-5 w-5 text-gray-300" />
                  )}
                  <span>{feature.name}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
