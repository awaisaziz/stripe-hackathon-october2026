import Link from "next/link";
import { getPublishedDesigns } from "@/lib/store";
import { GARMENT_CATALOG, GarmentType, calculatePrice, formatCents } from "@/lib/pricing";
import { Sparkles, Shirt, Search, Tag, Filter } from "lucide-react";
import { GarmentCardPreview } from "@/components/GarmentCardPreview";

export const metadata = {
  title: "Marketplace — PromptWear",
  description: "Browse bespoke generative apparel created by designers worldwide.",
};

export const revalidate = 0; // Dynamic data for hackathon demo

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ garment?: string; q?: string; audience?: string }>;
}) {
  const { garment: filterGarment, q: searchQuery, audience } = await searchParams;
  let allDesigns = await getPublishedDesigns();

  if (filterGarment && filterGarment !== "all") {
    allDesigns = allDesigns.filter((d) => d.garment === filterGarment);
  }

  if (audience && audience !== "all") {
    allDesigns = allDesigns.filter((d) => (d.tags as string[]).includes(audience));
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    allDesigns = allDesigns.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.prompt.toLowerCase().includes(q) ||
        (d.tags as string[]).some((t) => t.toLowerCase().includes(q))
    );
  }

  const garmentsList: { id: string; label: string }[] = [
    { id: "all", label: "All Apparel" },
    { id: "tshirt", label: "T-Shirts" },
    { id: "hoodie", label: "Hoodies" },
    { id: "socks", label: "Socks" },
    { id: "shoes", label: "Shoes" },
    { id: "longsleeve", label: "Long Sleeves" },
    { id: "crewneck", label: "Crewnecks" },
    { id: "tank", label: "Tanks" },
    { id: "tote", label: "Totes" },
  ];

  const audiences = [
    { id: "all", label: "Everyone" },
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
  ];
  const hrefFor = (a: string, g?: string) => {
    const p = new URLSearchParams();
    if (a !== "all") p.set("audience", a);
    if (g && g !== "all") p.set("garment", g);
    const qs = p.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-zinc-800 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded">
              Creator Marketplace
            </span>
            <span className="text-zinc-500 text-xs">/</span>
            <span className="text-zinc-400 text-xs font-mono">Bespoke Drops</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Community Designs
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl">
            Custom-fit to your exact measurements. Every sale pays 80% of the designer markup
            directly to the creator.
          </p>
        </div>

        {/* Create CTA */}
        <Link
          href="/design"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/20 w-fit"
        >
          <Sparkles className="w-4 h-4" />
          <span>Design Your Own</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Chips */}
        <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {audiences.map((a) => {
            const active = (!audience && a.id === "all") || audience === a.id;
            return (
              <Link
                key={a.id}
                href={hrefFor(a.id, filterGarment)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  active
                    ? "bg-zinc-100 text-zinc-950"
                    : "border border-zinc-700 text-zinc-300 hover:border-primary hover:text-primary"
                }`}
              >
                {a.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {garmentsList.map((g) => {
            const isActive = (!filterGarment && g.id === "all") || filterGarment === g.id;
            return (
              <Link
                key={g.id}
                href={hrefFor(audience || "all", g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-black font-bold shadow-sm"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {g.label}
              </Link>
            );
          })}
        </div>
        </div>

        {/* Search input form */}
        <form method="GET" action="/shop" className="relative min-w-[260px]">
          {filterGarment && filterGarment !== "all" && (
            <input type="hidden" name="garment" value={filterGarment} />
          )}
          {audience && audience !== "all" && <input type="hidden" name="audience" value={audience} />}
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery || ""}
            placeholder="Search designs or tags..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
          />
        </form>
      </div>

      {/* Designs Grid */}
      {allDesigns.length === 0 ? (
        <div className="py-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-4">
          <Shirt className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-zinc-200">No designs found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search query or garment filter, or be the first to create one!
          </p>
          <Link
            href="/design"
            className="inline-flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Design Studio</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allDesigns.map((design) => {
            const garmentCfg = GARMENT_CATALOG[design.garment as GarmentType] || GARMENT_CATALOG.tshirt;
            const price = calculatePrice({
              garment: design.garment as GarmentType,
              customFit: true,
              markupCents: design.markupCents,
            });

            return (
              <Link
                key={design.id}
                href={`/shop/${design.slug}`}
                className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
              >
                {/* Garment Mockup Thumbnail with Artwork Printed on Garment */}
                <div className="aspect-square relative flex items-center justify-center overflow-hidden">
                  <GarmentCardPreview
                    garment={design.garment as GarmentType}
                    colorName={design.color}
                    artworkUrl={design.imageUrl}
                    title={design.title}
                    placement={design.placement}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Garment tag badge */}
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-zinc-300 border border-zinc-800">
                    {garmentCfg.name.split(" ")[0]}
                  </span>

                  {/* Designer markup badge */}
                  {design.markupCents > 0 && (
                    <span className="absolute top-3 right-3 bg-primary/90 text-black px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      +{formatCents(design.markupCents)} Markup
                    </span>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {design.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {design.prompt}
                    </p>
                  </div>

                  {/* Tags */}
                  {design.tags && (design.tags as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(design.tags as string[]).slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-850 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price and Action Footer */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-zinc-400 font-mono">Bespoke Fit Price</div>
                      <div className="text-base font-bold text-primary font-mono">
                        {formatCents(price.totalAmountCents)}
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-zinc-800 group-hover:bg-primary group-hover:text-black text-zinc-200 px-3 py-1.5 rounded-lg transition-all">
                      Custom Fit &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
