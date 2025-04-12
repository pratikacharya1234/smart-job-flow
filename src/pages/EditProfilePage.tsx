
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Crown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const EditProfilePage = () => {
  const { user, updateProfile, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
  });
  
  // Check premium subscription status
  const { data: subscriptionData, isLoading: checkingSubscription } = useQuery({
    queryKey: ["subscription-status"],
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

  useEffect(() => {
    if (!userLoading && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        title: user.title || "",
        summary: user.summary || "",
      });
    }
  }, [user, userLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        {!checkingSubscription && (
          <div className="flex items-center">
            {subscriptionData?.subscribed ? (
              <Badge className="bg-brand-purple flex items-center gap-1 py-1">
                <Crown className="h-3 w-3" />
                Premium Member
              </Badge>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/premium'}
                className="flex items-center gap-1"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Write a brief professional summary..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePage;
