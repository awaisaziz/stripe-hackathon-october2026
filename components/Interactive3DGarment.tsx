"use client";

import React, { useRef, useState } from "react";
import { Rotate3d, RefreshCw } from "lucide-react";
import { GarmentType, GARMENT_CATALOG } from "@/lib/pricing";
import { GarmentVector, getPrintAreaConfig } from "./GarmentVector";

interface Interactive3DGarmentProps {
  initialGarment?: GarmentType;
  initialArtworkUrl?: string;
  initialColorHex?: string;
  title?: string;
  designer?: string;
  enableControls?: boolean;
}

export function Interactive3DGarment({
  initialGarment = "tshirt",
  initialArtworkUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=85",
  initialColorHex = "#121214",
  title = "Cyber Ronin 2099",
  designer = "kai.studio",
  enableControls = true,
}: Interactive3DGarmentProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Rotation angles
  const [rotY, setRotY] = useState(12); // yaw
  const [rotX, setRotX] = useState(-6); // pitch
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Garment & Color & View toggles
  const [garment, setGarment] = useState<GarmentType>(initialGarment);
  const [colorHex, setColorHex] = useState(initialColorHex);
  const [viewSide, setViewSide] = useState<"front" | "back">("front");
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Curated authentic streetwear presets across multiple apparel categories
  const PRESETS = [
    {
      id: "ronin-tee",
      title: "Cyber Ronin 2099",
      subtitle: "Heavyweight Boxy Tee",
      garment: "tshirt" as GarmentType,
      colorHex: "#121214",
      artUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=85",
      designer: "kai.studio",
      price: "$39.00",
    },
    {
      id: "sakura-hoodie",
      title: "Dark Fantasy Sakura",
      subtitle: "French Terry Hoodie",
      garment: "hoodie" as GarmentType,
      colorHex: "#1c1c22",
      artUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=85",
      designer: "gothic.samurai",
      price: "$63.00",
    },
    {
      id: "kanji-socks",
      title: "Cyber Kanji Socks",
      subtitle: "Ribbed Crew Socks",
      garment: "socks" as GarmentType,
      colorHex: "#f5f5f0",
      artUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&auto=format&fit=crop&q=85",
      designer: "tokyo.protocol",
      price: "$19.00",
    },
    {
      id: "glitch-sneakers",
      title: "Neo-Tokyo Low-Tops",
      subtitle: "Canvas Skate Shoes",
      garment: "shoes" as GarmentType,
      colorHex: "#eeeae2",
      artUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=900&auto=format&fit=crop&q=85",
      designer: "acid.archive",
      price: "$73.00",
    },
  ];

  const currentPreset = PRESETS[activePresetIndex];
  const printArea = getPrintAreaConfig(garment);

  // Mouse drag handlers for full 3D interactive rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);
        setRotY(Math.round(deltaX * 22));
        setRotX(Math.round(-deltaY * 16));
      }
      return;
    }

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotY((prev) => Math.max(-50, Math.min(50, prev + dx * 0.4)));
    setRotX((prev) => Math.max(-35, Math.min(35, prev - dy * 0.4)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    const p = PRESETS[idx];
    setGarment(p.garment);
    setColorHex(p.colorHex);
  };

  const flipSide = () => {
    setViewSide((prev) => (prev === "front" ? "back" : "front"));
  };

  const resetRotation = () => {
    setRotX(-6);
    setRotY(12);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Stage Container */}
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
          setRotX(-6);
          setRotY(12);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full max-w-[460px] rounded-3xl p-6 select-none cursor-grab active:cursor-grabbing transition-shadow duration-500 overflow-hidden"
        style={{
          aspectRatio: "4 / 5",
          perspective: 1200,
          background: "radial-gradient(130% 120% at 50% 15%, #18181f 0%, #0c0c0e 65%, #070709 100%)",
          boxShadow: isHovered
            ? "0 30px 70px -15px rgba(0, 255, 136, 0.2), 0 0 0 1px rgba(0, 255, 136, 0.4)"
            : "0 20px 50px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Floating Top Pills */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-semibold">{currentPreset.title}</span>
            <span className="text-zinc-600 hidden sm:inline">&bull;</span>
            <span className="text-zinc-400 hidden sm:inline text-[11px]">{currentPreset.subtitle}</span>
          </div>

          <button
            type="button"
            onClick={flipSide}
            className="flex items-center gap-1.5 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white transition-all shadow-md"
          >
            <Rotate3d className="w-3.5 h-3.5 text-primary" />
            <span className="capitalize">{viewSide} View</span>
          </button>
        </div>

        {/* 3D Transformed Card Plane */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(30px)`,
          }}
        >
          {/* Ambient Garment Underglow */}
          <div
            className="absolute inset-8 rounded-full blur-[65px] opacity-35 transition-all duration-700 pointer-events-none"
            style={{
              backgroundColor: currentPreset.id.includes("botanica") ? "#c9a96e" : "#00ff88",
              transform: "translateZ(-40px)",
            }}
          />

          {/* Garment Base Layer (Realistic Vector Silhouette with Fabric Depth) */}
          <div
            className="relative w-[85%] h-[85%] flex items-center justify-center filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
            style={{ transform: "translateZ(10px)" }}
          >
            <GarmentVector garment={garment} colorHex={colorHex} />

            {/* Print Area Guide (Dotted bounds) */}
            <div
              className="absolute border border-dashed border-primary/30 rounded-lg pointer-events-none transition-all duration-300"
              style={{
                top: printArea.top,
                left: printArea.left,
                width: printArea.width,
                height: printArea.height,
              }}
            />

            {/* High-Resolution Artwork Layer Floating with 3D Depth */}
            <div
              className="absolute flex items-center justify-center transition-all duration-300 pointer-events-none"
              style={{
                top: printArea.top,
                left: printArea.left,
                width: printArea.width,
                height: printArea.height,
                transform: `translateZ(25px) scale(${viewSide === "front" ? 0.95 : 0.9})`,
                opacity: viewSide === "front" ? 1 : 0.85,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPreset.artUrl}
                alt={currentPreset.title}
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] rounded"
                style={{
                  mixBlendMode: colorHex === "#f5f5f0" || colorHex === "#eeeae2" ? "multiply" : "normal",
                }}
              />
            </div>
          </div>
        </div>

        {/* 3D Interactive Helper Prompt */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800">
            <Rotate3d className="w-3.5 h-3.5 text-primary" />
            <span>Click &amp; drag to rotate 3D angle</span>
          </div>

          <button
            type="button"
            onClick={resetRotation}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:text-white"
            title="Reset Angle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Swatches Selector */}
      {enableControls && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-[460px] w-full">
          {PRESETS.map((p, idx) => {
            const isSelected = activePresetIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPreset(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  isSelected
                    ? "bg-zinc-800 border-primary text-white shadow-md shadow-primary/10"
                    : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/40"
                  style={{ backgroundColor: p.colorHex === "#121214" || p.colorHex === "#1c1c22" ? "#333" : p.colorHex }}
                />
                <span>{p.subtitle.split(" ")[0]} ({p.title.split(" ")[0]})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
