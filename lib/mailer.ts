import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export async function sendVerificationCode(email: string, code: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your email",
    html: `
      <p>Your verification code:</p>
      <h2>${code}</h2>
      <p>This code expires in 10 minutes.</p>
    `,
  });
}
