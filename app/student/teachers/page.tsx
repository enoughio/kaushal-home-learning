"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MockDataService, type TeacherSearchResult } from "@/lib/mockData"
import { AuthService, type StudentProfile } from "@/lib/auth"
import { Search, MapPin, Star, Clock, Phone } from "lucide-react"

export default function FindTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherSearchResult[]>([])
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const user = AuthService.getCurrentUser()
      if (user) {
        const profile = await AuthService.getStudentProfile(user.id)
        setStudentProfile(profile)
        if (profile) {
          setSearchLocation(profile.location)
          setSelectedSkills(profile.skillsToLearn)
          // Auto-search based on profile
          searchTeachers(profile.location, profile.skillsToLearn)
        }
      }
    }
    loadProfile()
  }, [])

  const searchTeachers = async (location: string, skills: string[]) => {
    setLoading(true)
    try {
      const results = await MockDataService.searchTeachers(location, skills)
      setTeachers(results)
    } catch (error) {
      console.error("Failed to search teachers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    searchTeachers(searchLocation, selectedSkills)
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

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Find Teachers</h1>
          <p className="text-muted-foreground">Discover qualified teachers in your area</p>
        </div>

        {/* Search Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter your city or area"
                className="bg-input"
              />
            </div>

            <div className="space-y-2">
              <Label>Subjects</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableSkills.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSkill(skill)}
                    className="justify-start"
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "Search Teachers"}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Teachers</h2>
            <p className="text-muted-foreground">{teachers.length} teachers found</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Searching teachers...</p>
              </div>
            </div>
          ) : teachers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No teachers found matching your criteria.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Teacher Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{teacher.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {teacher.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {teacher.experience} years experience
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{teacher.rating}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{teacher.distance}</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <p className="text-sm font-medium mb-2">Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.skillsToTeach.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Rate */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <p className="text-lg font-bold">₹{teacher.hourlyRate}/hour</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm">Book Session</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
  )
}
