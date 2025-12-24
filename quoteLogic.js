// Basic quote logic for Buenavista Services Inc
// NOTE: This is a simplified model; your team can tune the math.

const BASE_MARKET_RATE_PER_SQFT = 0.12; // rough starting point, USD per sqft per month

function estimateBaseLabor({ totalSqft, floors, bathrooms }) {
  const sqft = Number(totalSqft || 0) || 0;
  const fl = Number(floors || 1) || 1;
  const baths = Number(bathrooms || 1) || 1;

  // Slight bump for multi-floor and extra bathrooms
  const multiFloorFactor = fl > 1 ? 1 + (fl - 1) * 0.03 : 1;
  const bathroomFactor = 1 + (baths - 2) * 0.02;

  return sqft * BASE_MARKET_RATE_PER_SQFT * multiFloorFactor * bathroomFactor;
}

function applyMargins({ baseMonthly, isNewClient }) {
  // Target 45% profit margin overall
  const targetMarginFactor = 1.45;

  // 5% below market positioning
  const belowMarketFactor = 0.95;

  // 10% discount for new contracts
  const newClientFactor = isNewClient ? 0.9 : 1.0;

  const suggested = baseMonthly * targetMarginFactor;
  const belowMarket = suggested * belowMarketFactor;
  const finalWithDiscount = belowMarket * newClientFactor;

  return {
    suggestedMonthly: round2(suggested),
    belowMarketMonthly: round2(belowMarket),
    finalMonthly: round2(finalWithDiscount)
  };
}

function round2(x) {
  return Math.round((Number(x || 0) + Number.EPSILON) * 100) / 100;
}

function buildQuoteSummary(payload, pricing) {
  const {
    region,
    city,
    county,
    state,
    facility_type,
    total_sqft,
    floors,
    janitorial_frequency,
    daily_services,
    window_need,
    window_count,
    bathrooms,
    special_areas,
    special_projects,
    special_project_frequency,
    supplies_responsibility,
    contact_name,
    contact_email,
    contact_phone,
    urgency,
    notes
  } = payload;

  return `
New Smart Quote Request — Buenavista Services Inc

Facility
- Region: ${region}
- Location: ${city || ""}, ${county || ""}, ${state || ""}
- Facility type: ${facility_type || ""}
- Total square footage: ${total_sqft || ""}
- Floors: ${floors || ""}
- Bathrooms: ${bathrooms || ""}

Scope
- Ongoing janitorial frequency: ${janitorial_frequency || ""}
- Daily required services:
${(daily_services || "").trim()}

Windows
- Window cleaning needed: ${window_need || "no"}
- Approx. number of windows: ${window_count || ""}

Special areas
${(special_areas || "").trim()}

Special projects (manual pricing)
- Selected: ${(special_projects || []).join(", ") || "None"}
- Frequency notes: ${(special_project_frequency || "").trim()}

Supplies
- Cleaning fluids / supplies: ${supplies_responsibility || ""}

Contact
- Name: ${contact_name || ""}
- Email: ${contact_email || ""}
- Phone: ${contact_phone || ""}

Urgency
- Urgency rating (1–10): ${urgency || ""}

Internal Pricing Snapshot (approximate)
- Suggested monthly (pre-positioning): $${pricing.suggestedMonthly}
- 5% below-market positioning: $${pricing.belowMarketMonthly}
- Final monthly after 10% new-contract discount (if applicable): $${pricing.finalMonthly}

Notes
${(notes || "").trim()}

Reminder:
• This estimate is AI-assisted and MUST be reviewed by management before sending to the client.
• Labor is modeled at +$3 above applicable minimum wage with a target 45% profit margin, 5% below-market positioning, and 10% new-client discount when marked new.
`.trim();
}

module.exports = {
  estimateBaseLabor,
  applyMargins,
  buildQuoteSummary
};