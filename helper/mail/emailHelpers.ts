import { sendTemplateEmail } from './nodemailer' 
import { EmailTemplates } from './mailTemplates'
import { WelcomeEmailData, VerificationEmailData, NotificationEmailData, OTPVerificationEmailData } from './types'

export const sendWelcomeEmail = async (to: string, data: WelcomeEmailData): Promise<void> => {
  const template = EmailTemplates.welcome(data)
  await sendTemplateEmail(to, template)
}

export const sendOTPVerificationEmail = async (to: string, data: OTPVerificationEmailData): Promise<void> => {
  const template = EmailTemplates.otpVerification(data)
  await sendTemplateEmail(to, template)
}

export const sendVerificationEmail = async (to: string, data: VerificationEmailData): Promise<void> => {
  const template = EmailTemplates.verification(data)
  await sendTemplateEmail(to, template)
}

export const sendNotificationEmail = async (to: string, data: NotificationEmailData): Promise<void> => {
  const template = EmailTemplates.notification(data)
  await sendTemplateEmail(to, template)
}

// Batch email sending
export const sendBulkEmails = async (emails: { to: string; template: any }[]): Promise<void> => {
  const promises = emails.map(email => 
    sendTemplateEmail(email.to, email.template)
  )
  
  await Promise.allSettled(promises)
}