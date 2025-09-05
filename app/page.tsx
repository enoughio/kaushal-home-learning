"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Shield, Star, MapPin, Clock, Award } from "lucide-react"

export default function HomePage() {
  const [teacherModalOpen, setTeacherModalOpen] = useState(false)
  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const subjects = [
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
    "Music",
    "Art",
    "Dance",
    "Cooking",
    "Language Learning",
  ]

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to Google Sheets API
    console.log("Teacher form submitted")
    setTeacherModalOpen(false)
  }

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to Google Sheets API
    console.log("Student form submitted")
    setStudentModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Kaushaly Home Learning</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">Learn Any Skill At Home</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Find skilled teachers nearby or offer your expertise as a tutor. Connect with trusted educators for
            personalized learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6">
                  Find a Tutor
                </Button>
              </DialogTrigger>
            </Dialog>
            <Dialog open={teacherModalOpen} onOpenChange={setTeacherModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                  Become a Tutor
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Are You a Teacher or Student Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">Are You a Teacher or Student?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Dialog open={teacherModalOpen} onOpenChange={setTeacherModalOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50">
                  <CardHeader className="text-center py-12">
                    <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                    <CardTitle className="text-2xl">I'm a Teacher</CardTitle>
                    <CardDescription className="text-lg">
                      Share your knowledge and earn by teaching students
                    </CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Join as a Teacher</DialogTitle>
                  <DialogDescription>
                    Fill out your details to start teaching and connect with students
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTeacherSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teacher-full-name">Full Name *</Label>
                      <Input id="teacher-full-name" required />
                    </div>
                    <div>
                      <Label htmlFor="teacher-email">Email Address *</Label>
                      <Input id="teacher-email" type="email" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teacher-phone">Phone Number *</Label>
                      <Input id="teacher-phone" type="tel" required />
                    </div>
                    <div>
                      <Label htmlFor="teacher-whatsapp">WhatsApp Number *</Label>
                      <Input id="teacher-whatsapp" type="tel" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="teacher-address">Full Address *</Label>
                    <Textarea id="teacher-address" placeholder="Street, City, State, Pincode" required />
                  </div>

                  <div>
                    <Label htmlFor="teacher-resume">Resume (Google Drive Link) *</Label>
                    <Input id="teacher-resume" type="url" placeholder="https://drive.google.com/..." required />
                    <p className="text-sm text-muted-foreground mt-1">
                      Please share a public Google Drive link to your resume
                    </p>
                  </div>

                  <div>
                    <Label>Subjects/Skills You Teach *</Label>
                    <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg min-h-[60px]">
                      {subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleSubject(subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Select at least one subject you can teach</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teacher-location">Location (City/Pincode) *</Label>
                      <Input id="teacher-location" required />
                    </div>
                    <div>
                      <Label htmlFor="teacher-experience">Years of Experience *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="2-5">2-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="teacher-availability">Availability *</Label>
                    <Textarea
                      id="teacher-availability"
                      placeholder="e.g., Weekdays 4-8 PM, Weekends 10 AM-6 PM"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="teacher-photo">Profile Picture</Label>
                    <Input id="teacher-photo" type="file" accept="image/*" />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50">
                  <CardHeader className="text-center py-12">
                    <Users className="h-16 w-16 text-secondary mx-auto mb-4" />
                    <CardTitle className="text-2xl">I'm a Student</CardTitle>
                    <CardDescription className="text-lg">
                      Find the perfect tutor for your learning needs
                    </CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Find Your Tutor</DialogTitle>
                  <DialogDescription>
                    Tell us what you want to learn and we'll connect you with the right teacher
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleStudentSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student-full-name">Full Name *</Label>
                      <Input id="student-full-name" required />
                    </div>
                    <div>
                      <Label htmlFor="student-email">Email Address *</Label>
                      <Input id="student-email" type="email" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student-phone">Phone Number *</Label>
                      <Input id="student-phone" type="tel" required />
                    </div>
                    <div>
                      <Label htmlFor="student-whatsapp">WhatsApp Number *</Label>
                      <Input id="student-whatsapp" type="tel" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="student-address">Full Address *</Label>
                    <Textarea id="student-address" placeholder="Street, City, State, Pincode" required />
                  </div>

                  <div>
                    <Label htmlFor="student-resume">Resume/CV (Google Drive Link) *</Label>
                    <Input id="student-resume" type="url" placeholder="https://drive.google.com/..." required />
                    <p className="text-sm text-muted-foreground mt-1">
                      Please share a public Google Drive link to your resume or academic profile
                    </p>
                  </div>

                  <div>
                    <Label>Subjects You Want to Learn *</Label>
                    <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg min-h-[60px]">
                      {subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleSubject(subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Select at least one subject you want to learn</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student-location">Location (City/Pincode) *</Label>
                      <Input id="student-location" required />
                    </div>
                    <div>
                      <Label htmlFor="student-grade">Age/Grade *</Label>
                      <Input id="student-grade" placeholder="e.g., Grade 10, Age 25" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="learning-mode">Preferred Learning Mode *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select learning preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="in-person">In-person</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Find My Tutor
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose Kaushaly Home Learning?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>For Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Easily find trusted, verified tutors in your area. Get personalized learning experiences tailored to
                  your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle>For Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with motivated students and grow your teaching practice. Flexible scheduling and competitive
                  rates.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>For Everyone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simple, secure, and reliable platform. Easy booking, safe payments, and 24/7 customer support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">Kaushaly Home Learning</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting students with skilled tutors for personalized home learning experiences.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Find Tutors
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Become a Tutor
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>India</span>
                </div>
                <p>Email: info@kaushaly.com</p>
                <p>Phone: +91 XXXXX XXXXX</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Kaushaly Home Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
