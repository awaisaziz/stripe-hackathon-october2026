import { GarmentType } from "./pricing";

export type MeasurementUnit = "in" | "cm";

export interface GarmentMeasurementLimits {
  minChestInches: number;
  maxChestInches: number;
  minBodyInches: number;
  maxBodyInches: number;
  defaultChestInches: number;
  defaultBodyInches: number;
}

export const MEASUREMENT_LIMITS: Record<GarmentType, GarmentMeasurementLimits> = {
  tshirt: {
    minChestInches: 16,
    maxChestInches: 32,
    minBodyInches: 24,
    maxBodyInches: 36,
    defaultChestInches: 21,
    defaultBodyInches: 29,
  },
  hoodie: {
    minChestInches: 18,
    maxChestInches: 34,
    minBodyInches: 25,
    maxBodyInches: 36,
    defaultChestInches: 23,
    defaultBodyInches: 30,
  },
  longsleeve: {
    minChestInches: 17,
    maxChestInches: 32,
    minBodyInches: 25,
    maxBodyInches: 35,
    defaultChestInches: 21,
    defaultBodyInches: 29,
  },
  tank: {
    minChestInches: 15,
    maxChestInches: 30,
    minBodyInches: 24,
    maxBodyInches: 34,
    defaultChestInches: 19,
    defaultBodyInches: 28,
  },
  crewneck: {
    minChestInches: 18,
    maxChestInches: 34,
    minBodyInches: 25,
    maxBodyInches: 36,
    defaultChestInches: 22,
    defaultBodyInches: 29,
  },
  tote: {
    minChestInches: 12, // used as bag width
    maxChestInches: 24,
    minBodyInches: 12, // used as bag height
    maxBodyInches: 24,
    defaultChestInches: 15,
    defaultBodyInches: 16,
  },
  socks: {
    minChestInches: 6, // foot length min
    maxChestInches: 13, // foot length max
    minBodyInches: 5, // crew height min
    maxBodyInches: 12, // crew height max
    defaultChestInches: 10,
    defaultBodyInches: 8,
  },
  shoes: {
    minChestInches: 5, // US shoe size min
    maxChestInches: 15, // US shoe size max
    minBodyInches: 8, // outsole length min in inches
    maxBodyInches: 14, // outsole length max in inches
    defaultChestInches: 10,
    defaultBodyInches: 11,
  },
};

export const STANDARD_SIZES: {
  label: "XS" | "S" | "M" | "L" | "XL" | "2XL";
  chestInches: number;
  bodyInches: number;
}[] = [
  { label: "XS", chestInches: 18, bodyInches: 26 },
  { label: "S", chestInches: 20, bodyInches: 28 },
  { label: "M", chestInches: 22, bodyInches: 29 },
  { label: "L", chestInches: 24, bodyInches: 30 },
  { label: "XL", chestInches: 26, bodyInches: 31 },
  { label: "2XL", chestInches: 28, bodyInches: 32 },
];

export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

export function cmToInches(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

export function suggestSizeFromMeasurements(
  chestInches: number,
  bodyInches?: number
): "XS" | "S" | "M" | "L" | "XL" | "2XL" {
  if (chestInches < 19) return "XS";
  if (chestInches < 21) return "S";
  if (chestInches < 23) return "M";
  if (chestInches < 25) return "L";
  if (chestInches < 27) return "XL";
  return "2XL";
}

export interface MeasurementsInput {
  unit: MeasurementUnit;
  chestWidth: number;
  bodyLength: number;
}

export interface MeasurementValidationResult {
  valid: boolean;
  errors: string[];
  normalizedInches: {
    chestWidth: number;
    bodyLength: number;
  };
}

export function validateMeasurements(
  garment: GarmentType,
  input: MeasurementsInput
): MeasurementValidationResult {
  const limits = MEASUREMENT_LIMITS[garment] || MEASUREMENT_LIMITS.tshirt;
  const isCm = input.unit === "cm";
  
  const chestInches = isCm ? cmToInches(input.chestWidth) : input.chestWidth;
  const bodyInches = isCm ? cmToInches(input.bodyLength) : input.bodyLength;

  const errors: string[] = [];

  const minChest = isCm ? inchesToCm(limits.minChestInches) : limits.minChestInches;
  const maxChest = isCm ? inchesToCm(limits.maxChestInches) : limits.maxChestInches;
  const minBody = isCm ? inchesToCm(limits.minBodyInches) : limits.minBodyInches;
  const maxBody = isCm ? inchesToCm(limits.maxBodyInches) : limits.maxBodyInches;

  const widthLabel =
    garment === "tote"
      ? "Bag width"
      : garment === "socks"
      ? "Foot length"
      : garment === "shoes"
      ? "Shoe size"
      : "Chest width";
  const lengthLabel =
    garment === "tote"
      ? "Bag height"
      : garment === "socks"
      ? "Crew height"
      : garment === "shoes"
      ? "Sole length"
      : "Body length";

  if (isNaN(input.chestWidth) || chestInches < limits.minChestInches || chestInches > limits.maxChestInches) {
    errors.push(`${widthLabel} must be between ${minChest} and ${maxChest} ${input.unit}.`);
  }

  if (isNaN(input.bodyLength) || bodyInches < limits.minBodyInches || bodyInches > limits.maxBodyInches) {
    errors.push(`${lengthLabel} must be between ${minBody} and ${maxBody} ${input.unit}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    normalizedInches: {
      chestWidth: Math.round(chestInches * 10) / 10,
      bodyLength: Math.round(bodyInches * 10) / 10,
    },
  };
}
