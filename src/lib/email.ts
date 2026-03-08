import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendNotificationEmail(options: EmailOptions) {
  const to = process.env.NOTIFICATION_EMAIL || 'jt@akers-development.com';

  await transporter.sendMail({
    from: `"Akers Development Website" <${process.env.SMTP_USER || 'noreply@akers-development.com'}>`,
    to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });
}
