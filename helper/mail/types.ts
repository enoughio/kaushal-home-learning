export interface TransportConfig {
  host?: string
  service?: string,
  port?: number
  auth: {
    user: string
    pass: string
  }
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



export interface OTPVerificationEmailData {
  name: string;
  otp: number;
}



export interface NotificationEmailData {
  name: string
  title: string
  message: string
  actionUrl?: string
}

export interface FeeReminderEmailData {
  studentName: string
  month: number
  year: number
  amount: number
  dueDate: Date
  reminderCount: number
}
