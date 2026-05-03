import { create } from "zustand";
import type { ResumeData } from "@/types/resume";

interface ResumeStore {
  resume: ResumeData | null;
  rawText: string;
  isLoading: boolean;
  error: string | null;
  setResume: (resume: ResumeData) => void;
  setRawText: (text: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const emptyResume: ResumeData = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
  },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: [],
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: null,
  rawText: "",
  isLoading: false,
  error: null,
  setResume: (resume) => set({ resume, error: null }),
  setRawText: (rawText) => set({ rawText }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ resume: null, rawText: "", isLoading: false, error: null }),
}));

export { emptyResume };
