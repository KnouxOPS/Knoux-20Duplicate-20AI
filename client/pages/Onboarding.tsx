import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

type OnboardingStep = "folders" | "filetypes" | "ai";

export default function Onboarding() {
  const {
    setCurrentPage,
    updateSettings,
    settings,
    setHasCompletedOnboarding,
  } = useApp();
  const [step, setStep] = useState<OnboardingStep>("folders");
  const [selectedFolders, setSelectedFolders] = useState<string[]>(
    settings.scanPaths,
  );
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(
    settings.fileTypes,
  );
  const [aiSensitivity, setAiSensitivity] = useState(settings.aiSensitivity);

  const fileTypeOptions = [
    { id: "jpg", label: "JPG Images", color: "bg-yellow-400" },
    { id: "png", label: "PNG Images", color: "bg-yellow-400" },
    { id: "mp4", label: "MP4 Videos", color: "bg-blue-500" },
    { id: "mp3", label: "MP3 Audio", color: "bg-orange-500" },
    { id: "pdf", label: "PDF Documents", color: "bg-green-500" },
    { id: "docx", label: "Word Documents", color: "bg-green-500" },
    { id: "xlsx", label: "Excel Files", color: "bg-green-500" },
  ];

  const toggleFileType = (id: string) => {
    setSelectedFileTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleNext = () => {
    if (step === "folders") {
      setStep("filetypes");
    } else if (step === "filetypes") {
      setStep("ai");
    } else if (step === "ai") {
      // Complete onboarding
      updateSettings({
        scanPaths: selectedFolders,
        fileTypes: selectedFileTypes,
        aiSensitivity: aiSensitivity,
      });
      setHasCompletedOnboarding(true);
      setCurrentPage("dashboard");
    }
  };

  const handleBack = () => {
    if (step === "filetypes") {
      setStep("folders");
    } else if (step === "ai") {
      setStep("filetypes");
    }
  };

  const getStepNumber = () => {
    if (step === "folders") return 1;
    if (step === "filetypes") return 2;
    return 3;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Knoux
          </h1>
          <p className="text-muted-foreground">
            Let's get you started in just 3 simple steps
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  num <= getStepNumber()
                    ? "bg-primary text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {num < getStepNumber() ? <Check className="w-5 h-5" /> : num}
              </div>
              {num < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    num < getStepNumber() ? "bg-primary" : "bg-border"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <div className="bg-card rounded-lg border border-border p-8 animate-fade-in-up">
          {step === "folders" && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Step 1: Select Folders to Scan
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose which folders you want to scan for duplicate files. You
                can add more folders later in settings.
              </p>

              <div className="space-y-3">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to browse or drag folders here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (For now, you can add a sample path)
                  </p>
                  <input
                    type="text"
                    placeholder="e.g., C:\\Users\\Documents"
                    className="mt-4 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedFolders[0] || ""}
                    onChange={(e) =>
                      setSelectedFolders([e.target.value].filter(Boolean))
                    }
                  />
                </div>

                {selectedFolders.length > 0 && (
                  <div className="space-y-2">
                    {selectedFolders.map((folder, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span className="text-sm text-foreground">
                          {folder}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedFolders(
                              selectedFolders.filter((_, i) => i !== idx),
                            )
                          }
                          className="text-destructive hover:text-destructive text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "filetypes" && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Step 2: Select File Types
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose which file types you want to scan for duplicates. You can
                enable or disable these types at any time.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {fileTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleFileType(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedFileTypes.includes(option.id)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${option.color}`}
                      ></div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">
                          {option.label}
                        </p>
                      </div>
                      {selectedFileTypes.includes(option.id) && (
                        <Check className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "ai" && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Step 3: AI Sensitivity Level
              </h2>
              <p className="text-muted-foreground mb-8">
                Choose how sensitive the AI should be when detecting duplicate
                files. Higher sensitivity means more duplicates detected but may
                include false positives.
              </p>

              <div className="space-y-4">
                {["low", "medium", "high"].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setAiSensitivity(level as "low" | "medium" | "high")
                    }
                    className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                      aiSensitivity === level
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground capitalize">
                          {level} Sensitivity
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {level === "low"
                            ? "Find only obvious duplicates"
                            : level === "medium"
                              ? "Balanced detection and accuracy"
                              : "Find all possible duplicates"}
                        </p>
                      </div>
                      {aiSensitivity === level && (
                        <Check className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-secondary/20 rounded-lg border border-secondary">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">💡 Tip:</span> You can change
                  the AI sensitivity level at any time in settings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === "folders"}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setHasCompletedOnboarding(true);
                setCurrentPage("dashboard");
              }}
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
            >
              {step === "ai" ? (
                <>
                  Get Started
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
