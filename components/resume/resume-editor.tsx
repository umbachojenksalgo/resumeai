"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import type { ResumeData, Experience, Education, Project, SkillGroup } from "@/types/resume";

interface ResumeEditorProps {
  resume: ResumeData;
  onChange: (resume: ResumeData) => void;
}

export function ResumeEditor({ resume, onChange }: ResumeEditorProps) {
  const updatePersonal = (field: string, value: string) => {
    onChange({
      ...resume,
      personal: { ...resume.personal, [field]: value },
    });
  };

  const updateSummary = (value: string) => {
    onChange({ ...resume, summary: value });
  };

  const addExperience = () => {
    const newExp: Experience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    };
    onChange({ ...resume, experience: [...resume.experience, newExp] });
  };

  const updateExperience = (index: number, field: string, value: string | boolean | string[]) => {
    const updated = [...resume.experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, experience: updated });
  };

  const removeExperience = (index: number) => {
    onChange({ ...resume, experience: resume.experience.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      school: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
    };
    onChange({ ...resume, education: [...resume.education, newEdu] });
  };

  const updateEducation = (index: number, field: string, value: string | string[]) => {
    const updated = [...resume.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, education: updated });
  };

  const removeEducation = (index: number) => {
    onChange({ ...resume, education: resume.education.filter((_, i) => i !== index) });
  };

  const addProject = () => {
    const newProj: Project = { name: "", description: "", techStack: [] };
    onChange({ ...resume, projects: [...resume.projects, newProj] });
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    const updated = [...resume.projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, projects: updated });
  };

  const removeProject = (index: number) => {
    onChange({ ...resume, projects: resume.projects.filter((_, i) => i !== index) });
  };

  const addSkillGroup = () => {
    const newGroup: SkillGroup = { category: "", items: [] };
    onChange({ ...resume, skills: [...resume.skills, newGroup] });
  };

  const updateSkillGroup = (index: number, field: string, value: string | string[]) => {
    const updated = [...resume.skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, skills: updated });
  };

  const removeSkillGroup = (index: number) => {
    onChange({ ...resume, skills: resume.skills.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">个人信息</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Input placeholder="姓名" value={resume.personal.name} onChange={(e) => updatePersonal("name", e.target.value)} />
          <Input placeholder="职位" value={resume.personal.title} onChange={(e) => updatePersonal("title", e.target.value)} />
          <Input placeholder="邮箱" type="email" value={resume.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} />
          <Input placeholder="电话" value={resume.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} />
          <Input placeholder="所在地" value={resume.personal.location} onChange={(e) => updatePersonal("location", e.target.value)} />
          <Input placeholder="网站" value={resume.personal.website || ""} onChange={(e) => updatePersonal("website", e.target.value)} />
          <Input placeholder="LinkedIn" value={resume.personal.linkedin || ""} onChange={(e) => updatePersonal("linkedin", e.target.value)} />
          <Input placeholder="GitHub" value={resume.personal.github || ""} onChange={(e) => updatePersonal("github", e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">个人简介</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="用2-3句话概括你的职业亮点..."
            value={resume.summary}
            onChange={(e) => updateSummary(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">工作经历</CardTitle>
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="mr-1 h-3 w-3" /> 添加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume.experience.map((exp, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{exp.company || "新经历"}</Badge>
                <Button variant="ghost" size="icon" onClick={() => removeExperience(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="公司" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                <Input placeholder="职位" value={exp.position} onChange={(e) => updateExperience(i, "position", e.target.value)} />
                <Input placeholder="开始时间" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} />
                <Input placeholder="结束时间" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} />
              </div>
              <Textarea
                placeholder="工作描述（每行一条）"
                value={exp.description.join("\n")}
                onChange={(e) => updateExperience(i, "description", e.target.value.split("\n"))}
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">教育背景</CardTitle>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="mr-1 h-3 w-3" /> 添加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume.education.map((edu, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{edu.school || "新学历"}</Badge>
                <Button variant="ghost" size="icon" onClick={() => removeEducation(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="学校" value={edu.school} onChange={(e) => updateEducation(i, "school", e.target.value)} />
                <Input placeholder="学位" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                <Input placeholder="专业" value={edu.major} onChange={(e) => updateEducation(i, "major", e.target.value)} />
                <Input placeholder="GPA" value={edu.gpa || ""} onChange={(e) => updateEducation(i, "gpa", e.target.value)} />
                <Input placeholder="开始时间" value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} />
                <Input placeholder="结束时间" value={edu.endDate} onChange={(e) => updateEducation(i, "endDate", e.target.value)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">项目经历</CardTitle>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="mr-1 h-3 w-3" /> 添加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume.projects.map((proj, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{proj.name || "新项目"}</Badge>
                <Button variant="ghost" size="icon" onClick={() => removeProject(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Input placeholder="项目名称" value={proj.name} onChange={(e) => updateProject(i, "name", e.target.value)} />
              <Textarea placeholder="项目描述" value={proj.description} onChange={(e) => updateProject(i, "description", e.target.value)} rows={2} />
              <Input
                placeholder="技术栈（逗号分隔）"
                value={proj.techStack.join(", ")}
                onChange={(e) => updateProject(i, "techStack", e.target.value.split(",").map((s) => s.trim()))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">技能</CardTitle>
          <Button variant="outline" size="sm" onClick={addSkillGroup}>
            <Plus className="mr-1 h-3 w-3" /> 添加分组
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume.skills.map((group, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{group.category || "新分组"}</Badge>
                <Button variant="ghost" size="icon" onClick={() => removeSkillGroup(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Input placeholder="类别名" value={group.category} onChange={(e) => updateSkillGroup(i, "category", e.target.value)} />
              <Input
                placeholder="技能（逗号分隔）"
                value={group.items.join(", ")}
                onChange={(e) => updateSkillGroup(i, "items", e.target.value.split(",").map((s) => s.trim()))}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
