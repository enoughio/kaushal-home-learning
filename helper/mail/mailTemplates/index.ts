import { EmailTemplate, WelcomeEmailData, VerificationEmailData, NotificationEmailData, OTPVerificationEmailData, FeeReminderEmailData, ApprovalEmailData, RejectionEmailData } from '../types'

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

  static studentWelcome(data: WelcomeEmailData): EmailTemplate {
    return {
      subject: `Welcome to Kaushaly Home Learning, ${data.name}!`,
      text: `Hello ${data.name}, welcome to Kaushaly Home Learning!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Welcome to Kaushaly Home Learning!</h1>
          <p>Dear ${data.name},</p>
          <p>We're thrilled to welcome you to the Kaushaly Home Learning community! Your journey towards knowledge and growth begins here.</p>
          <p>Our team will soon contact you for further processing and providieng the best tutor for your child.</p>
          <p>Best regards,<br>The Kaushaly Team</p>
        </div>
      `
    }
  }


  static approval(data: ApprovalEmailData) : EmailTemplate {
    return {
      subject: 'Your Application Has Been Approved!',
      text: `Hello ${data.name}, congratulations! Your application has been approved. Please set your password using the forgot password option and login to the application.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #28a745; text-align: center;">Application Approved! 🎉</h1>
          <p>Dear ${data.name},</p>
          <p>Congratulations! Your application to become a teacher at Kaushaly Home Learning has been <strong>approved</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Next Steps:</h3>
            <p>To complete your account setup and start teaching, please follow these steps:</p>
            <ol style="color: #666;">
              <li>Visit the login page and click on <strong>"Forgot Password"</strong></li>
              <li>Enter your registered email address</li>
              <li>Follow the instructions to create a new password</li>
              <li>Log in to your account with your new password</li>
            </ol>
            <p>Date: <strong>${data.approvalDate}</strong></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Go to Login Page
            </a>
          </div>
          
          <p>Once you've set your password and logged in, you'll be able to access your teacher dashboard and start creating courses.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          <p style="color: #666; font-size: 12px;">
            Welcome to the Kaushaly Home Learning family!
          </p>
        </div>
      `
    }
  }


  static rejection(data: RejectionEmailData) : EmailTemplate {
    return {
      subject: 'Application Status Update',
      text: `Hello ${data.name}, we regret to inform you that your application has not been approved at this time.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc3545; text-align: center;">Application Status Update</h1>
          <p>Dear ${data.name},</p>
          <p>Thank you for applying to become a teacher at Kaushaly Home Learning. We appreciate your interest and the time you spent on your application.</p>
          
          <p>Unfortunately, we regret to inform you that your application has <strong>not been approved</strong> at this time.</p>
          
          <p>We encourage you to review your qualifications and consider reapplying in the future. We're always looking for talented educators to join our community.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reapply
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            If you have any questions or would like more detailed feedback on your application, please contact our support team.
          </p>
          <p style="color: #666; font-size: 12px;">
            We hope to see you again in the future!
          </p>
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
