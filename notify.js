const nodemailer = require("nodemailer");
const twilio = require("twilio");

function buildTransport() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    console.warn("SMTP not fully configured; email sending is disabled.");
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

async function sendEmail({ to, subject, text }) {
  const transport = buildTransport();
  if (!transport) {
    console.warn("Email skipped (SMTP not configured).");
    return;
  }
  const from = process.env.SMTP_FROM;
  const recipients = Array.isArray(to) ? to.join(",") : to;
  await transport.sendMail({ from, to: recipients, subject, text });
}

function buildTwilio() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    console.warn("Twilio not fully configured; SMS sending is disabled.");
    return null;
  }
  return { client: twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN), from: TWILIO_FROM };
}

async function sendSMS({ to, body }) {
  const tw = buildTwilio();
  if (!tw) {
    console.warn("SMS skipped (Twilio not configured).");
    return;
  }
  const nums = Array.isArray(to) ? to : [to];
  for (const n of nums) {
    await tw.client.messages.create({ from: tw.from, to: n, body });
  }
}

module.exports = {
  sendEmail,
  sendSMS
};