const { estimateBaseLabor, applyMargins, buildQuoteSummary } = require("../lib/quoteLogic");
const { sendEmail, sendSMS } = require("../lib/notify");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  try {
    const payload = req.body || {};
    const {
      total_sqft,
      floors,
      bathrooms,
      urgency,
      is_new_client
    } = payload;

    const baseMonthly = estimateBaseLabor({
      totalSqft: total_sqft,
      floors,
      bathrooms
    });

    const pricing = applyMargins({
      baseMonthly,
      isNewClient: String(is_new_client || "yes").toLowerCase() !== "no"
    });

    const summary = buildQuoteSummary(payload, pricing);

    // Email recipients for bids
    const bidRecipients = (process.env.BID_RECIPIENTS || "")
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    if (bidRecipients.length) {
      await sendEmail({
        to: bidRecipients,
        subject: "New Smart Quote Request — Buenavista Services Inc",
        text: summary
      });
    }

    // High urgency SMS
    const urgencyNum = Number(urgency || 0) || 0;
    if (urgencyNum >= 8) {
      const smsRecipients = (process.env.URGENT_SMS_RECIPIENTS || "")
        .split(",")
        .map(x => x.trim())
        .filter(Boolean);
      if (smsRecipients.length) {
        await sendSMS({
          to: smsRecipients,
          body: "Buenavista: A high-urgency Smart Quote (8–10) is waiting for review in your email."
        });
      }
    }

    res.statusCode = 200;
    res.json({
      ok: true,
      pricing,
      message: "Quote prepared and sent for management review."
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json({ error: "Quote error" });
  }
};