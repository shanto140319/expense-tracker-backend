import * as nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `https://expense-tracker-shanto.vercel.app/reset-password?token=${resetToken}`;
  const mailOptions = {
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Use this link: ${resetUrl}. It expires in 15 minutes.`,
  };

  return await transporter.sendMail(mailOptions);
}
