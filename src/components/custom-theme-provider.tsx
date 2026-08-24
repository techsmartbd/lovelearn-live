"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => null,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({
  children,
  storageKey = "theme",
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  storageKey?: string;
  defaultTheme?: string;
}) {
  const [theme, setThemeState] = useState<string>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read from local storage on mount or storageKey change
    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme || defaultTheme;
    setThemeState(initialTheme);
    applyThemeToDocument(initialTheme);
  }, [storageKey, defaultTheme]);

  // Listen to storage events from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setThemeState(e.newValue);
        applyThemeToDocument(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const applyThemeToDocument = (newTheme: string) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
    applyThemeToDocument(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>; 
    // We return children instead of null so Next.js doesn't break the layout, 
    // but the theme class might flash. It's standard for SSR.
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
