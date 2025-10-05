//to be removed we are not using nodemailer anymore

import nodemailer, { Transporter } from "nodemailer";
import { EmailTemplate, EmailOptions, TransportConfig } from "./types";

const createTransporter = (): Transporter => {

  // for offical SMTP server 

  // const config: TransportConfig = {
  //   host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  //   port: parseInt(process.env.SMTP_PORT || "2525"),
  //   auth: {
  //     user: process.env.SMTP_USER || "2e09ea2a5f16b4",
  //     pass: process.env.SMTP_PASS || "8c278a9c77969b"
  //   }
  // }

// TODO: Remove it on Production 
  // temprary Setup with gmail

  const config: TransportConfig = {
    service: "gmail",
    auth: {
      user: process.env.FROM_EMAIL!,
      pass: process.env.GOOGLE_APP_PASSWORD!,
    },
  };
  return nodemailer.createTransport(config);
};

const transporter = createTransporter();


// main sender function
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL!,
      to: options.to,
      subject: options.subject,
      text: options.text,  // fallback for text
      html: options.html,  // main content
  });
  
  console.log("Message sent:", info.messageId);

  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};


export const sendTemplateEmail = async (
  to: string,
  template: EmailTemplate
): Promise<void> => {
  await sendEmail({
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};
