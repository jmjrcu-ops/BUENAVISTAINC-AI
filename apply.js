const { sendEmail } = require("../lib/notify");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  try {
    const payload = req.body || {};
    const {
      name,
      email,
      phone,
      region,
      position,
      notes,
      resume,
      cover
    } = payload;

    const lines = [];
    lines.push("New Career Application — Buenavista Services Inc");
    lines.push("");
    lines.push("Applicant");
    lines.push(`- Name: ${name || ""}`);
    lines.push(`- Email: ${email || ""}`);
    lines.push(`- Phone: ${phone || ""}`);
    lines.push("");
    lines.push(`Region: ${region || ""}`);
    lines.push(`Position: ${position || ""}`);
    lines.push("");
    lines.push("Notes:");
    lines.push((notes || "").trim());
    lines.push("");

    const text = lines.join("\n");

    const hrRecipients = (process.env.CAREERS_RECIPIENTS || "")
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    if (hrRecipients.length) {
      await sendEmail({
        to: hrRecipients,
        subject: "New Career Application — Buenavista Services Inc",
        text
      });
    }

    // NOTE: This simple example does not attach the resume/cover files.
    // A production version could upload them to S3 or attach directly if SMTP allows.

    res.statusCode = 200;
    res.json({ ok: true, message: "Application forwarded to management." });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json({ error: "Apply error" });
  }
};