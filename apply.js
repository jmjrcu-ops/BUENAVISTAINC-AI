import { sendInternalNotification } from "./notify.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      name,
      email,
      phone,
      region,
      position,
      resume,
      notes
    } = req.body || {};

    const body = `
NEW CAREER APPLICATION (INTERNAL)

Name: ${name || "N/A"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}
Region: ${region || "N/A"}
Position: ${position || "N/A"}

Resume:
${resume || "Not provided"}

Notes:
${notes || "None"}
`;

    await sendInternalNotification({
      region,
      subject: "New Career Application",
      body
    });

    return res.status(200).json({
      status: "received",
      message: "Application submitted successfully."
    });
  } catch (error) {
    console.error("Apply error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}