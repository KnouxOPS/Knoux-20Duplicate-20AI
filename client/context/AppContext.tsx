import React, { createContext, useContext, useState, useEffect } from "react";

export type AppPage = "splash" | "onboarding" | "dashboard" | "scan" | "settings" | "rules" | "help";

export interface AppSettings {
  scanPaths: string[];
  fileTypes: string[];
  aiSensitivity: "low" | "medium" | "high";
  trashEnabled: boolean;
  darkMode: boolean;
  language: "en" | "ar";
  themeColors: {
    primary: string;
    secondary: string;
    highlight: string;
    background: string;
  };
}

export const defaultSettings: AppSettings = {
  scanPaths: [],
  fileTypes: ["jpg", "png", "mp4", "mp3", "pdf", "docx", "xlsx"],
  aiSensitivity: "high",
  trashEnabled: true,
  darkMode: false,
  language: "en",
  themeColors: {
    primary: "#6a0dad",
    secondary: "#ffffff",
    highlight: "#ffcc00",
    background: "#1e1e1e",
  },
};

interface AppContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AppPage>("splash");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("knoux_settings");
    const savedDarkMode = localStorage.getItem("knoux_dark_mode");
    const savedOnboarding = localStorage.getItem("knoux_onboarding_completed");

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }

    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    if (savedOnboarding) {
      setHasCompletedOnboarding(JSON.parse(savedOnboarding));
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("knoux_dark_mode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("knoux_settings", JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        settings,
        updateSettings,
        isDarkMode,
        setIsDarkMode,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
