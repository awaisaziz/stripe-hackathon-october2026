"use client";

import React, { useRef, useState } from "react";
import { RotateCw, ZoomIn, ZoomOut, Move, Maximize2, RefreshCw, Rotate3d, Layers } from "lucide-react";
import { GarmentType, GARMENT_CATALOG } from "@/lib/pricing";
import { GarmentVector, getPrintAreaConfig } from "./GarmentVector";

export interface PlacementState {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  scale: number; // 0.2 to 2.0
  rotation: number; // degrees (-180 to 180)
  side: "front" | "back";
}

interface MockupCanvasProps {
  garment: GarmentType;
  colorHex: string;
  imageUrl?: string;
  placement: PlacementState;
  onChangePlacement: (newPlacement: PlacementState) => void;
  interactive?: boolean;
}

export function MockupCanvas({
  garment,
  colorHex,
  imageUrl,
  placement,
  onChangePlacement,
  interactive = true,
}: MockupCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Artwork Drag state
  const [isDraggingArtwork, setIsDraggingArtwork] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 3D Viewport Tilt Angles
  const [tiltX, setTiltX] = useState(-5);
  const [tiltY, setTiltY] = useState(10);
  const [is3DDragging, setIs3DDragging] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);

  // Handle artwork repositioning
  const handleArtworkMouseDown = (e: React.MouseEvent) => {
    if (!interactive || !imageUrl || is3DMode) return;
    e.stopPropagation();
    setIsDraggingArtwork(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle 3D rotation of the garment
  const handle3DMouseDown = (e: React.MouseEvent) => {
    if (!is3DMode) return;
    setIs3DDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingArtwork && interactive && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.y) / rect.height) * 100;

      onChangePlacement({
        ...placement,
        x: Math.max(15, Math.min(85, placement.x + dx)),
        y: Math.max(15, Math.min(85, placement.y + dy)),
      });

      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (is3DDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setTiltY((prev) => Math.max(-50, Math.min(50, prev + dx * 0.4)));
      setTiltX((prev) => Math.max(-35, Math.min(35, prev - dy * 0.4)));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingArtwork(false);
    setIs3DDragging(false);
  };

  const updateScale = (delta: number) => {
    const next = Math.max(0.3, Math.min(1.8, Math.round((placement.scale + delta) * 100) / 100));
    onChangePlacement({ ...placement, scale: next });
  };

  const updateRotation = (deg: number) => {
    onChangePlacement({ ...placement, rotation: deg });
  };

  const toggleSide = (side: "front" | "back") => {
    onChangePlacement({ ...placement, side });
  };

  const resetAll = () => {
    onChangePlacement({
      x: 50,
      y: garment === "hoodie" || garment === "tshirt" ? 48 : 50,
      scale: 0.85,
      rotation: 0,
      side: "front",
    });
    setTiltX(-5);
    setTiltY(10);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-lg mx-auto">
      {/* View Toggle Bar (Front / Back / 3D Orbit) */}
      {interactive && (
        <div className="flex items-center justify-between w-full mb-3 px-1 text-xs">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIs3DMode(false);
                toggleSide("front");
              }}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                !is3DMode && placement.side === "front"
                  ? "bg-zinc-800 text-primary shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => {
                setIs3DMode(false);
                toggleSide("back");
              }}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                !is3DMode && placement.side === "back"
                  ? "bg-zinc-800 text-primary shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setIs3DMode(!is3DMode)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
                is3DMode
                  ? "bg-primary text-black font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>3D Orbit</span>
            </button>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Mockup Canvas Container with 3D Perspective */}
      <div
        ref={containerRef}
        onMouseDown={handle3DMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full rounded-3xl overflow-hidden border border-zinc-800 flex items-center justify-center transition-all ${
          is3DMode ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={{
          aspectRatio: "4 / 5",
          perspective: 1000,
          background: `radial-gradient(120% 120% at 50% 25%, ${colorHex} 0%, #0d0d10 75%, #050507 100%)`,
        }}
      >
        {/* 3D Transformed Garment Plane */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: is3DMode
              ? `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(20px)`
              : `rotateX(-3deg) rotateY(6deg)`,
          }}
        >
          {/* Garment SVG Vector Silhouette with depth */}
          <div
            className="absolute inset-5 flex items-center justify-center opacity-95 pointer-events-none filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)]"
            style={{ transform: "translateZ(10px)" }}
          >
            <GarmentVector garment={garment} colorHex={colorHex} />
          </div>

          {/* Print Area Guide (Dotted bounds) */}
          {!is3DMode && (() => {
            const pa = getPrintAreaConfig(garment);
            return (
              <div
                className="absolute border border-dashed border-primary/30 rounded-lg pointer-events-none flex items-start justify-end p-1.5 transition-all"
                style={{
                  top: pa.top,
                  left: pa.left,
                  width: pa.width,
                  height: pa.height,
                  transform: "translateZ(15px)",
                }}
              >
                <span className="text-[9px] font-mono text-primary/50 uppercase">Print Zone</span>
              </div>
            );
          })()}

          {/* Artwork Graphic Layer with 3D Depth */}
          {imageUrl ? (
            <div
              onMouseDown={handleArtworkMouseDown}
              className={`absolute transition-transform will-change-transform ${
                !is3DMode ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{
                left: `${placement.x}%`,
                top: `${placement.y}%`,
                transform: `translate(-50%, -50%) translateZ(28px) scale(${placement.scale}) rotate(${placement.rotation}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Custom Artwork Placement"
                draggable={false}
                className="w-44 h-44 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] pointer-events-none"
              />
            </div>
          ) : (
            <div className="text-zinc-500 text-xs font-mono text-center px-4">
              Render artwork to place on {GARMENT_CATALOG[garment]?.name || "garment"}
            </div>
          )}
        </div>

        {/* Floating status pill */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800 text-[10px] text-zinc-300 flex items-center gap-1.5 pointer-events-none">
          {is3DMode ? (
            <>
              <Rotate3d className="w-3 h-3 text-primary animate-pulse" />
              <span>3D Orbit Mode: Drag to tilt angle</span>
            </>
          ) : (
            <>
              <Move className="w-3 h-3 text-primary" />
              <span>Drag artwork to reposition</span>
            </>
          )}
        </div>
      </div>

      {/* Precision Controls: Scale & Rotation */}
      {interactive && imageUrl && !is3DMode && (
        <div className="w-full mt-3 bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl space-y-2.5 text-xs">
          {/* Scale Control */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Maximize2 className="w-3.5 h-3.5 text-primary" />
              <span>Scale: {Math.round(placement.scale * 100)}%</span>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <button
                type="button"
                onClick={() => updateScale(-0.1)}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-200"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <input
                type="range"
                min="0.3"
                max="1.6"
                step="0.05"
                value={placement.scale}
                onChange={(e) => onChangePlacement({ ...placement, scale: parseFloat(e.target.value) })}
                className="w-full accent-primary h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
              <button
                type="button"
                onClick={() => updateScale(0.1)}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-200"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Rotation Control */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Angle: {placement.rotation}&deg;</span>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={placement.rotation}
                onChange={(e) => updateRotation(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
              <button
                type="button"
                onClick={() => updateRotation(0)}
                className="text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800"
              >
                0&deg;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
