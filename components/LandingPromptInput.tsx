"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

const ROTATING_SUGGESTIONS = [
  "Cyberpunk mecha ronin with glowing turquoise katana",
  "Vintage 90s acid-washed chrome melting smiley graphic",
  "Victorian botanical nightshade engraving on bone parchment",
  "Minimalist brutalist Bauhaus geometric sphere with typography",
  "Dark fantasy dragon wrapped in blooming cherry blossoms",
  "Retro 70s sci-fi rover exploring alien dunes under double moon",
];

const PROMPT_CHIPS = [
  { label: "Cyber Ronin", prompt: "Cyberpunk mecha ronin with glowing turquoise katana" },
  { label: "Acid Chrome 90s", prompt: "Vintage 90s acid-washed chrome melting smiley graphic" },
  { label: "Gothic Sakura", prompt: "Dark fantasy dragon wrapped in blooming cherry blossoms" },
  { label: "Bauhaus Minimal", prompt: "Minimalist brutalist Bauhaus geometric sphere with typography" },
];

export function LandingPromptInput() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate through creative prompts every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = prompt.trim() || ROTATING_SUGGESTIONS[placeholderIndex];
    router.push(`/design?prompt=${encodeURIComponent(finalPrompt)}`);
  };

  const handleChipClick = (chipPrompt: string) => {
    setPrompt(chipPrompt);
    router.push(`/design?prompt=${encodeURIComponent(chipPrompt)}`);
  };

  return (
    <div className="w-full max-w-2xl space-y-3">
      {/* Search & Prompt Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center group">
        <div className="absolute left-4 pointer-events-none text-zinc-500 group-focus-within:text-primary transition-colors">
          <Sparkles className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={ROTATING_SUGGESTIONS[placeholderIndex]}
          className="w-full bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-600 rounded-2xl pl-11 pr-36 py-3.5 sm:py-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 shadow-2xl transition-all font-sans"
        />

        <button
          type="submit"
          className="absolute right-2 bg-primary hover:bg-primary-hover text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate</span>
        </button>
      </form>

      {/* Streetwear prompt aesthetic chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-zinc-500 text-[11px] font-mono">Popular styles:</span>
        {PROMPT_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip.prompt)}
            className="text-[11px] font-mono bg-zinc-900/90 border border-zinc-800 hover:border-primary/50 text-zinc-300 hover:text-primary px-3 py-1 rounded-full transition-all shadow-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
