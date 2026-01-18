export function calculateInternalPricing({
  squareFeet,
  facilityType,
  frequency,
  is24HourFacility,
  isOneTimeService
}) {
  let baseRate = squareFeet * 0.08;

  const facilityMultipliers = {
    Office: 1.25,
    Medical: 1.45,
    Educational: 1.2,
    Industrial: 1.3,
    Retail: 1.4
  };

  baseRate *= facilityMultipliers[facilityType] || 1.25;

  if (frequency === "weekly") baseRate *= 0.9;
  if (frequency === "biweekly") baseRate *= 1.05;
  if (frequency === "monthly") baseRate *= 1.15;

  if (is24HourFacility) baseRate *= 1.1;
  if (isOneTimeService) baseRate *= 1.25;

  const targetMargin = "45–55%";

  return {
    internalTargetPrice: Math.round(baseRate),
    marginRange: targetMargin,
    opportunityFlag: isOneTimeService ? "One-Time / Emergency" : "Recurring"
  };
}