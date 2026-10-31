"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  ShoppingBag,
  Share2,
  Bookmark,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  Info,
} from "lucide-react";
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

const STYLE_CHIPS = [
  { id: "streetwear", label: "Streetwear" },
  { id: "anime", label: "Anime Cyberpunk" },
  { id: "vintage", label: "Vintage 70s" },
  { id: "minimal", label: "Minimalist" },
  { id: "typography", label: "Typography" },
  { id: "watercolor", label: "Watercolor" },
];

export function DesignStudio() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial params from URL
  const initialPrompt = searchParams.get("prompt") || "Neo Tokyo cyber ronin with turquoise katana";
  const initialGarment = (searchParams.get("garment") as GarmentType) || "hoodie";

  // State: Garment & Color
  const [garment, setGarment] = useState<GarmentType>(initialGarment);
  const currentGarmentConfig = GARMENT_CATALOG[garment] || GARMENT_CATALOG.hoodie;
  const [selectedColor, setSelectedColor] = useState<string>(currentGarmentConfig.defaultColor);
  const selectedColorHex =
    currentGarmentConfig.availableColors.find((c) => c.name === selectedColor)?.hex || "#111111";

  // State: Generation Prompt & Options
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedStyle, setSelectedStyle] = useState<string>("streetwear");
  const [transparentBg, setTransparentBg] = useState(true);
  const [numImages, setNumImages] = useState(4);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // State: AI Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [variations, setVariations] = useState<{ url: string; prompt: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  // State: Canvas Placement
  const [placement, setPlacement] = useState<PlacementState>({
    x: 50,
    y: 48,
    scale: 0.85,
    rotation: 0,
    side: "front",
  });

  // State: Measurements
  const limits = MEASUREMENT_LIMITS[garment] || MEASUREMENT_LIMITS.hoodie;
  const [measurements, setMeasurements] = useState<MeasurementsData>({
    unit: "in",
    chestWidth: limits.defaultChestInches,
    bodyLength: limits.defaultBodyInches,
  });

  // State: Publishing & Marketplace settings
  const [title, setTitle] = useState("Cyber Ronin 2099");
  const [markupCents, setMarkupCents] = useState(1500); // $15.00 designer markup
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculated Price breakdown
  const price = calculatePrice({
    garment,
    customFit: true,
    markupCents,
  });

  // Generate artwork function
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          transparentBackground: transparentBg,
          numImages,
          negativePrompt: negativePrompt || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation request failed");
      }

      setVariations([]);
      setSelectedImage("");
      setVariations(data.images || []);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0].url);
      }
      setIsDemoFallback(data.isDemoSample || false);
    } catch (err: any) {
      setGenerationError(err.message || "Failed to generate designs");
    } finally {
      setIsGenerating(false);
    }
  };

  // Sync default color when garment changes
  const handleGarmentChange = (newGarment: GarmentType) => {
    setGarment(newGarment);
    const cfg = GARMENT_CATALOG[newGarment];
    setSelectedColor(cfg.defaultColor);
    const gLimits = MEASUREMENT_LIMITS[newGarment];
    setMeasurements((prev) => ({
      ...prev,
      chestWidth: prev.unit === "in" ? gLimits.defaultChestInches : Math.round(gLimits.defaultChestInches * 2.54),
      bodyLength: prev.unit === "in" ? gLimits.defaultBodyInches : Math.round(gLimits.defaultBodyInches * 2.54),
    }));
  };

  // Buy Now via Stripe Checkout
  const handleBuyNow = async () => {
    if (!selectedImage) {
      alert("Please select an artwork variation first.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customDesign: {
            title: title || "Custom Bespoke Apparel",
            prompt,
            imageUrl: selectedImage,
            placement,
            markupCents: 0, // When creator buys their own custom piece directly
          },
          garment,
          color: selectedColor,
          measurements,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not create Stripe checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  // Publish to Marketplace
  const handlePublish = async () => {
    if (!selectedImage) {
      alert("Please select an artwork variation to publish.");
      return;
    }
    setIsSubmitting(true);
    setPublishSuccess(null);
    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          prompt,
          imageUrl: selectedImage,
          garment,
          color: selectedColor,
          placement,
          status: "published",
          markupCents,
          tags: [selectedStyle, garment],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish design");
      }

      setPublishSuccess(`Design "${data.design.title}" published successfully!`);
      setTimeout(() => {
        router.push(`/shop/${data.design.slug}`);
      }, 1500);
    } catch (err: any) {
      alert(`Publishing failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
              Creator Studio
            </span>
            <span className="text-zinc-500 text-xs">/</span>
            <span className="text-zinc-400 text-xs font-mono">Bespoke Apparel Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Design, Fit & Publish
          </h1>
        </div>

        {/* Live Price Pill */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-4">
          <div>
            <div className="text-[11px] text-zinc-400 font-mono">Estimated Unit Cost</div>
            <div className="text-xl font-mono font-bold text-primary">
              {formatCents(price.totalAmountCents)}
            </div>
          </div>
          <div className="text-right text-[11px] text-zinc-400 border-l border-zinc-800 pl-4 space-y-0.5">
            <div>Garment: {formatCents(price.basePriceCents)}</div>
            <div>Bespoke Fit: +{formatCents(price.customFitFeeCents)}</div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Garment Mockup & Placement Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-200">Garment Preview</h2>
              <span className="text-xs text-zinc-400 font-mono">
                {currentGarmentConfig.name} &bull; {selectedColor}
              </span>
            </div>

            {/* Interactive Mockup Canvas */}
            <MockupCanvas
              garment={garment}
              colorHex={selectedColorHex}
              imageUrl={selectedImage}
              placement={placement}
              onChangePlacement={setPlacement}
            />
          </div>

          {/* Measurements Fitting Module */}
          <MeasurementsPicker
            garment={garment}
            value={measurements}
            onChange={setMeasurements}
          />
        </div>

        {/* Right Column: Prompts, Variations & Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Garment & Color Selector */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                Step 1: Choose Garment & Color
              </span>
              <span className="text-xs text-zinc-400">
                Base: {formatCents(currentGarmentConfig.basePriceCents)}
              </span>
            </div>

            {/* Garments Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
              {(Object.keys(GARMENT_CATALOG) as GarmentType[]).map((g) => {
                const cfg = GARMENT_CATALOG[g];
                const isSelected = garment === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGarmentChange(g)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-zinc-800 border-primary shadow-sm ring-1 ring-primary/50 text-white"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">{cfg.name.split(" ")[0]}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {formatCents(cfg.basePriceCents)}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Color Swatches */}
            <div className="pt-2 border-t border-zinc-850 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium mr-2">Color:</span>
              {currentGarmentConfig.availableColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
                    selectedColor === c.name
                      ? "bg-zinc-800 border-primary text-white"
                      : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/40"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: AI Generation Studio */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                Step 2: Describe Your Apparel Design
              </span>
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" /> Ideogram v3
              </span>
            </div>

            {/* Prompt input box */}
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your graphic artwork in natural language (e.g., 'Retro 80s arcade machine overgrown with ivy and wild roses, cyberpunk neon glyphs')..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3.5 text-sm text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <select
                  value={numImages}
                  onChange={(e) => setNumImages(Number(e.target.value))}
                  disabled={isGenerating}
                  aria-label="Number of variations"
                  className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg px-2 py-2 focus:outline-none focus:border-primary"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "variation" : "variations"}
                    </option>
                  ))}
                </select>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-primary/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
              </div>
            </div>

            {/* Style Chips */}
            <div>
              <div className="text-[11px] text-zinc-400 mb-2">Aesthetic style:</div>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSelectedStyle(chip.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedStyle === chip.id
                        ? "bg-primary text-black font-bold shadow-sm"
                        : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? "Hide Advanced Settings" : "Show Advanced Prompt Settings"}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-zinc-200">Transparent Background</div>
                      <div className="text-[11px] text-zinc-400">
                        Isolates the artwork as a vector silhouette badge
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={transparentBg}
                      onChange={(e) => setTransparentBg(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Negative Prompt:</label>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="e.g. text blur, mockup, low resolution..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {generationError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{generationError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="bg-red-500/20 px-2 py-1 rounded text-red-200 hover:bg-red-500/30"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Demo Mode notice if active */}
            {isDemoFallback && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Using high-resolution demo artwork. Put your <code>IDEOGRAM_API_KEY</code> in{" "}
                  <code>.env.local</code> to activate live custom generation!
                </span>
              </div>
            )}

            {/* 4 Generated Variations Grid */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                <span>Select Variation to Place:</span>
                <span className="text-[11px] text-zinc-400 font-mono">{variations.length} variation{variations.length === 1 ? "" : "s"} rendered</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {isGenerating ? (
                  // Loading skeletons
                  Array.from({ length: numImages }, (_, i) => i + 1).map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-zinc-950 border border-zinc-800 animate-pulse flex flex-col items-center justify-center p-3"
                    >
                      <Loader2 className="w-5 h-5 text-primary animate-spin mb-2" />
                      <span className="text-[10px] text-zinc-500 font-mono">Rendering #{i}</span>
                    </div>
                  ))
                ) : variations.length > 0 ? (
                  variations.map((v, idx) => {
                    const isSelected = selectedImage === v.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(v.url)}
                        className={`relative aspect-square rounded-xl overflow-hidden border transition-all group ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/40 shadow-lg"
                            : "border-zinc-800 hover:border-zinc-700 bg-zinc-950"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.url}
                          alt={`Variation ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-1 shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-zinc-300 bg-black/60 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-4 py-8 text-center text-xs text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-850">
                    Click &ldquo;Generate&rdquo; to create {numImages} unique variation{numImages === 1 ? "" : "s"} for this garment.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Marketplace Publishing, Pricing & Actions */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              Step 3: Publish or Buy Now
            </span>

            {/* Title & Markup Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Design Title:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-zinc-300 mb-1">
                  <span>Designer Markup:</span>
                  <span className="text-primary font-mono font-bold">
                    {formatCents(markupCents)} (You keep {formatCents(Math.round(markupCents * DESIGNER_SHARE_RATE))})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="250"
                  value={markupCents}
                  onChange={(e) => setMarkupCents(parseInt(e.target.value, 10))}
                  className="w-full accent-primary h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>$0</span>
                  <span>$25</span>
                  <span>$50</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Base Garment ({currentGarmentConfig.name}):</span>
                <span className="font-mono text-zinc-200">{formatCents(price.basePriceCents)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Precision Custom-Fit Tailoring:</span>
                <span className="font-mono text-zinc-200">+{formatCents(price.customFitFeeCents)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Designer Markup (80% to Designer):</span>
                <span className="font-mono text-primary">+{formatCents(price.markupCents)}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-white text-sm">
                <span>Total Customer Price:</span>
                <span className="text-primary font-mono">{formatCents(price.totalAmountCents)}</span>
              </div>
            </div>

            {/* Success Notification */}
            {publishSuccess && (
              <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>{publishSuccess} Redirecting to marketplace...</span>
              </div>
            )}

            {/* Actions: Buy Now & Publish */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isSubmitting || !selectedImage}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-black py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                <span>Buy Now ({formatCents(price.basePriceCents + price.customFitFeeCents)})</span>
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || !selectedImage}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-750 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm border border-zinc-700 transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4 text-primary" />
                )}
                <span>Publish to Marketplace</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
