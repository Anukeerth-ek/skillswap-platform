"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
// import { updateProfile } from "./api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const dummySkills = [
  { label: "JavaScript", value: "JavaScript" },
  { label: "Python", value: "Python" },
  { label: "React", value: "React" },
  { label: "UI/UX", value: "UIUX" },
];

export default function ProfileSetupForm() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<"MENTOR" | "LEARNER" | "BOTH">("LEARNER");
  const [timeZone, setTimeZone] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-detect user time zone
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // await updateProfile({
      //   bio,
      //   role,
      //   timeZone,
      //   skillsOffered,
      //   skillsWanted,
      // });
      toast.success("Profile saved");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Bio</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <Label>Your Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as any)}>
          <SelectItem value="MENTOR">Mentor</SelectItem>
          <SelectItem value="LEARNER">Learner</SelectItem>
          <SelectItem value="BOTH">Both</SelectItem>
        </Select>
      </div>

      <div>
        <Label>Time Zone</Label>
        <Input value={timeZone} readOnly />
      </div>

      <div>
        <Label>Skills You Can Teach</Label>
        <MultiSelect
          options={dummySkills}
          selected={skillsOffered}
          onChange={setSkillsOffered}
          placeholder="Select skills you offer"
        />
      </div>

      <div>
        <Label>Skills You Want to Learn</Label>
        <MultiSelect
          options={dummySkills}
          selected={skillsWanted}
          onChange={setSkillsWanted}
          placeholder="Select skills you want"
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}
