import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      message = "",
      facilityType,
      region,
      is24HourFacility,
      isOneTimeService
    } = req.body || {};

    const escalationRequired =
      message.toLowerCase().includes("price") ||
      message.toLowerCase().includes("quote") ||
      isOneTimeService ||
      facilityType === "Medical";

    const systemPrompt = `
You are the BuenaVista Services AI assistant.

STRICT RULES:
- NEVER provide pricing, estimates, dollar amounts, or ranges
- NEVER imply cost
- If pricing is requested, escalate politely
- Focus on services, process, quality, and next steps
- Medical, emergency, or one-time services ALWAYS escalate

If escalation is required, respond:
"Thanks for the details. A regional manager will review your request and follow up shortly."

Otherwise, answer professionally and concisely.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Thank you. A representative will be in touch.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ message: "Chat unavailable" });
  }
}