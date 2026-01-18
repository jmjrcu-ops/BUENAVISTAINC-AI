import nodemailer from "nodemailer";

const REGION_EMAIL_MAP = {
  "Western Washington": ["jesus@buenavistainc.com", "billy@buenavistainc.com"],
  "Eastern Washington": ["ivan@buenavistainc.com"],
  Oregon: ["ivan@buenavistainc.com"],
  Florida: ["camilo@buenavistainc.com"]
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendInternalNotification({ region, subject, body }) {
  const recipients =
    REGION_EMAIL_MAP[region] || ["support@buenavistainc.com"];

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: recipients.join(","),
    subject,
    text: body
  });
}