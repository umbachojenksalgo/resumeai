import { z } from "zod";

export const personalInfoSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  title: z.string().min(1, "职位不能为空"),
  email: z.string().email("邮箱格式不正确").or(z.string().length(0)),
  phone: z.string(),
  location: z.string(),
  website: z.string().url().optional().or(z.string().length(0)),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string(),
  current: z.boolean().default(false),
  description: z.array(z.string()),
});

export const educationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  major: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  gpa: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()),
  link: z.string().optional(),
});

export const skillGroupSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string()),
});

export const languageSchema = z.object({
  name: z.string().min(1),
  proficiency: z.string().min(1),
});

export const resumeDataSchema = z.object({
  personal: personalInfoSchema,
  summary: z.string().min(1, "个人简介不能为空"),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillGroupSchema),
  languages: z.array(languageSchema),
  certifications: z.array(z.string()),
});

export type ResumeDataInput = z.infer<typeof resumeDataSchema>;
