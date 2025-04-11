
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

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

interface UserContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfile: (updates: Partial<UserProfile>) => void;
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
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("autoapply_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("autoapply_user");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("autoapply_user", JSON.stringify(user));
    }
  }, [user, loading]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addExperience = (experience: Omit<Experience, "id">) => {
    const id = Date.now().toString();
    setUser((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { ...experience, id }],
    }));
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setUser((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setUser((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = (education: Omit<Education, "id">) => {
    const id = Date.now().toString();
    setUser((prev) => ({
      ...prev,
      education: [...prev.education, { ...education, id }],
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setUser((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setUser((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = (skill: string) => {
    if (!user.skills.includes(skill)) {
      setUser((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setUser((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const login = (email: string, password: string) => {
    // Simple mock login functionality
    setUser((prev) => ({
      ...prev,
      email,
      isLoggedIn: true,
    }));
  };

  const logout = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
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
