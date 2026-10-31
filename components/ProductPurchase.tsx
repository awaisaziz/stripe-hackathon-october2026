"use client";

import React, { useState } from "react";
import { Design } from "@/db/schema";
import {
  GarmentType,
  GARMENT_CATALOG,
  calculatePrice,
  formatCents,
  DESIGNER_SHARE_RATE,
} from "@/lib/pricing";
import { MockupCanvas, PlacementState } from "./MockupCanvas";
import { MeasurementsPicker, MeasurementsData } from "./MeasurementsPicker";
import { MEASUREMENT_LIMITS } from "@/lib/measurements";
import { ShoppingBag, Loader2, Sparkles, Shield, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductPurchaseProps {
  design: Design;
}

export function ProductPurchase({ design }: ProductPurchaseProps) {
  const garmentType = (design.garment as GarmentType) || "hoodie";
  const garmentConfig = GARMENT_CATALOG[garmentType] || GARMENT_CATALOG.hoodie;

  const [selectedColor, setSelectedColor] = useState(design.color || garmentConfig.defaultColor);
  const selectedColorHex =
    garmentConfig.availableColors.find((c) => c.name === selectedColor)?.hex || "#111111";

  const [placement, setPlacement] = useState<PlacementState>(
    (design.placement as PlacementState) || {
      x: 50,
      y: 48,
      scale: 0.85,
      rotation: 0,
      side: "front",
    }
  );

  const limits = MEASUREMENT_LIMITS[garmentType] || MEASUREMENT_LIMITS.hoodie;
  const [measurements, setMeasurements] = useState<MeasurementsData>({
    unit: "in",
    chestWidth: limits.defaultChestInches,
    bodyLength: limits.defaultBodyInches,
  });

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const price = calculatePrice({
    garment: garmentType,
    customFit: true,
    markupCents: design.markupCents,
  });

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId: design.id,
          garment: garmentType,
          color: selectedColor,
          measurements,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(`Checkout error: ${err.message}`);
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Back to marketplace */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Mockup Canvas Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <MockupCanvas
              garment={garmentType}
              colorHex={selectedColorHex}
              imageUrl={design.imageUrl}
              placement={placement}
              onChangePlacement={setPlacement}
              interactive={true}
            />
          </div>

          {/* Prompt metadata card */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl text-xs space-y-2">
            <span className="font-mono text-zinc-400 uppercase text-[10px] tracking-wider block">
              Prompt Specification
            </span>
            <p className="text-zinc-300 font-mono text-[11px] leading-relaxed italic">
              &ldquo;{design.prompt}&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: Customization & Checkout (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                {garmentConfig.name}
              </span>
              <span className="text-xs text-zinc-500">&bull;</span>
              <span className="text-xs text-zinc-400">Designer: {design.ownerId}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{design.title}</h1>
            <p className="text-xs text-zinc-400 mt-2">{garmentConfig.description}</p>
          </div>

          {/* Color Selector */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <span className="text-xs font-semibold text-zinc-300 block">Garment Color</span>
            <div className="flex flex-wrap gap-2">
              {garmentConfig.availableColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                    selectedColor === c.name
                      ? "bg-zinc-800 border-primary text-white"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/40"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Measurements Fitting Picker */}
          <MeasurementsPicker
            garment={garmentType}
            value={measurements}
            onChange={setMeasurements}
          />

          {/* Pricing & Designer Split Summary */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">Price Breakdown</span>
              <span className="text-xl font-bold font-mono text-primary">
                {formatCents(price.totalAmountCents)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-800/80 pt-3">
              <div className="flex justify-between">
                <span>Base Garment Production:</span>
                <span className="font-mono text-zinc-200">{formatCents(price.basePriceCents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Precision Custom-Fit Fee:</span>
                <span className="font-mono text-zinc-200">+{formatCents(price.customFitFeeCents)}</span>
              </div>
              {price.markupCents > 0 && (
                <div className="flex justify-between text-primary">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Designer Markup (80% to Creator):</span>
                  </span>
                  <span className="font-mono">+{formatCents(price.markupCents)}</span>
                </div>
              )}
            </div>

            {/* Designer payout note */}
            {price.markupCents > 0 && (
              <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl text-[11px] text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-primary">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Creator earnings from this sale:</span>
                </span>
                <span className="font-mono font-bold text-white">
                  {formatCents(price.designerShareCents)}
                </span>
              </div>
            )}
          </div>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-black py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-primary/20 hover:scale-[1.01]"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirecting to Stripe Test Checkout...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Buy Now with Stripe ({formatCents(price.totalAmountCents)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
