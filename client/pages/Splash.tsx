import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

export default function Splash() {
  const { setCurrentPage, hasCompletedOnboarding, t } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 200);

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        setCurrentPage("dashboard");
      } else {
        setCurrentPage("onboarding");
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [setCurrentPage, hasCompletedOnboarding]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Knoux Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-6 relative">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-4 border-primary opacity-30 animate-pulse"></div>

            {/* Middle circles */}
            <div className="absolute inset-3 rounded-full border-3 border-primary opacity-40"></div>

            {/* Inner circle with color */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-4">Knoux</h1>

        {/* Tagline */}
        <p className="text-xl text-muted-foreground mb-12 font-medium">
          {t.app.tagline}
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-border rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>

        {/* Loading Text */}
        <p className="text-sm text-muted-foreground mt-6">
          {t.app.loading}
        </p>
      </div>
    </div>
  );
}
