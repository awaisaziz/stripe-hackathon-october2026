"use client";

import React from "react";
import { Ruler, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  GarmentType,
  CUSTOM_FIT_FEE_CENTS,
  formatCents,
} from "@/lib/pricing";
import {
  MeasurementUnit,
  MEASUREMENT_LIMITS,
  STANDARD_SIZES,
  inchesToCm,
  cmToInches,
  suggestSizeFromMeasurements,
  validateMeasurements,
} from "@/lib/measurements";

export interface MeasurementsData {
  unit: MeasurementUnit;
  chestWidth: number;
  bodyLength: number;
}

interface MeasurementsPickerProps {
  garment: GarmentType;
  value: MeasurementsData;
  onChange: (data: MeasurementsData) => void;
}

export function MeasurementsPicker({ garment, value, onChange }: MeasurementsPickerProps) {
  const limits = MEASUREMENT_LIMITS[garment] || MEASUREMENT_LIMITS.tshirt;
  const isCm = value.unit === "cm";

  // Min / max in current units
  const minChest = isCm ? inchesToCm(limits.minChestInches) : limits.minChestInches;
  const maxChest = isCm ? inchesToCm(limits.maxChestInches) : limits.maxChestInches;
  const minBody = isCm ? inchesToCm(limits.minBodyInches) : limits.minBodyInches;
  const maxBody = isCm ? inchesToCm(limits.maxBodyInches) : limits.maxBodyInches;

  // Normalized chest in inches for size suggestion
  const chestInches = isCm ? cmToInches(value.chestWidth) : value.chestWidth;
  const suggestedSize = suggestSizeFromMeasurements(chestInches);
  const validation = validateMeasurements(garment, value);

  const toggleUnit = (unit: MeasurementUnit) => {
    if (unit === value.unit) return;
    if (unit === "cm") {
      onChange({
        unit: "cm",
        chestWidth: inchesToCm(value.chestWidth),
        bodyLength: inchesToCm(value.bodyLength),
      });
    } else {
      onChange({
        unit: "in",
        chestWidth: cmToInches(value.chestWidth),
        bodyLength: cmToInches(value.bodyLength),
      });
    }
  };

  const applyPreset = (preset: (typeof STANDARD_SIZES)[number]) => {
    if (isCm) {
      onChange({
        unit: "cm",
        chestWidth: inchesToCm(preset.chestInches),
        bodyLength: inchesToCm(preset.bodyInches),
      });
    } else {
      onChange({
        unit: "in",
        chestWidth: preset.chestInches,
        bodyLength: preset.bodyInches,
      });
    }
  };

  const widthLabel =
    garment === "tote"
      ? "Bag Width"
      : garment === "socks"
      ? "Foot Length / Size"
      : garment === "shoes"
      ? "US Shoe Size"
      : "Chest Width (pit-to-pit)";

  const lengthLabel =
    garment === "tote"
      ? "Bag Height"
      : garment === "socks"
      ? "Crew Leg Height"
      : garment === "shoes"
      ? "Sole Outsole Length"
      : "Body Length (collar-to-hem)";

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-5">
      {/* Header and Unit Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-primary">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Custom Measurements</h3>
            <p className="text-[11px] text-zinc-400">
              Each garment is bespoke cut to your exact anatomical specs
            </p>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => toggleUnit("in")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              !isCm ? "bg-primary text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Inches (&quot;)
          </button>
          <button
            type="button"
            onClick={() => toggleUnit("cm")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              isCm ? "bg-primary text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            cm
          </button>
        </div>
      </div>

      {/* Standard Size Preset Chips (Helper) */}
      {!isTote && (
        <div>
          <div className="text-[11px] text-zinc-400 mb-2 flex items-center justify-between">
            <span>Quick fill from baseline size:</span>
            <span className="text-primary font-mono font-medium">
              Matches: <strong className="text-white">{suggestedSize}</strong> standard fit
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {STANDARD_SIZES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                  suggestedSize === preset.label
                    ? "bg-zinc-800 border-primary text-primary"
                    : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Measurement Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Chest Width */}
        <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-200">{widthLabel}</span>
            <span className="text-zinc-400 font-mono text-[11px]">
              {minChest} - {maxChest} {value.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step={isCm ? "0.5" : "0.25"}
              min={minChest}
              max={maxChest}
              value={value.chestWidth}
              onChange={(e) =>
                onChange({ ...value, chestWidth: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-base focus:border-primary focus:outline-none"
            />
            <span className="text-xs font-mono text-zinc-400 w-8">{value.unit}</span>
          </div>
        </div>

        {/* Body Length */}
        <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-200">{lengthLabel}</span>
            <span className="text-zinc-400 font-mono text-[11px]">
              {minBody} - {maxBody} {value.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step={isCm ? "0.5" : "0.25"}
              min={minBody}
              max={maxBody}
              value={value.bodyLength}
              onChange={(e) =>
                onChange({ ...value, bodyLength: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-base focus:border-primary focus:outline-none"
            />
            <span className="text-xs font-mono text-zinc-400 w-8">{value.unit}</span>
          </div>
        </div>
      </div>

      {/* Validation status badge */}
      {validation.valid ? (
        <div className="flex items-center justify-between text-xs text-zinc-400 bg-primary/10 border border-primary/20 p-2.5 rounded-lg">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Measurements verified for precision laser garment cutting</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-300">
            +{formatCents(CUSTOM_FIT_FEE_CENTS)} custom fit fee
          </span>
        </div>
      ) : (
        <div className="space-y-1 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-xs text-red-300">
          {validation.errors.map((err, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
