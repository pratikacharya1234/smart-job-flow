
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentRole: boolean;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  isLoggedIn: boolean;
  experiences: Experience[];
  education: Education[];
  skills: string[];
}

interface UserContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addExperience: (experience: Omit<Experience, "id">) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
}

const defaultUser: UserProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  title: "",
  summary: "",
  isLoggedIn: false,
  experiences: [],
  education: [],
  skills: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, session } = useAuth();
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [loading, setLoading] = useState(true);

  // Load user profile from Supabase when authUser changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) {
        setUser({...defaultUser, isLoggedIn: false});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }
        
        if (data) {
          // Transform data from database format to app format
          setUser({
            name: data.name || authUser.user_metadata?.name || '',
            email: data.email || authUser.email || '',
            phone: data.phone || '',
            location: data.location || '',
            title: data.title || '',
            summary: data.summary || '',
            isLoggedIn: true,
            experiences: Array.isArray(data.experience) ? data.experience : [],
            education: Array.isArray(data.education) ? data.education : [],
            skills: Array.isArray(data.skills) ? data.skills : [],
          });
        } else {
          // If no profile exists yet, initialize with data from auth user
          setUser({
            ...defaultUser,
            name: authUser.user_metadata?.name || '',
            email: authUser.email || '',
            isLoggedIn: true,
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
        
        // Set basic user info from auth
        setUser({
          ...defaultUser,
          name: authUser.user_metadata?.name || '',
          email: authUser.email || '',
          isLoggedIn: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [authUser]);
  
  // Save updated user profile to Supabase
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authUser) return;
    
    try {
      // Update local state first for instant UI feedback
      setUser((prev) => ({ ...prev, ...updates }));
      
      // Transform app format to database format
      const profileUpdates: any = {};
      
      if ('name' in updates) profileUpdates.name = updates.name;
      if ('email' in updates) profileUpdates.email = updates.email;
      if ('phone' in updates) profileUpdates.phone = updates.phone;
      if ('location' in updates) profileUpdates.location = updates.location;
      if ('title' in updates) profileUpdates.title = updates.title;
      if ('summary' in updates) profileUpdates.summary = updates.summary;
      if ('skills' in updates) profileUpdates.skills = updates.skills;
      if ('experiences' in updates) profileUpdates.experience = updates.experiences;
      if ('education' in updates) profileUpdates.education = updates.education;
      
      profileUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: authUser.id, 
          ...profileUpdates 
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been saved",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const addExperience = (experience: Omit<Experience, "id">) => {
    const id = Date.now().toString();
    const newExperiences = [...user.experiences, { ...experience, id }];
    
    setUser(prev => ({
      ...prev,
      experiences: newExperiences
    }));
    
    // Save to database
    updateProfile({ experiences: newExperiences });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    const updatedExperiences = user.experiences.map((exp) =>
      exp.id === id ? { ...exp, ...updates } : exp
    );
    
    setUser(prev => ({
      ...prev,
      experiences: updatedExperiences
    }));
    
    // Save to database
    updateProfile({ experiences: updatedExperiences });
  };

  const removeExperience = (id: string) => {
    const filteredExperiences = user.experiences.filter((exp) => exp.id !== id);
    
    setUser(prev => ({
      ...prev,
      experiences: filteredExperiences
    }));
    
    // Save to database
    updateProfile({ experiences: filteredExperiences });
  };

  const addEducation = (education: Omit<Education, "id">) => {
    const id = Date.now().toString();
    const newEducation = [...user.education, { ...education, id }];
    
    setUser(prev => ({
      ...prev,
      education: newEducation
    }));
    
    // Save to database
    updateProfile({ education: newEducation });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    const updatedEducation = user.education.map((edu) =>
      edu.id === id ? { ...edu, ...updates } : edu
    );
    
    setUser(prev => ({
      ...prev,
      education: updatedEducation
    }));
    
    // Save to database
    updateProfile({ education: updatedEducation });
  };

  const removeEducation = (id: string) => {
    const filteredEducation = user.education.filter((edu) => edu.id !== id);
    
    setUser(prev => ({
      ...prev,
      education: filteredEducation
    }));
    
    // Save to database
    updateProfile({ education: filteredEducation });
  };

  const addSkill = (skill: string) => {
    if (!user.skills.includes(skill)) {
      const newSkills = [...user.skills, skill];
      
      setUser(prev => ({
        ...prev,
        skills: newSkills
      }));
      
      // Save to database
      updateProfile({ skills: newSkills });
    }
  };

  const removeSkill = (skill: string) => {
    const filteredSkills = user.skills.filter((s) => s !== skill);
    
    setUser(prev => ({
      ...prev,
      skills: filteredSkills
    }));
    
    // Save to database
    updateProfile({ skills: filteredSkills });
  };

  // These methods are kept for compatibility with existing code
  // but delegate to the AuthContext
  const login = (email: string, password: string) => {
    console.warn("UserContext.login is deprecated, use AuthContext.signIn instead");
  };

  const logout = () => {
    console.warn("UserContext.logout is deprecated, use AuthContext.signOut instead");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateProfile,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        removeSkill,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
