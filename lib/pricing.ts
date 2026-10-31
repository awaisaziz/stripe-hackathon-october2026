export type GarmentType =
  | "tshirt"
  | "hoodie"
  | "longsleeve"
  | "tank"
  | "crewneck"
  | "tote"
  | "socks"
  | "shoes";

export interface GarmentConfig {
  id: GarmentType;
  name: string;
  description: string;
  basePriceCents: number; // in cents USD
  availableColors: { name: string; hex: string }[];
  defaultColor: string;
}

export const GARMENT_CATALOG: Record<GarmentType, GarmentConfig> = {
  tshirt: {
    id: "tshirt",
    name: "Classic Heavyweight Tee",
    description: "100% combed ring-spun cotton, durable streetwear cut.",
    basePriceCents: 2400, // $24.00
    availableColors: [
      { name: "Vintage Black", hex: "#121212" },
      { name: "Bone White", hex: "#f3f0e6" },
      { name: "Washed Slate", hex: "#3f4651" },
      { name: "Forest Moss", hex: "#2d3a29" },
    ],
    defaultColor: "Vintage Black",
  },
  hoodie: {
    id: "hoodie",
    name: "Oversized Heavy Fleece Hoodie",
    description: "480 GSM French terry cotton, boxy drop-shoulder fit.",
    basePriceCents: 4800, // $48.00
    availableColors: [
      { name: "Onyx Black", hex: "#0f0f10" },
      { name: "Heather Ash", hex: "#c9cbcf" },
      { name: "Midnight Navy", hex: "#182030" },
      { name: "Raw Umber", hex: "#3e3228" },
    ],
    defaultColor: "Onyx Black",
  },
  longsleeve: {
    id: "longsleeve",
    name: "Relaxed Long Sleeve",
    description: "Heavy jersey knit with ribbed cuffs and tailored hem.",
    basePriceCents: 3200, // $32.00
    availableColors: [
      { name: "Pitch Black", hex: "#111111" },
      { name: "Chalk", hex: "#ecebe4" },
      { name: "Concrete Grey", hex: "#52525b" },
    ],
    defaultColor: "Pitch Black",
  },
  tank: {
    id: "tank",
    name: "Raw Cut Ribbed Tank",
    description: "Wide ribbed cotton with raw bottom edge.",
    basePriceCents: 2200, // $22.00
    availableColors: [
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Optical White", hex: "#fbfbfb" },
      { name: "Military Olive", hex: "#3b3f33" },
    ],
    defaultColor: "Jet Black",
  },
  crewneck: {
    id: "crewneck",
    name: "Vintage Wash Crewneck",
    description: "Brushed fleece interior, reinforced cross-grain collar.",
    basePriceCents: 4200, // $42.00
    availableColors: [
      { name: "Washed Black", hex: "#1c1c1f" },
      { name: "Cement Grey", hex: "#71717a" },
      { name: "Sage Mist", hex: "#4b5548" },
    ],
    defaultColor: "Washed Black",
  },
  tote: {
    id: "tote",
    name: "Heavyweight Canvas Tote",
    description: "16oz reinforced duck canvas with interior pocket.",
    basePriceCents: 1800, // $18.00
    availableColors: [
      { name: "Natural Ecru", hex: "#eee8d5" },
      { name: "Coal Black", hex: "#141414" },
      { name: "Workwear Tan", hex: "#a88454" },
    ],
    defaultColor: "Natural Ecru",
  },
  socks: {
    id: "socks",
    name: "Ribbed Streetwear Crew Socks",
    description: "Combed cotton blend with arch compression and cushioned sole.",
    basePriceCents: 1400, // $14.00
    availableColors: [
      { name: "Vintage White", hex: "#f5f5f0" },
      { name: "Onyx Black", hex: "#121214" },
      { name: "Heather Grey", hex: "#8e9196" },
    ],
    defaultColor: "Vintage White",
  },
  shoes: {
    id: "shoes",
    name: "Canvas Street Low-Tops",
    description: "16oz duck canvas upper with vulcanized rubber foxing and cushioned streetwear insole.",
    basePriceCents: 6800, // $68.00
    availableColors: [
      { name: "Chalk & Off-White", hex: "#eeeae2" },
      { name: "Pitch Black", hex: "#141416" },
      { name: "Raw Sail", hex: "#d8cfbc" },
    ],
    defaultColor: "Chalk & Off-White",
  },
};

// Pricing constants
export const CUSTOM_FIT_FEE_CENTS = 500; // $5.00 for custom-tailored measurement spec
export const DESIGNER_SHARE_RATE = 0.8; // 80% to designer
export const PLATFORM_SHARE_RATE = 0.2; // 20% to platform

export interface PriceBreakdown {
  garment: GarmentType;
  basePriceCents: number;
  customFitFeeCents: number;
  markupCents: number;
  designerShareCents: number;
  platformShareCents: number;
  totalAmountCents: number;
}

/**
 * Compute the validated price breakdown server-side.
 * Never trust amount sent by the client.
 */
export function calculatePrice(options: {
  garment: GarmentType;
  customFit?: boolean;
  markupCents?: number;
}): PriceBreakdown {
  const garmentConfig = GARMENT_CATALOG[options.garment] || GARMENT_CATALOG.tshirt;
  const basePriceCents = garmentConfig.basePriceCents;
  const customFitFeeCents = options.customFit !== false ? CUSTOM_FIT_FEE_CENTS : 0;
  
  // Markup cannot be negative
  const markupCents = Math.max(0, Math.round(options.markupCents || 0));
  
  const designerShareCents = Math.round(markupCents * DESIGNER_SHARE_RATE);
  const platformShareCents = markupCents - designerShareCents;
  const totalAmountCents = basePriceCents + customFitFeeCents + markupCents;

  return {
    garment: options.garment,
    basePriceCents,
    customFitFeeCents,
    markupCents,
    designerShareCents,
    platformShareCents,
    totalAmountCents,
  };
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
