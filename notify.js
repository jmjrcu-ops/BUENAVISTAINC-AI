import nodemailer from "nodemailer";

/**
 * INTERNAL EMAIL ONLY
 * NO CLIENT VISIBILITY
 */
export async function sendInternalNotification({
  region,
  subject,
  body
}) {
  const REGION_EMAIL_MAP = {
    "Western Washington": [
      "billy@buenavistainc.com",
      "jesus@buenavistainc.com"
    ],
    "Eastern Washington": [
      "ivan@buenavistainc.com",
      "billy@buenavistainc.com",
      "jesus@buenavistainc.com"
    ],
    "Oregon": [
      "ivan@buenavistainc.com",
      "jesus@buenavistainc.com"
    ],
    "Florida": [
      "camilo@buenavistainc.com",
      "jesus@buenavistainc.com"
    ]
  };

  const primaryRecipients = REGION_EMAIL_MAP[region] || [
    "billy@buenavistainc.com",
    "jesus@buenavistainc.com"
  ];

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // REQUIRED for Netfirms
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: primaryRecipients.join(", "),
      cc: "support@buenavistainc.com",
      subject,
      text: body
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ EMAIL SENT:", info.messageId);
    console.log("➡️ TO:", primaryRecipients);
    console.log("📎 CC: support@buenavistainc.com");

    return true;

  } catch (error) {
    console.error("❌ EMAIL FAILED:", error);
    throw error;
  }
}
