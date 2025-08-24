import nodemailer from 'nodemailer';
import { AppError } from './error-handler';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Validate email configuration
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration missing. Please check environment variables.');
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout and retry settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,    // 5 seconds
      socketTimeout: 15000,     // 15 seconds
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  async sendPasswordResetEmail(email: string, otp: string): Promise<void> {
    const template = this.getPasswordResetTemplate(otp);
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const template = this.getWelcomeTemplate(name);
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendPropertyApprovalEmail(email: string, propertyTitle: string, approved: boolean): Promise<void> {
    const template = this.getPropertyApprovalTemplate(propertyTitle, approved);
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendContactNotificationEmail(contactData: any): Promise<void> {
    const template = this.getContactNotificationTemplate(contactData);
    await this.sendEmail({
      to: process.env.EMAIL_USER!, // Send to admin
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendPropertyInquiryEmail(propertyOwner: string, inquiryData: any): Promise<void> {
    const template = this.getPropertyInquiryTemplate(inquiryData);
    await this.sendEmail({
      to: propertyOwner,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  private getPasswordResetTemplate(otp: string): EmailTemplate {
    return {
      subject: 'Password Reset - ZameenKhatta',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .otp-box { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ZameenKhatta</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>You have requested to reset your password. Use the OTP below to reset your password:</p>
              <div class="otp-box">${otp}</div>
              <p><strong>Important:</strong></p>
              <ul>
                <li>This OTP is valid for 10 minutes only</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2025 ZameenKhatta. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ZameenKhatta - Password Reset
        
        You have requested to reset your password.
        Your OTP: ${otp}
        
        This OTP is valid for 10 minutes only.
        If you didn't request this, please ignore this email.
        
        © 2025 ZameenKhatta. All rights reserved.
      `,
    };
  }

  private getWelcomeTemplate(name: string): EmailTemplate {
    return {
      subject: 'Welcome to ZameenKhatta!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .cta-button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ZameenKhatta!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for joining ZameenKhatta, Pakistan's premier real estate platform.</p>
              <p>You can now:</p>
              <ul>
                <li>Browse thousands of properties</li>
                <li>List your own properties</li>
                <li>Connect with buyers and sellers</li>
                <li>Get real-time market insights</li>
              </ul>
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="cta-button">Go to Dashboard</a>
            </div>
            <div class="footer">
              <p>© 2025 ZameenKhatta. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to ZameenKhatta!
        
        Hello ${name}!
        
        Thank you for joining ZameenKhatta, Pakistan's premier real estate platform.
        
        Visit your dashboard: ${process.env.NEXTAUTH_URL}/dashboard
        
        © 2025 ZameenKhatta. All rights reserved.
      `,
    };
  }

  private getPropertyApprovalTemplate(propertyTitle: string, approved: boolean): EmailTemplate {
    const status = approved ? 'Approved' : 'Rejected';
    const statusColor = approved ? '#10b981' : '#ef4444';
    
    return {
      subject: `Property ${status} - ${propertyTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusColor}; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .status-badge { background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; }
            .footer { text-align: center; padding: 20px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Property Update</h1>
            </div>
            <div class="content">
              <h2>Property Status Update</h2>
              <p>Your property listing has been <span class="status-badge">${status}</span></p>
              <p><strong>Property:</strong> ${propertyTitle}</p>
              ${approved 
                ? '<p>Congratulations! Your property is now live and visible to potential buyers.</p>'
                : '<p>Please review your property details and resubmit for approval.</p>'
              }
            </div>
            <div class="footer">
              <p>© 2025 ZameenKhatta. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Property ${status} - ${propertyTitle}
        
        Your property listing has been ${status.toLowerCase()}.
        
        © 2025 ZameenKhatta. All rights reserved.
      `,
    };
  }

  private getContactNotificationTemplate(contactData: any): EmailTemplate {
    return {
      subject: `New Contact Form Submission - ${contactData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="info-box">
                <strong>Name:</strong> ${contactData.fullName}
              </div>
              <div class="info-box">
                <strong>Email:</strong> ${contactData.email}
              </div>
              <div class="info-box">
                <strong>Phone:</strong> ${contactData.phone || 'Not provided'}
              </div>
              <div class="info-box">
                <strong>Subject:</strong> ${contactData.subject}
              </div>
              <div class="info-box">
                <strong>Message:</strong><br>${contactData.message}
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ZameenKhatta. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${contactData.fullName}
        Email: ${contactData.email}
        Phone: ${contactData.phone || 'Not provided'}
        Subject: ${contactData.subject}
        
        Message:
        ${contactData.message}
        
        © 2025 ZameenKhatta. All rights reserved.
      `,
    };
  }

  private getPropertyInquiryTemplate(inquiryData: any): EmailTemplate {
    return {
      subject: `Property Inquiry - ${inquiryData.propertyTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Property Inquiry</h1>
            </div>
            <div class="content">
              <h2>Someone is interested in your property!</h2>
              <div class="info-box">
                <strong>Property:</strong> ${inquiryData.propertyTitle}
              </div>
              <div class="info-box">
                <strong>Inquirer:</strong> ${inquiryData.name}
              </div>
              <div class="info-box">
                <strong>Email:</strong> ${inquiryData.email}
              </div>
              <div class="info-box">
                <strong>Phone:</strong> ${inquiryData.phone || 'Not provided'}
              </div>
              <div class="info-box">
                <strong>Message:</strong><br>${inquiryData.message}
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ZameenKhatta. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Property Inquiry - ${inquiryData.propertyTitle}
        
        Someone is interested in your property!
        
        Inquirer: ${inquiryData.name}
        Email: ${inquiryData.email}
        Phone: ${inquiryData.phone || 'Not provided'}
        
        Message:
        ${inquiryData.message}
        
        © 2025 ZameenKhatta. All rights reserved.
      `,
    };
  }
}

export default new EmailService();
