import { describe, it, expect } from "vitest";
import {
  calculatePrice,
  GARMENT_CATALOG,
  CUSTOM_FIT_FEE_CENTS,
  DESIGNER_SHARE_RATE,
  PLATFORM_SHARE_RATE,
} from "@/lib/pricing";

describe("Pricing Engine (lib/pricing.ts)", () => {
  it("calculates base price correctly for hoodie with default bespoke fit and zero markup", () => {
    const breakdown = calculatePrice({ garment: "hoodie", customFit: true, markupCents: 0 });
    expect(breakdown.garment).toBe("hoodie");
    expect(breakdown.basePriceCents).toBe(4800); // $48
    expect(breakdown.customFitFeeCents).toBe(500); // $5
    expect(breakdown.markupCents).toBe(0);
    expect(breakdown.designerShareCents).toBe(0);
    expect(breakdown.platformShareCents).toBe(0);
    expect(breakdown.totalAmountCents).toBe(5300); // $53
  });

  it("calculates base price correctly for classic tee with custom fit", () => {
    const breakdown = calculatePrice({ garment: "tshirt", customFit: true, markupCents: 0 });
    expect(breakdown.basePriceCents).toBe(2400); // $24
    expect(breakdown.customFitFeeCents).toBe(500); // $5
    expect(breakdown.totalAmountCents).toBe(2900); // $29
  });

  it("calculates designer share at 80% and platform at 20% of markup", () => {
    const markup = 1500; // $15 markup
    const breakdown = calculatePrice({ garment: "tshirt", customFit: true, markupCents: markup });

    expect(breakdown.markupCents).toBe(1500);
    // 80% of 1500 = 1200
    expect(breakdown.designerShareCents).toBe(1200);
    // 20% of 1500 = 300
    expect(breakdown.platformShareCents).toBe(300);
    expect(breakdown.designerShareCents + breakdown.platformShareCents).toBe(1500);
    expect(breakdown.totalAmountCents).toBe(2400 + 500 + 1500); // 4400 ($44)
  });

  it("handles odd markup cents rounding cleanly", () => {
    const markup = 999; // $9.99 markup
    const breakdown = calculatePrice({ garment: "hoodie", markupCents: markup });

    // Math.round(999 * 0.8) = Math.round(799.2) = 799
    expect(breakdown.designerShareCents).toBe(799);
    // 999 - 799 = 200
    expect(breakdown.platformShareCents).toBe(200);
    expect(breakdown.designerShareCents + breakdown.platformShareCents).toBe(999);
  });

  it("clamps negative markup amounts to zero", () => {
    const breakdown = calculatePrice({ garment: "tank", markupCents: -500 });
    expect(breakdown.markupCents).toBe(0);
    expect(breakdown.designerShareCents).toBe(0);
    expect(breakdown.platformShareCents).toBe(0);
  });

  it("omits custom fit fee when customFit is false", () => {
    const breakdown = calculatePrice({ garment: "tote", customFit: false, markupCents: 500 });
    expect(breakdown.customFitFeeCents).toBe(0);
    expect(breakdown.totalAmountCents).toBe(1800 + 0 + 500);
  });

  it("calculates prices for socks and shoes accurately", () => {
    const socks = calculatePrice({ garment: "socks", customFit: true, markupCents: 600 });
    expect(socks.basePriceCents).toBe(1400); // $14
    expect(socks.customFitFeeCents).toBe(500); // $5
    expect(socks.designerShareCents).toBe(480); // 80% of 600
    expect(socks.platformShareCents).toBe(120); // 20% of 600
    expect(socks.totalAmountCents).toBe(1400 + 500 + 600); // 2500 ($25)

    const shoes = calculatePrice({ garment: "shoes", customFit: true, markupCents: 1600 });
    expect(shoes.basePriceCents).toBe(6800); // $68
    expect(shoes.designerShareCents).toBe(1280); // 80% of 1600
    expect(shoes.totalAmountCents).toBe(6800 + 500 + 1600); // 8900 ($89)
  });
});
