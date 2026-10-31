/**
 * High-aesthetic streetwear graphic artwork for sample marketplace designs.
 * Authentic streetwear artwork, illustrations, emblems, and graphic prints.
 */

export const SEED_ARTWORK: Record<string, string> = {
  // 1. Cyber Ronin (Neon cyberpunk anime samurai illustration)
  ronin: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=85",
  // 2. Ethereal Botanica (Victorian botanical engraved illustration)
  botanica: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=85",
  // 3. Neo-Tokyo Glitch (Vaporwave typography and graphic overlay)
  glitch: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&auto=format&fit=crop&q=85",
  // 4. Acid Horizon (90s rave liquid chrome psychedelic artwork)
  acid: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=900&auto=format&fit=crop&q=85",
  // 5. Astral Nomad (Deep space astronaut lotus surreal art)
  nomad: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=85",
  // 6. Solar Bauhaus (Minimalist Swiss brutalist geometric graphic)
  bauhaus: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=900&auto=format&fit=crop&q=85",
  // 7. Dark Fantasy Sakura (Japanese woodblock dragon & cherry blossoms)
  sakura: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&auto=format&fit=crop&q=85",
  // 8. Cosmic Voyager (Retro 70s sci-fi rover vector linocut)
  voyager: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=900&auto=format&fit=crop&q=85",
  // 9. Cyber Kanji (High contrast streetwear typography)
  kanji: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&auto=format&fit=crop&q=85",
  // 10. Acid Chrome Smiley (Liquid metal rave badge)
  chrome: "https://images.unsplash.com/photo-1563089145-599997674d42?w=900&auto=format&fit=crop&q=85",
};

export function getArtworkUrl(key: keyof typeof SEED_ARTWORK): string {
  return SEED_ARTWORK[key] || SEED_ARTWORK.ronin;
}

export function garmentArt(garment: string, fill: string, accent: string, label: string): string {
  const map: Record<string, keyof typeof SEED_ARTWORK> = {
    RONIN: "ronin",
    BOTANICA: "botanica",
    "NEO TOKYO": "glitch",
    HORIZON: "acid",
    NOMAD: "nomad",
    SOLAR: "bauhaus",
    SAKURA: "sakura",
    VOYAGER: "voyager",
    KANJI: "kanji",
    CHROME: "chrome",
  };

  const key = map[label] || "ronin";
  return getArtworkUrl(key);
}
