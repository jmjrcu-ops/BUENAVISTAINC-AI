import fetch from "node-fetch";
import { calculateInternalPricing } from "./quoteLogic.js";
import { sendInternalNotification } from "./notify.js";

async function generateExecutiveSummary(details) {
  const prompt = `
You are an INTERNAL OPERATIONS ASSISTANT.

STRICT RULES:
- DO NOT show pricing
- DO NOT include dollar amounts
- DO NOT imply cost

Generate a concise executive summary covering:
- Scope of work
- Facility type
- Risk / complexity
- Opportunity type
- Recommended next steps

Details:
${JSON.stringify(details, null, 2)}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }]
    })
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "Summary unavailable";
}

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
      facilityType,
      squareFeet,
      services,
      frequency,
      is24HourFacility,
      isOneTimeService,
      notes
    } = req.body || {};

    const pricingSnapshot = calculateInternalPricing({
      squareFeet,
      facilityType,
      frequency,
      is24HourFacility,
      isOneTimeService
    });

    const executiveSummary = await generateExecutiveSummary({
      facilityType,
      squareFeet,
      services,
      frequency,
      is24HourFacility,
      isOneTimeService,
      region
    });

    const internalEmailBody = `
NEW SMART QUOTE (INTERNAL)

Client: ${name}
Email: ${email}
Phone: ${phone}
Region: ${region}

Facility Type: ${facilityType}
Square Feet: ${squareFeet}
Frequency: ${frequency}
24-Hour Facility: ${is24HourFacility ? "Yes" : "No"}
Services: ${services?.join(", ")}

Opportunity Type: ${pricingSnapshot.opportunityFlag}

INTERNAL TARGET PRICE: ${pricingSnapshot.internalTargetPrice}
EXPECTED MARGIN: ${pricingSnapshot.marginRange}

EXECUTIVE SUMMARY:
${executiveSummary}

Notes:
${notes || "None"}
`;

    await sendInternalNotification({
      region,
      subject: `New Smart Quote – ${pricingSnapshot.opportunityFlag}`,
      body: internalEmailBody
    });

    return res.status(200).json({
      status: "received",
      message:
        "Thank you. A regional manager will review your request and contact you."
    });
  } catch (error) {
    console.error("Quote error:", error);
    return res.status(500).json({ message: "Unable to process request" });
  }
}