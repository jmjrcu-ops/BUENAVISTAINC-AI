const OpenAI = require("openai");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.statusCode = 500;
      return res.json({ error: "OPENAI_API_KEY not configured" });
    }
    const client = new OpenAI({ apiKey });

    const { message, regions } = req.body || {};
    const regionText = Array.isArray(regions) && regions.length
      ? `The visitor has selected these regions of interest: ${regions.join(", ")}.`
      : "No region chips are selected yet.";

    const systemPrompt = `
You are the Buenavista Services Inc commercial janitorial assistant.

Rules:
- STRICTLY commercial work only (offices, medical, schools, warehouses, retail, etc.).
- Be kind, supportive, and professional.
- Offer English by default, but you can respond in Spanish or other languages if the user writes in them.
- NEVER give a final price. Instead, explain that quotes are reviewed by management before being sent.
- You can help gather details the Smart Quote form needs: square footage, floors, bathrooms, windows, frequency, special projects, supplies, urgency, etc.
- If the user mentions emergencies or urgent onsite issues, instruct them to contact their regional management team by phone or email as shown on the website.
- Emphasize the philosophy: "Incomparable Care Every Time" and safe, effective cleaning solutions.

Pricing overview:
- Labor is modeled at +$3 above minimum wage for each city/county.
- Target around 45% profit margin per contract.
- 5% below-average market value positioning.
- 10% discount for each new contract/client.
- But again, YOU do not compute final prices — management does.

Use a warm but concise tone. Break complex information into short paragraphs or bullet points.
`.trim();

    const userPrompt = `
Visitor message:
${message || ""}

Context:
${regionText}
`.trim();

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    const reply =
      completion.output &&
      completion.output[0] &&
      completion.output[0].content &&
      completion.output[0].content[0] &&
      completion.output[0].content[0].text
        ? completion.output[0].content[0].text
        : "Thank you for your message. How can I help you with commercial cleaning today?";

    res.statusCode = 200;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json({ error: "Chat error" });
  }
};