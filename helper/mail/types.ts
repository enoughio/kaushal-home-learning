export interface TransportConfig {
  host?: string
  service?: string,
  port?: number
  auth: {
    user: string
    pass: string
  }
}

export type AttendanceStatus = "present" | "absent" | "none"
export type DayAttendance = {
  date: string // YYYY-MM-DD
  status: AttendanceStatus
}


export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export interface EmailTemplate {
  subject: string
  text?: string
  html: string
}

export interface WelcomeEmailData {
  name: string
  activationUrl?: string
}

export interface VerificationEmailData {
  name: string
  verificationToken: string
  verificationUrl: string
}

export interface NotificationEmailData {
  name: string
  title: string
  message: string
  actionUrl?: string
}
