import { Suspense } from "react";
import { DesignStudio } from "@/components/DesignStudio";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Design Studio — PromptWear",
  description: "Create AI custom apparel with Ideogram, fit measurements, and publish or buy now.",
};

export default function DesignPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-zinc-400 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs font-mono">Loading Design Studio...</span>
        </div>
      }
    >
      <DesignStudio />
    </Suspense>
  );
}
