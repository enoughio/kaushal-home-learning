"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface TeacherProfileFormProps {
  user: User
}

const availableSkills = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Computer Science",
  "History",
  "Geography",
  "Economics",
  "Accounting",
]

export function TeacherProfileForm({ user }: TeacherProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    location: "",
    phone: "",
    experience: "",
    idProof: "",
    skillsToTeach: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsToTeach: prev.skillsToTeach.includes(skill)
        ? prev.skillsToTeach.filter((s) => s !== skill)
        : [...prev.skillsToTeach, skill],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await AuthService.saveTeacherProfile({
        userId: user.id,
        name: formData.name,
        location: formData.location,
        phone: formData.phone,
        experience: Number.parseInt(formData.experience),
        idProof: formData.idProof,
        skillsToTeach: formData.skillsToTeach,
      })

      router.push("/teacher")
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                required
                className="bg-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="City, Area"
              required
              className="bg-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                required
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idProof">ID Proof Number</Label>
              <Input
                id="idProof"
                value={formData.idProof}
                onChange={(e) => setFormData((prev) => ({ ...prev, idProof: e.target.value }))}
                placeholder="Aadhar/PAN/Driving License"
                required
                className="bg-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills you can teach</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableSkills.map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  variant={formData.skillsToTeach.includes(skill) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSkillToggle(skill)}
                  className="justify-start"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Your profile will be reviewed by our admin team before being approved. You'll be
              notified once your profile is approved and you can start teaching.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving Profile..." : "Submit for Approval"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
