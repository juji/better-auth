import { transporter } from "./connect";

export async function sendEmail({to, subject, text}: {to: string, subject: string, text: string}) {

  console.log(`Sending email to ${to} with subject "${subject}" and text: ${text}`);
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
  });
  console.log("Email sent");
}