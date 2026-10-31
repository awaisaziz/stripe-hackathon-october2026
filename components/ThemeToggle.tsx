"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    const root = document.documentElement;
    root.classList.toggle("light", next);
    root.classList.toggle("dark", !next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
    setLight(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-primary transition-colors"
    >
      {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
