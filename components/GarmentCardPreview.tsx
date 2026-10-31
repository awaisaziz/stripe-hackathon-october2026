"use client";

import React from "react";
import { GarmentType, GARMENT_CATALOG } from "@/lib/pricing";
import { GarmentVector, getPrintAreaConfig } from "./GarmentVector";

interface GarmentCardPreviewProps {
  garment: GarmentType;
  colorHex?: string;
  colorName?: string;
  artworkUrl: string;
  title: string;
  className?: string;
  placement?: {
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
    side?: "front" | "back";
  };
}

export function GarmentCardPreview({
  garment,
  colorHex,
  colorName,
  artworkUrl,
  title,
  className = "w-full h-full",
  placement,
}: GarmentCardPreviewProps) {
  const garmentCfg = GARMENT_CATALOG[garment] || GARMENT_CATALOG.tshirt;
  const resolvedColorHex =
    colorHex ||
    garmentCfg.availableColors.find((c) => c.name === colorName)?.hex ||
    garmentCfg.availableColors[0]?.hex ||
    "#18181b";

  const printArea = getPrintAreaConfig(garment);
  const scale = placement?.scale || 0.85;
  const rotation = placement?.rotation || 0;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: `radial-gradient(130% 120% at 50% 25%, ${resolvedColorHex}33 0%, #0c0c0e 70%, #060608 100%)`,
      }}
    >
      {/* Garment Base Layer */}
      <div className="relative w-[82%] h-[82%] flex items-center justify-center filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.75)]">
        <GarmentVector garment={garment} colorHex={resolvedColorHex} />

        {/* Artwork Print Area Layer */}
        <div
          className="absolute flex items-center justify-center pointer-events-none transition-transform duration-300"
          style={{
            top: printArea.top,
            left: printArea.left,
            width: printArea.width,
            height: printArea.height,
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
          {artworkUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artworkUrl}
              alt={title}
              className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] rounded"
              style={{
                mixBlendMode: resolvedColorHex === "#f5f5f0" || resolvedColorHex === "#f3f0e6" ? "multiply" : "normal",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
