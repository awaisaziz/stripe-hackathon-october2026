"use client";

import React from "react";
import { GarmentType } from "@/lib/pricing";

interface GarmentVectorProps {
  garment: GarmentType;
  colorHex: string;
  className?: string;
}

export interface PrintAreaConfig {
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius?: string;
}

export function getPrintAreaConfig(garment: GarmentType): PrintAreaConfig {
  switch (garment) {
    case "hoodie":
      return { top: "32%", left: "30%", width: "40%", height: "34%", borderRadius: "8px" };
    case "tshirt":
      return { top: "27%", left: "28%", width: "44%", height: "42%", borderRadius: "8px" };
    case "crewneck":
      return { top: "29%", left: "29%", width: "42%", height: "40%", borderRadius: "8px" };
    case "longsleeve":
      return { top: "28%", left: "28%", width: "44%", height: "42%", borderRadius: "8px" };
    case "tank":
      return { top: "29%", left: "30%", width: "40%", height: "42%", borderRadius: "8px" };
    case "tote":
      return { top: "42%", left: "28%", width: "44%", height: "42%", borderRadius: "6px" };
    case "socks":
      return { top: "22%", left: "28%", width: "44%", height: "30%", borderRadius: "6px" };
    case "shoes":
      return { top: "44%", left: "28%", width: "42%", height: "26%", borderRadius: "6px" };
    default:
      return { top: "28%", left: "28%", width: "44%", height: "42%", borderRadius: "8px" };
  }
}

export function GarmentVector({ garment, colorHex, className = "w-full h-full" }: GarmentVectorProps) {
  // Compute slightly lighter highlight and darker shade for realistic 3D fabric depth
  const uid = React.useId().replace(/:/g, "_");

  return (
    <svg
      viewBox="0 0 240 280"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        {/* Soft fabric surface ambient gradient */}
        <radialGradient id={`fabric-grad-${uid}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
        </radialGradient>

        {/* Subtle drop shadow under cuffs and hemlines */}
        <linearGradient id={`shadow-down-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>

        <linearGradient id={`hood-inner-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* RENDER GARMENT BY TYPE */}
      {garment === "hoodie" && (
        <g id="hoodie-group">
          {/* Back of Hood */}
          <path
            d="M 85 52 C 70 25 80 8 120 8 C 160 8 170 25 155 52 Z"
            fill={colorHex}
            stroke="#27272a"
            strokeWidth="1.2"
          />
          {/* Inner Hood Dark Shadow */}
          <path
            d="M 92 50 C 82 28 92 14 120 14 C 148 14 158 28 148 50 C 138 34 102 34 92 50 Z"
            fill={`url(#hood-inner-${uid})`}
          />

          {/* Main Body & Oversized Drop-Shoulder Sleeves */}
          <path
            d="M 88 52 
               L 42 72 
               L 14 146 
               L 40 156 
               L 52 128 
               L 52 244 
               L 188 244 
               L 188 128 
               L 200 156 
               L 226 146 
               L 198 72 
               L 152 52 
               C 142 64 98 64 88 52 Z"
            fill={colorHex}
            stroke="#27272a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Fabric Shading Overlay */}
          <path
            d="M 88 52 L 42 72 L 14 146 L 40 156 L 52 128 L 52 244 L 188 244 L 188 128 L 200 156 L 226 146 L 198 72 L 152 52 C 142 64 98 64 88 52 Z"
            fill={`url(#fabric-grad-${uid})`}
          />

          {/* Kangaroo Pouch Pocket */}
          <path
            d="M 72 178 
               C 76 178 164 178 168 178 
               L 154 234 
               L 86 234 
               Z"
            fill={colorHex}
            stroke="#3f3f46"
            strokeWidth="1.1"
          />
          <path
            d="M 72 178 C 76 178 164 178 168 178 L 154 234 L 86 234 Z"
            fill="rgba(0,0,0,0.18)"
          />
          {/* Kangaroo pocket side welt openings */}
          <path d="M 72 178 L 86 234" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 168 178 L 154 234" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />

          {/* Ribbed Bottom Waistband */}
          <rect
            x="52"
            y="244"
            width="136"
            height="18"
            rx="2"
            fill={colorHex}
            stroke="#3f3f46"
            strokeWidth="1.2"
          />
          <rect x="52" y="244" width="136" height="18" rx="2" fill="rgba(0,0,0,0.15)" />
          {/* Waistband fine rib stitching */}
          <line x1="52" y1="245" x2="188" y2="245" stroke="#52525b" strokeWidth="0.8" strokeDasharray="3 2" />

          {/* Ribbed Sleeve Cuffs */}
          <path d="M 14 146 L 40 156 L 36 166 L 10 156 Z" fill={colorHex} stroke="#3f3f46" strokeWidth="1" />
          <path d="M 226 146 L 200 156 L 204 166 L 230 156 Z" fill={colorHex} stroke="#3f3f46" strokeWidth="1" />

          {/* Natural Cotton Drawstrings (No garish neon, realistic off-white/charcoal with metal aglets) */}
          <g opacity="0.85">
            {/* Left string */}
            <path
              d="M 104 56 C 102 75 106 90 103 108"
              stroke="#e4e4e7"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left metal aglet */}
            <rect x="101.5" y="108" width="3" height="8" rx="1" fill="#a1a1aa" />

            {/* Right string */}
            <path
              d="M 136 56 C 138 75 134 90 137 108"
              stroke="#e4e4e7"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right metal aglet */}
            <rect x="135.5" y="108" width="3" height="8" rx="1" fill="#a1a1aa" />
          </g>
        </g>
      )}

      {garment === "tshirt" && (
        <g id="tshirt-group">
          {/* Main Body with Boxy Streetwear Proportions */}
          <path
            d="M 94 34 
               L 48 54 
               L 18 112 
               L 48 126 
               L 56 98 
               L 56 250 
               C 56 254 184 254 184 250 
               L 184 98 
               L 192 126 
               L 222 112 
               L 192 54 
               L 146 34 
               Z"
            fill={colorHex}
            stroke="#27272a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Soft Fabric Lighting */}
          <path
            d="M 94 34 L 48 54 L 18 112 L 48 126 L 56 98 L 56 250 C 56 254 184 254 184 250 L 184 98 L 192 126 L 222 112 L 192 54 L 146 34 Z"
            fill={`url(#fabric-grad-${uid})`}
          />

          {/* Inside Neck Hole Tape & Shadow */}
          <path
            d="M 94 34 C 102 24 138 24 146 34 C 138 42 102 42 94 34 Z"
            fill="#121214"
            opacity="0.8"
          />

          {/* Ribbed Crewneck Collar Band */}
          <path
            d="M 94 34 C 102 52 138 52 146 34 C 142 56 98 56 94 34 Z"
            fill={colorHex}
            stroke="#3f3f46"
            strokeWidth="1.2"
          />
          <path
            d="M 94 34 C 102 52 138 52 146 34 C 142 56 98 56 94 34 Z"
            fill="rgba(0,0,0,0.15)"
          />

          {/* Shoulder Seams */}
          <path d="M 94 34 L 48 54" stroke="#3f3f46" strokeWidth="0.9" strokeDasharray="3 2" />
          <path d="M 146 34 L 192 54" stroke="#3f3f46" strokeWidth="0.9" strokeDasharray="3 2" />

          {/* Sleeve Hem Double Stitches */}
          <line x1="22" y1="110" x2="48" y2="122" stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="218" y1="110" x2="192" y2="122" stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="2 2" />

          {/* Bottom Hem Double Stitch */}
          <line x1="56" y1="244" x2="184" y2="244" stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="3 2" />
        </g>
      )}

      {garment === "crewneck" && (
        <g id="crewneck-group">
          {/* Main Body */}
          <path
            d="M 92 36 
               L 46 56 
               L 16 130 
               L 42 140 
               L 54 110 
               L 54 242 
               L 186 242 
               L 186 110 
               L 198 140 
               L 224 130 
               L 194 56 
               L 148 36 
               Z"
            fill={colorHex}
            stroke="#27272a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M 92 36 L 46 56 L 16 130 L 42 140 L 54 110 L 54 242 L 186 242 L 186 110 L 198 140 L 224 130 L 194 56 L 148 36 Z"
            fill={`url(#fabric-grad-${uid})`}
          />

          {/* Inside Neck */}
          <path d="M 92 36 C 102 26 138 26 148 36 C 138 42 102 42 92 36 Z" fill="#121214" opacity="0.8" />

          {/* Thick Ribbed Collar Band */}
          <path
            d="M 92 36 C 102 50 138 50 148 36 C 144 54 96 54 92 36 Z"
            fill={colorHex}
            stroke="#3f3f46"
            strokeWidth="1.2"
          />
          <path d="M 92 36 C 102 50 138 50 148 36 C 144 54 96 54 92 36 Z" fill="rgba(0,0,0,0.15)" />

          {/* Classic V-Insert Sweatshirt Triangle */}
          <path
            d="M 112 50 L 120 60 L 128 50"
            stroke="#52525b"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Ribbed Waistband */}
          <rect x="54" y="242" width="132" height="18" rx="2" fill={colorHex} stroke="#3f3f46" strokeWidth="1.2" />
          <rect x="54" y="242" width="132" height="18" rx="2" fill="rgba(0,0,0,0.15)" />

          {/* Ribbed Cuffs */}
          <path d="M 16 130 L 42 140 L 38 150 L 12 140 Z" fill={colorHex} stroke="#3f3f46" strokeWidth="1" />
          <path d="M 224 130 L 198 140 L 202 150 L 228 140 Z" fill={colorHex} stroke="#3f3f46" strokeWidth="1" />
        </g>
      )}

      {garment === "longsleeve" && (
        <g id="longsleeve-group">
          {/* Main Body with Extended Long Sleeves */}
          <path
            d="M 94 34 
               L 48 54 
               L 16 195 
               L 38 202 
               L 56 112 
               L 56 250 
               L 184 250 
               L 184 112 
               L 202 202 
               L 224 195 
               L 192 54 
               L 146 34 
               Z"
            fill={colorHex}
            stroke="#27272a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M 94 34 L 48 54 L 16 195 L 38 202 L 56 112 L 56 250 L 184 250 L 184 112 L 202 202 L 224 195 L 192 54 L 146 34 Z"
            fill={`url(#fabric-grad-${uid})`}
          />

          {/* Neckline */}
          <path d="M 94 34 C 102 24 138 24 146 34 C 138 42 102 42 94 34 Z" fill="#121214" opacity="0.8" />
          <path d="M 94 34 C 102 52 138 52 146 34 C 142 56 98 56 94 34 Z" fill={colorHex} stroke="#3f3f46" strokeWidth="1.2" />

          {/* Longsleeve Ribbed Wrist Cuffs */}
          <path d="M 16 195 L 38 202 L 35 214 L 13 207 Z" fill={colorHex} stroke="#3f3f46" strokeWidth="1.1" />
          <path d="M 224 195 L 202 202 L 205 214 L 227 207 Z" fill={colorHex} stroke="#3f3f46" strokeWidth="1.1" />
        </g>
      )}

      {garment === "tank" && (
        <g id="tank-group">
          {/* Muscle Tank with Deep Cut Armholes */}
          <path
            d="M 82 36 
               L 62 44 
               C 74 88 74 104 60 120 
               L 60 250 
               L 180 250 
               L 180 120 
               C 166 104 166 88 178 44 
               L 158 36 
               C 146 72 94 72 82 36 Z"
            fill={colorHex}
            stroke="#27272a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M 82 36 L 62 44 C 74 88 74 104 60 120 L 60 250 L 180 250 L 180 120 C 166 104 166 88 178 44 L 158 36 C 146 72 94 72 82 36 Z"
            fill={`url(#fabric-grad-${uid})`}
          />
          {/* Deep Scoop Neck Tape */}
          <path d="M 82 36 C 94 72 146 72 158 36" stroke="#3f3f46" strokeWidth="1.2" fill="none" />
        </g>
      )}

      {garment === "tote" && (
        <g id="tote-group">
          {/* Handles */}
          <path
            d="M 84 105 C 84 25 100 20 120 20 C 140 20 156 25 156 105"
            stroke={colorHex}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 84 105 C 84 25 100 20 120 20 C 140 20 156 25 156 105"
            stroke="#27272a"
            strokeWidth="1.4"
            fill="none"
          />

          {/* Bag Body */}
          <rect
            x="48"
            y="98"
            width="144"
            height="158"
            rx="8"
            fill={colorHex}
            stroke="#27272a"
            strokeWidth="1.2"
          />
          <rect x="48" y="98" width="144" height="158" rx="8" fill={`url(#fabric-grad-${uid})`} />

          {/* Handle Reinforcement Box-X Stitch */}
          <rect x="80" y="102" width="12" height="14" fill="none" stroke="#52525b" strokeWidth="0.8" />
          <line x1="80" y1="102" x2="92" y2="116" stroke="#52525b" strokeWidth="0.8" />
          <line x1="92" y1="102" x2="80" y2="116" stroke="#52525b" strokeWidth="0.8" />

          <rect x="148" y="102" width="12" height="14" fill="none" stroke="#52525b" strokeWidth="0.8" />
          <line x1="148" y1="102" x2="160" y2="116" stroke="#52525b" strokeWidth="0.8" />
          <line x1="160" y1="102" x2="148" y2="116" stroke="#52525b" strokeWidth="0.8" />
        </g>
      )}

      {garment === "socks" && (
        <g id="socks-group">
          {/* Streetwear Ribbed Crew Socks (Pair displayed side-by-side) */}
          {/* Left Sock */}
          <g transform="translate(18, 12)">
            {/* Leg & Foot Silhouette */}
            <path
              d="M 52 40 
                 L 88 40 
                 L 88 170 
                 C 88 190 98 210 115 220 
                 L 105 235 
                 C 85 225 65 200 52 180 
                 L 52 40 Z"
              fill={colorHex}
              stroke="#27272a"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M 52 40 L 88 40 L 88 170 C 88 190 98 210 115 220 L 105 235 C 85 225 65 200 52 180 L 52 40 Z"
              fill={`url(#fabric-grad-${uid})`}
            />
            {/* Ribbed Cuff Texture */}
            <rect x="52" y="40" width="36" height="24" fill="rgba(0,0,0,0.12)" stroke="#3f3f46" strokeWidth="0.8" />
            <line x1="58" y1="40" x2="58" y2="64" stroke="#52525b" strokeWidth="0.8" />
            <line x1="64" y1="40" x2="64" y2="64" stroke="#52525b" strokeWidth="0.8" />
            <line x1="70" y1="40" x2="70" y2="64" stroke="#52525b" strokeWidth="0.8" />
            <line x1="76" y1="40" x2="76" y2="64" stroke="#52525b" strokeWidth="0.8" />
            <line x1="82" y1="40" x2="82" y2="64" stroke="#52525b" strokeWidth="0.8" />
            {/* Reinforced Heel & Toe in Subtle Contrast */}
            <path d="M 52 165 C 50 185 68 195 75 190 Z" fill="rgba(0,0,0,0.2)" />
            <path d="M 105 215 C 118 222 110 235 102 235 Z" fill="rgba(0,0,0,0.2)" />
          </g>

          {/* Right Sock */}
          <g transform="translate(86, 12)">
            <path
              d="M 52 40 
                 L 88 40 
                 L 88 180 
                 C 75 200 55 225 35 235 
                 L 25 220 
                 C 42 210 52 190 52 170 
                 L 52 40 Z"
              fill={colorHex}
              stroke="#27272a"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M 52 40 L 88 40 L 88 180 C 75 200 55 225 35 235 L 25 220 C 42 210 52 190 52 170 L 52 40 Z"
              fill={`url(#fabric-grad-${uid})`}
            />
            {/* Ribbed Cuff Texture */}
            <rect x="52" y="40" width="36" height="24" fill="rgba(0,0,0,0.12)" stroke="#3f3f46" strokeWidth="0.8" />
            <line x1="58" y1="40" x2="58" y2="64" stroke="#52525b" strokeWidth="0.8" />
            <line x1="64" y1="40" x2="64" y2="64" stroke="#52525b" strokeWidth="0.8" />
            <line x1="70" y1="40" x2="70" y2="64" stroke="#52525b" strokeWidth="0.8" />
            <line x1="76" y1="40" x2="76" y2="64" stroke="#52525b" strokeWidth="0.8" />
            <line x1="82" y1="40" x2="82" y2="64" stroke="#52525b" strokeWidth="0.8" />
            {/* Heel & Toe */}
            <path d="M 88 165 C 90 185 72 195 65 190 Z" fill="rgba(0,0,0,0.2)" />
            <path d="M 35 215 C 22 222 30 235 38 235 Z" fill="rgba(0,0,0,0.2)" />
          </g>
        </g>
      )}

      {garment === "shoes" && (
        <g id="shoes-group" transform="translate(6, 15)">
          {/* Streetwear Canvas Low-Top Sneaker Silhouette */}
          {/* Vulcanized Rubber Outsole / Midsole */}
          <path
            d="M 18 206 
               C 18 206 35 204 65 204 
               L 190 204 
               C 215 204 218 214 218 226 
               L 218 234 
               L 18 234 
               Z"
            fill="#f4f4f5"
            stroke="#27272a"
            strokeWidth="1.2"
          />
          {/* Black Foxing Midsole Pinstripe */}
          <line x1="22" y1="218" x2="216" y2="218" stroke="#18181b" strokeWidth="1.8" />

          {/* Rubber Textured Toe Bumper */}
          <path
            d="M 18 206 C 24 175 42 165 58 165 L 58 206 Z"
            fill="#f4f4f5"
            stroke="#27272a"
            strokeWidth="1.2"
          />

          {/* Canvas Upper (Quarter & Collar) in Chosen Color */}
          <path
            d="M 58 165 
               L 92 128 
               L 132 118 
               C 152 118 162 135 178 132 
               L 204 142 
               C 216 150 216 185 216 204 
               L 58 204 
               Z"
            fill={colorHex}
            stroke="#27272a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M 58 165 L 92 128 L 132 118 C 152 118 162 135 178 132 L 204 142 C 216 150 216 185 216 204 L 58 204 Z"
            fill={`url(#fabric-grad-${uid})`}
          />

          {/* White Ankle Padded Collar */}
          <path
            d="M 160 134 C 172 130 196 138 204 142 L 200 152 C 190 148 170 142 158 144 Z"
            fill="#ffffff"
            stroke="#3f3f46"
            strokeWidth="0.8"
          />

          {/* Eyelet Stay & Laces */}
          <path
            d="M 58 165 L 92 128 L 118 132 L 86 172 Z"
            fill="rgba(0,0,0,0.15)"
            stroke="#3f3f46"
            strokeWidth="0.8"
          />
          {/* Silver Eyelets */}
          <circle cx="86" cy="148" r="2.5" fill="#e4e4e7" stroke="#27272a" strokeWidth="0.8" />
          <circle cx="98" cy="142" r="2.5" fill="#e4e4e7" stroke="#27272a" strokeWidth="0.8" />
          <circle cx="110" cy="136" r="2.5" fill="#e4e4e7" stroke="#27272a" strokeWidth="0.8" />

          {/* White Cotton Criss-Cross Laces */}
          <line x1="82" y1="152" x2="94" y2="140" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="94" y1="146" x2="106" y2="134" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="106" y1="140" x2="118" y2="128" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />

          {/* Heel Rubber License Plate Badge */}
          <rect x="210" y="210" width="7" height="18" fill="#e11d48" rx="1" />
        </g>
      )}
    </svg>
  );
}
