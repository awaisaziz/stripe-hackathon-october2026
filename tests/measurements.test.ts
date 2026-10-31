import { describe, it, expect } from "vitest";
import {
  inchesToCm,
  cmToInches,
  suggestSizeFromMeasurements,
  validateMeasurements,
} from "@/lib/measurements";

describe("Measurement Engine (lib/measurements.ts)", () => {
  it("converts units accurately between inches and cm", () => {
    expect(inchesToCm(10)).toBe(25.4);
    expect(inchesToCm(20)).toBe(50.8);
    expect(cmToInches(25.4)).toBe(10);
    expect(cmToInches(50.8)).toBe(20);
  });

  it("suggests standard apparel size based on chest measurements", () => {
    expect(suggestSizeFromMeasurements(18)).toBe("XS");
    expect(suggestSizeFromMeasurements(20)).toBe("S");
    expect(suggestSizeFromMeasurements(22)).toBe("M");
    expect(suggestSizeFromMeasurements(24)).toBe("L");
    expect(suggestSizeFromMeasurements(26)).toBe("XL");
    expect(suggestSizeFromMeasurements(28)).toBe("2XL");
  });

  it("validates in-range measurements for t-shirt in inches", () => {
    const result = validateMeasurements("tshirt", {
      unit: "in",
      chestWidth: 21,
      bodyLength: 29,
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.normalizedInches.chestWidth).toBe(21);
    expect(result.normalizedInches.bodyLength).toBe(29);
  });

  it("validates in-range measurements for hoodie in cm", () => {
    // 22 inches is ~55.9 cm, 30 inches is ~76.2 cm
    const result = validateMeasurements("hoodie", {
      unit: "cm",
      chestWidth: 55.9,
      bodyLength: 76.2,
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects out-of-bounds measurements with helpful error messages", () => {
    // T-shirt chest min is 16", max is 32"
    const tooSmall = validateMeasurements("tshirt", {
      unit: "in",
      chestWidth: 10,
      bodyLength: 29,
    });
    expect(tooSmall.valid).toBe(false);
    expect(tooSmall.errors[0]).toContain("Chest width must be between 16 and 32 in");

    // Length too long
    const tooLong = validateMeasurements("tshirt", {
      unit: "in",
      chestWidth: 22,
      bodyLength: 45,
    });
    expect(tooLong.valid).toBe(false);
    expect(tooLong.errors[0]).toContain("Body length must be between 24 and 36 in");
  });

  it("handles tote bag width/length validation limits", () => {
    const tote = validateMeasurements("tote", {
      unit: "in",
      chestWidth: 15,
      bodyLength: 16,
    });
    expect(tote.valid).toBe(true);

    const invalidTote = validateMeasurements("tote", {
      unit: "in",
      chestWidth: 5,
      bodyLength: 16,
    });
    expect(invalidTote.valid).toBe(false);
    expect(invalidTote.errors[0]).toContain("Bag width");
  });

  it("handles socks and shoes measurements validation limits", () => {
    const socks = validateMeasurements("socks", {
      unit: "in",
      chestWidth: 10,
      bodyLength: 8,
    });
    expect(socks.valid).toBe(true);

    const shoes = validateMeasurements("shoes", {
      unit: "in",
      chestWidth: 10,
      bodyLength: 11,
    });
    expect(shoes.valid).toBe(true);

    const invalidShoes = validateMeasurements("shoes", {
      unit: "in",
      chestWidth: 20, // max is 15
      bodyLength: 11,
    });
    expect(invalidShoes.valid).toBe(false);
    expect(invalidShoes.errors[0]).toContain("Shoe size");
  });
});
