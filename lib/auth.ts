// Mock authentication service
export interface User {
  id: string
  email: string
  name: string
  role: "student" | "teacher" | "admin"
  profileComplete: boolean
  approved?: boolean // For teachers
}

export interface StudentProfile {
  id: string
  userId: string
  name: string
  age: number
  location: string
  skillsToLearn: string[]
  phone: string
  parentName?: string
  parentPhone?: string
}

export interface TeacherProfile {
  id: string
  userId: string
  name: string
  location: string
  skillsToTeach: string[]
  experience: number
  phone: string
  idProof: string
  approved: boolean
  rating: number
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@kaushaly.com",
    name: "Admin User",
    role: "admin",
    profileComplete: true,
  },
  {
    id: "2",
    email: "student@example.com",
    name: "John Doe",
    role: "student",
    profileComplete: true,
  },
  {
    id: "3",
    email: "teacher@example.com",
    name: "Jane Smith",
    role: "teacher",
    profileComplete: true,
    approved: true,
  },
]

const mockStudentProfiles: StudentProfile[] = [
  {
    id: "1",
    userId: "2",
    name: "John Doe",
    age: 16,
    location: "Mumbai",
    skillsToLearn: ["Mathematics", "Physics"],
    phone: "+91 9876543210",
    parentName: "Robert Doe",
    parentPhone: "+91 9876543211",
  },
]

const mockTeacherProfiles: TeacherProfile[] = [
  {
    id: "1",
    userId: "3",
    name: "Jane Smith",
    location: "Mumbai",
    skillsToTeach: ["Mathematics", "Physics", "Chemistry"],
    experience: 5,
    phone: "+91 9876543212",
    idProof: "AADHAR123456789",
    approved: true,
    rating: 4.8,
  },
]

export class AuthService {
  private static currentUser: User | null = null

  static async login(email: string, password: string): Promise<User> {
    // Mock login - in real app, this would call your backend
    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      throw new Error("Invalid credentials")
    }
    this.currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }

  static async register(email: string, password: string, name: string, role: "student" | "teacher"): Promise<User> {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      profileComplete: false,
      approved: role === "teacher" ? false : undefined,
    }
    mockUsers.push(newUser)
    this.currentUser = newUser
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    return newUser
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    const stored = localStorage.getItem("currentUser")
    if (stored) {
      this.currentUser = JSON.parse(stored)
      return this.currentUser
    }
    return null
  }

  static logout(): void {
    this.currentUser = null
    localStorage.removeItem("currentUser")
  }

  static async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    return mockStudentProfiles.find((p) => p.userId === userId) || null
  }

  static async getTeacherProfile(userId: string): Promise<TeacherProfile | null> {
    return mockTeacherProfiles.find((p) => p.userId === userId) || null
  }

  static async saveStudentProfile(profile: Omit<StudentProfile, "id">): Promise<StudentProfile> {
    const newProfile: StudentProfile = {
      ...profile,
      id: Date.now().toString(),
    }
    mockStudentProfiles.push(newProfile)

    // Update user profile completion status
    const user = mockUsers.find((u) => u.id === profile.userId)
    if (user) {
      user.profileComplete = true
      this.currentUser = user
      localStorage.setItem("currentUser", JSON.stringify(user))
    }

    return newProfile
  }

  static async saveTeacherProfile(
    profile: Omit<TeacherProfile, "id" | "approved" | "rating">,
  ): Promise<TeacherProfile> {
    const newProfile: TeacherProfile = {
      ...profile,
      id: Date.now().toString(),
      approved: false,
      rating: 0,
    }
    mockTeacherProfiles.push(newProfile)

    // Update user profile completion status
    const user = mockUsers.find((u) => u.id === profile.userId)
    if (user) {
      user.profileComplete = true
      this.currentUser = user
      localStorage.setItem("currentUser", JSON.stringify(user))
    }

    return newProfile
  }

  static async getApprovedTeachers(): Promise<TeacherProfile[]> {
    return mockTeacherProfiles.filter((t) => t.approved)
  }

  static async getAllUsers(): Promise<User[]> {
    return mockUsers
  }

  static async getAllTeachers(): Promise<TeacherProfile[]> {
    return mockTeacherProfiles
  }

  static async getAllStudents(): Promise<StudentProfile[]> {
    return mockStudentProfiles
  }

  static async approveTeacher(teacherId: string): Promise<void> {
    const teacher = mockTeacherProfiles.find((t) => t.id === teacherId)
    if (teacher) {
      teacher.approved = true
      const user = mockUsers.find((u) => u.id === teacher.userId)
      if (user) {
        user.approved = true
      }
    }
  }
}
