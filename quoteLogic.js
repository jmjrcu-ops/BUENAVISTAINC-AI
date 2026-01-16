// INTERNAL PRICING LOGIC
// This file is NEVER exposed to clients or AI responses

const FACILITY_MULTIPLIERS = {
  office: 1.25,
  medical: 1.45,
  educational: 1.20,
  industrial: 1.30,
  retail: 1.40
};

export function calculateInternalPricing(input) {
  const {
    squareFeet,
    facilityType,
    services = [],
    frequency,
    is24HourFacility = false,
    isOneTimeService = false,
    region
  } = input;

  // Base labor cost assumption (internal only)
  const baseLaborRate = 0.15; // per sq ft baseline
  let baseCost = squareFeet * baseLaborRate;

  // Facility multiplier
  const facilityMultiplier =
    FACILITY_MULTIPLIERS[facilityType] || 1.25;

  baseCost *= facilityMultiplier;

  // Service complexity multiplier
  let serviceMultiplier = 1.0;

  services.forEach(service => {
    if (
      service.includes("strip") ||
      service.includes("wax") ||
      service.includes("buff")
    ) {
      serviceMultiplier += 0.25;
    }

    if (service.includes("carpet")) {
      serviceMultiplier += 0.15;
    }

    if (service.includes("medical")) {
      serviceMultiplier += 0.2;
    }
  });

  baseCost *= serviceMultiplier;

  // 24-hour / night facility premium
  if (is24HourFacility) {
    baseCost *= 1.10; // +10%
  }

  // One-time / emergency premium
  let opportunityFlag = "Recurring Opportunity";
  if (isOneTimeService) {
    baseCost *= 1.25;
    opportunityFlag = "One-Time / Emergency Opportunity";
  }

  // Frequency adjustment (internal)
  if (frequency === "weekly") baseCost *= 0.95;
  if (frequency === "biweekly") baseCost *= 1.0;
  if (frequency === "monthly") baseCost *= 1.05;

  // Profit model
  const targetMargin = 0.50;
  let grossPrice = baseCost / (1 - targetMargin);

  // Discounts (internal only)
  const firstTimeDiscount = 0.10;
  const communityDiscount = 0.05;

  const finalInternalPrice =
    grossPrice * (1 - firstTimeDiscount - communityDiscount);

  return {
    internalCost: Math.round(baseCost),
    internalTargetPrice: Math.round(finalInternalPrice),
    opportunityFlag,
    facilityType,
    region,
    services,
    squareFeet,
    frequency,
    is24HourFacility,
    marginRange: "30–35% after discounts",
    pricingVisibleToClient: false
  };
}
