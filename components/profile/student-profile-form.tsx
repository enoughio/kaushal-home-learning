"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface StudentProfileFormProps {
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

export function StudentProfileForm({ user }: StudentProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    age: "",
    location: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    skillsToLearn: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsToLearn: prev.skillsToLearn.includes(skill)
        ? prev.skillsToLearn.filter((s) => s !== skill)
        : [...prev.skillsToLearn, skill],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await AuthService.saveStudentProfile({
        userId: user.id,
        name: formData.name,
        age: Number.parseInt(formData.age),
        location: formData.location,
        phone: formData.phone,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        skillsToLearn: formData.skillsToLearn,
      })

      router.push("/student")
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Profile</CardTitle>
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
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentName: e.target.value }))}
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
              <Input
                id="parentPhone"
                value={formData.parentPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentPhone: e.target.value }))}
                className="bg-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills you want to learn</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableSkills.map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  variant={formData.skillsToLearn.includes(skill) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSkillToggle(skill)}
                  className="justify-start"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving Profile..." : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
