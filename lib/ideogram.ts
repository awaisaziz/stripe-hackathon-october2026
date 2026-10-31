import { put } from "@vercel/blob";

export interface GenerateOptions {
  prompt: string;
  style?: string; // "MINIMAL" | "VINTAGE" | "ANIME" | "STREETWEAR" | "WATERCOLOR" | "TYPOGRAPHY"
  aspectRatio?: "ASPECT_1_1" | "ASPECT_4_5" | "ASPECT_3_4" | "ASPECT_16_9";
  negativePrompt?: string;
  transparentBackground?: boolean;
  numImages?: number; // 1-4
}

export interface GenerationResult {
  images: { url: string; prompt: string }[];
  isDemoSample?: boolean;
}

// Fallback aesthetic graphics for demo resilience if the user tests before adding IDEOGRAM_API_KEY
const SAMPLE_PREVIEWS = [
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
];

/**
 * Server-side prompt engineer to make sure the artwork is centered, isolated,
 * and doesn't generate mockups/garments inside the artwork.
 */
export function enhancePromptForGarment(
  basePrompt: string,
  style?: string,
  transparent = true
): string {
  const styleKeywords: Record<string, string> = {
    minimal: "minimalist vector illustration, clean lines, contemporary Swiss graphic design",
    vintage: "distressed vintage screenprint, 1970s retro graphic, weathered ink texture",
    anime: "bold anime cyberpunk emblem, clean cel-shading, futuristic manga aesthetic",
    streetwear: "brutalist high-fashion streetwear graphic, bold heavy typography, raw edges",
    watercolor: "bleeding watercolor artwork, artistic ink splashes, fine art pigment blend",
    typography: "striking typography layout, custom lettering badge, geometric glyphs",
  };

  const styleContext = style && styleKeywords[style.toLowerCase()]
    ? `, ${styleKeywords[style.toLowerCase()]}`
    : style ? `, in ${style} aesthetic` : "";

  const isolationContext = transparent
    ? ", isolated graphic sticker, transparent background, pure crisp vector cutout"
    : ", centered composition, solid minimal backdrop";

  return `${basePrompt.trim()}${styleContext}${isolationContext}, high contrast, 8k resolution apparel artwork, print-ready graphic, no mockup, no t-shirt, no hoodie, no mannequin, artwork only`;
}

/**
 * Generate 4 artwork variations via Ideogram API
 */
export async function generateArtwork(options: GenerateOptions): Promise<GenerationResult> {
  const apiKey = process.env.IDEOGRAM_API_KEY?.trim();

  // If no API key is set yet, return curated fallback samples with notice
  if (!apiKey || apiKey === "placeholder" || apiKey === "") {
    return {
      images: SAMPLE_PREVIEWS.slice(0, options.numImages ?? 4).map((url, i) => ({
        url,
        prompt: `${options.prompt} (Demo sample #${i + 1} - add IDEOGRAM_API_KEY in .env.local for live AI generation)`,
      })),
      isDemoSample: true,
    };
  }

  const enhancedPrompt = enhancePromptForGarment(
    options.prompt,
    options.style,
    options.transparentBackground !== false
  );

  const endpoint =
    process.env.IDEOGRAM_API_ENDPOINT || "https://api.ideogram.ai/v2/image/generate/ideogram-4-5";

  const form = new FormData();
  form.append("prompt", enhancedPrompt);
  form.append("magic_prompt", "auto");
  form.append("size", "auto");
  form.append("quality", "low");
  form.append("num_images", String(Math.min(4, Math.max(1, options.numImages ?? 4))));
  form.append("async", "true");

  const fail = async (response: Response): Promise<never> => {
    const errorText = await response.text();
    if (response.status === 429) {
      throw new Error("Ideogram rate limit reached. Please wait a moment and try again.");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Invalid IDEOGRAM_API_KEY. Please verify your API key in .env.local.");
    }
    if (response.status === 400 && errorText.toLowerCase().includes("safety")) {
      throw new Error("Your prompt could not be generated due to Ideogram safety policy. Please adjust your prompt.");
    }
    throw new Error(`Ideogram API error (${response.status}): ${errorText}`);
  };

  let response: Response;
  try {
    response = await fetch(endpoint, { method: "POST", headers: { "Api-Key": apiKey }, body: form });
  } catch (networkErr: any) {
    throw new Error(`Failed to reach Ideogram API: ${networkErr?.message || networkErr}`);
  }
  if (!response.ok) await fail(response);

  let data = await response.json();

  // async=true returns a generation_id; poll until the images are ready (~60s max)
  if (!data.data && data.generation_id) {
    const pollUrl = `https://api.ideogram.ai/v2/generations/${data.generation_id}`;
    for (let i = 0; i < 30 && !data.data; i++) {
      if (data.status === "failed") throw new Error("Ideogram generation failed. Try a different prompt.");
      await new Promise((r) => setTimeout(r, 2000));
      const poll = await fetch(pollUrl, { headers: { "Api-Key": apiKey } });
      if (!poll.ok) await fail(poll);
      data = await poll.json();
    }
    if (!data.data) throw new Error("Ideogram generation timed out. Please try again.");
  }

  const rawImages: { url: string; prompt?: string }[] = data.data || [];

  if (rawImages.length === 0) {
    throw new Error("Ideogram returned no images for this prompt. Try tweaking the prompt.");
  }

  // Persist images to Vercel Blob because Ideogram URLs expire
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  const persistedImages = await Promise.all(
    rawImages.map(async (img, idx) => {
      if (!blobToken) {
        return { url: img.url, prompt: img.prompt || options.prompt };
      }

      try {
        const imageRes = await fetch(img.url);
        if (!imageRes.ok) return { url: img.url, prompt: img.prompt || options.prompt };

        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `designs/ideogram-${Date.now()}-${idx}.png`;

        const blobResult = await put(fileName, buffer, {
          access: "public",
          contentType: "image/png",
        });

        return { url: blobResult.url, prompt: img.prompt || options.prompt };
      } catch (blobErr) {
        console.warn("Vercel Blob persistence failed, falling back to Ideogram URL:", blobErr);
        return { url: img.url, prompt: img.prompt || options.prompt };
      }
    })
  );

  return {
    images: persistedImages,
    isDemoSample: false,
  };
}
