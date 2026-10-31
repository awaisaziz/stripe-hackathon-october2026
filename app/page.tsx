import Link from "next/link";
import { getPublishedDesigns } from "@/lib/store";
import { GARMENT_CATALOG, GarmentType, calculatePrice, formatCents } from "@/lib/pricing";
import { LandingPromptInput } from "@/components/LandingPromptInput";
import { Interactive3DGarment } from "@/components/Interactive3DGarment";
import { GarmentCardPreview } from "@/components/GarmentCardPreview";
import {
  Sparkles,
  Ruler,
  ShoppingBag,
  DollarSign,
  ArrowRight,
  Shirt,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Layers,
  Flame,
  Scissors,
  Award,
  Rotate3d,
} from "lucide-react";

export const metadata = {
  title: "PromptWear — Generative Streetwear Atelier",
  description:
    "AI-powered custom apparel marketplace. Describe any design, fit it to your exact measurements, and buy or publish.",
};

export const revalidate = 0;

export default async function HomePage() {
  const allDesigns = await getPublishedDesigns();
  const heroShowcase = allDesigns.slice(0, 4);

  return (
    <div className="space-y-28 pb-24 overflow-hidden">
      {/* 1. HERO SECTION: 2-COLUMN SPLIT (Left: Description & Prompt | Right: 3D Rotatable Garment) */}
      <section className="relative pt-10 sm:pt-16 pb-14 border-b border-zinc-800/80">
        {/* Streetwear grid ambient glow */}
        <div className="absolute inset-0 streetwear-grid opacity-35 pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[360px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Description, Headline, Prompt Box (7 cols) */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-300 shadow-xl backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-white font-semibold">Generative Streetwear Atelier</span>
                <span className="text-zinc-600">&bull;</span>
                <span className="text-primary font-bold">Ideogram v3 &times; Stripe</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.03]">
                  Describe it. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-300">
                    Wear it.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed font-normal">
                  Describe your aesthetic in natural language. Ideogram AI renders high-contrast streetwear
                  artwork. Laser-fit to your exact anatomical measurements, fitted on heavyweight blanks,
                  or published for collectors with an <strong>80% designer royalty</strong>.
                </p>
              </div>

              {/* Prompt Input Box */}
              <div className="pt-2">
                <LandingPromptInput />
              </div>

              {/* Value Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Ideogram v3 AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span>Bespoke Laser Fit</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>80% Creator Royalties</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Rotatable Garment (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Interactive 3D Garment Component */}
              <Interactive3DGarment />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COMMUNITY DROPS (Clean, Modern Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-widest font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>Trending Drops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Curated Community Showcase
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select any piece to inspect 3D placements and customize measurements.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-mono text-primary hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Browse all marketplace pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Featured Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {heroShowcase.map((design) => {
            const garmentCfg = GARMENT_CATALOG[design.garment as GarmentType] || GARMENT_CATALOG.hoodie;
            const price = calculatePrice({
              garment: design.garment as GarmentType,
              customFit: true,
              markupCents: design.markupCents,
            });

            return (
              <Link
                key={design.id}
                href={`/shop/${design.slug}`}
                className="group bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-primary/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 text-left relative overflow-hidden"
              >
                {/* Header: Garment badge & creator handle */}
                <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                  <span className="bg-zinc-950 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
                    {garmentCfg.name.split(" ")[0]}
                  </span>
                  <span className="text-zinc-500 truncate max-w-[110px]">
                    @{design.ownerId}
                  </span>
                </div>

                {/* Garment Mockup Display */}
                <div className="relative aspect-square rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center overflow-hidden group-hover:border-zinc-750 transition-colors">
                  <GarmentCardPreview
                    garment={design.garment as GarmentType}
                    colorName={design.color}
                    artworkUrl={design.imageUrl}
                    title={design.title}
                    placement={design.placement}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />

                  {design.markupCents > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md border border-primary/30 px-2 py-0.5 rounded text-[10px] font-mono text-primary font-bold">
                      +{formatCents(design.markupCents)} royalty
                    </div>
                  )}
                </div>

                {/* Clean Typography Hierarchy (Zero Overlapping Text) */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
                  <div className="font-bold text-white text-sm group-hover:text-primary transition-colors truncate">
                    {design.title}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-zinc-400 capitalize">
                      {design.garment} &bull; {design.color}
                    </span>
                    <span className="font-mono font-bold text-white text-sm">
                      {formatCents(price.totalAmountCents)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. THE 3-STEP BESPOKE WORKFLOW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
            The Bespoke Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How PromptWear Works
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            From prompt description to a physically tailored bespoke garment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-primary font-mono font-bold text-lg">
                01
              </div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase">AI Inference</span>
            </div>
            <h3 className="text-xl font-bold text-white">Describe with AI</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Input natural language prompts with style chips like Streetwear, Anime Cyberpunk,
              Vintage 70s, or Minimalist. Ideogram v3 renders 4 high-contrast print-ready variations.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
                02
              </div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase">Atelier Fit</span>
            </div>
            <h3 className="text-xl font-bold text-white">Fit &amp; 3D Rotate</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Drag, scale, and rotate your artwork onto a live garment mockup. Enter your bespoke
              chest width and body length in inches or cm with automatic anatomical suggestions.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-primary font-mono font-bold text-lg">
                03
              </div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase">Monetize</span>
            </div>
            <h3 className="text-xl font-bold text-white">Wear or Sell</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Buy directly with Stripe test checkout, or publish to the community marketplace.
              When others purchase your piece, you earn 80% of the designer markup automatically.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM BLANKS ATELIER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              Heavyweight Blanks
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Garments Built for Streetwear
            </h2>
          </div>
          <Link
            href="/design"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 font-mono"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(GARMENT_CATALOG) as GarmentType[]).map((g) => {
            const cfg = GARMENT_CATALOG[g];
            return (
              <Link
                key={g}
                href={`/design?garment=${g}`}
                className="group bg-zinc-900/60 border border-zinc-800 hover:border-zinc-750 rounded-2xl p-6 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <Shirt className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                      From {formatCents(cfg.basePriceCents)}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors">
                    {cfg.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{cfg.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    {cfg.availableColors.map((c) => (
                      <span
                        key={c.name}
                        className="w-3 h-3 rounded-full border border-black/50"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform">
                    Design &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. TRANSPARENT ECONOMICS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              Transparent Creator Splits
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Empowering Independent Apparel Designers
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every garment sold transparently attributes revenue: base blank production, laser
              bespoke cutting, and an 80% designer royalty on markups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="bg-zinc-950/90 p-5 rounded-2xl border border-zinc-800 space-y-2">
              <div className="text-xs font-mono text-zinc-400">Blank Production</div>
              <div className="text-2xl font-bold font-mono text-white">Base Garment</div>
              <p className="text-[11px] text-zinc-500">
                Covers heavy combed cotton blank, water-based ink discharge, and sustainable packaging.
              </p>
            </div>

            <div className="bg-zinc-950/90 p-5 rounded-2xl border border-zinc-800 space-y-2">
              <div className="text-xs font-mono text-primary">Anatomical Fit</div>
              <div className="text-2xl font-bold font-mono text-primary">$5.00 Custom Fit</div>
              <p className="text-[11px] text-zinc-500">
                Precision laser cutting calibrated to the wearer&apos;s chest width and body length specifications.
              </p>
            </div>

            <div className="bg-zinc-950/90 p-5 rounded-2xl border border-zinc-800 space-y-2">
              <div className="text-xs font-mono text-amber-400">Creator Earnings</div>
              <div className="text-2xl font-bold font-mono text-amber-400">80% Royalty Share</div>
              <p className="text-[11px] text-zinc-500">
                80% of the designer markup goes straight to the creator; 20% covers platform AI inference compute.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
