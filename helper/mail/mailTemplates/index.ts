import { EmailTemplate, WelcomeEmailData, VerificationEmailData, NotificationEmailData, OTPVerificationEmailData, FeeReminderEmailData } from '../types'

export class EmailTemplates {
  static welcome(data: WelcomeEmailData): EmailTemplate {
    return {
      subject: `Welcome to Our Platform, ${data.name}!`,
      text: `Hello ${data.name}, welcome to our platform!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome, ${data.name}!</h1>
          <p>We're excited to have you on board. Your account has been created successfully.</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `
    }
  }

  static otpVerification(data: OTPVerificationEmailData ): EmailTemplate {
    return {
      subject: 'Verify Your Email Address with OTP',
      text: `Hello ${data.name}, please use the following OTP to verify your email: ${data.otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>
          <p>Hello ${data.name},</p>
          <p>Thank you for Choosing Kaushaly Home Learning! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: #007bff; 
                         color: white; 
                         padding: 15px 30px; 
                         font-size: 24px; 
                         font-weight: bold; 
                         letter-spacing: 5px; 
                         border-radius: 5px; 
                         display: inline-block;">
              ${data.otp}
            </span>
          </div>
          
          <p>Please enter this OTP in the verification form to confirm your email address.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This OTP will expire in 10 minutes. If you didn't request this verification, you can safely ignore this email.
          </p>
        </div>
      `
    }
  }



  static verification(data: VerificationEmailData): EmailTemplate {
    return {
      subject: 'Verify Your Email Address',
      text: `Hello ${data.name}, please verify your email by clicking: ${data.verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>
          <p>Hello ${data.name},</p>
          <p>Thank you for Registring at Kaushaly! To complete your registration, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" 
               style="background-color: #007bff; 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;
                      display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 14px;">${data.verificationUrl}</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
          <p style=" font-size: 6px;">
            If the token is expired please redo the registration process.
          </p>
        </div>
      `
    }
  }

  static notification(data: NotificationEmailData): EmailTemplate {
    return {
      subject: data.title,
      text: `Hello ${data.name}, ${data.message} ${data.actionUrl ? `Action required: ${data.actionUrl}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${data.title}</h1>
          <p>Hello ${data.name},</p>
          <p>${data.message}</p>
          ${data.actionUrl ? `
            <div style="margin: 20px 0;">
              <a href="${data.actionUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Take Action
              </a>
            </div>
          ` : ''}
          <p>Best regards,<br>The Team</p>
        </div>
      `
    }
  }

  static feeReminder(data: FeeReminderEmailData): EmailTemplate {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[data.month - 1];
    const dueDateStr = data.dueDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return {
      subject: `Fee Payment Reminder - ${monthName} ${data.year}`,
      text: `Dear ${data.studentName}, this is reminder ${data.reminderCount} for your fee payment of ₹${data.amount} due by ${dueDateStr}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc3545; text-align: center;">Fee Payment Reminder</h1>
          <p>Dear ${data.studentName},</p>
          <p>This is reminder <strong>${data.reminderCount}</strong> for your monthly fee payment.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Payment Details:</h3>
            <p><strong>Month:</strong> ${monthName} ${data.year}</p>
            <p><strong>Amount Due:</strong> ₹${data.amount.toLocaleString('en-IN')}</p>
            <p><strong>Due Date:</strong> ${dueDateStr}</p>
          </div>

          <p>Please ensure your payment is made before the due date to avoid any late fees or service interruptions.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Make Payment
            </a>
          </div>

          <p>If you have already made the payment, please disregard this reminder.</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated reminder. For any queries, please contact our support team.
          </p>
        </div>
      `
    }
  }
}
