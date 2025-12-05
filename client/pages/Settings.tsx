import { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Plus,
  X,
  Save,
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function SettingsPage() {
  const { setCurrentPage, settings, updateSettings, isDarkMode } = useApp();
  const { success } = useNotification();

  const [expandedSection, setExpandedSection] = useState<string | null>(
    "general"
  );
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [newFolder, setNewFolder] = useState("");

  const toggleSection = useCallback((section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  const handleAddFolder = useCallback(() => {
    if (newFolder && !localSettings.scanPaths.includes(newFolder)) {
      setLocalSettings((prev) => ({
        ...prev,
        scanPaths: [...prev.scanPaths, newFolder],
      }));
      setNewFolder("");
      success("Folder added");
    }
  }, [newFolder, localSettings.scanPaths, success]);

  const handleRemoveFolder = useCallback((folder: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      scanPaths: prev.scanPaths.filter((f) => f !== folder),
    }));
  }, []);

  const handleToggleFileType = useCallback((type: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(type)
        ? prev.fileTypes.filter((t) => t !== type)
        : [...prev.fileTypes, type],
    }));
  }, []);

  const handleSaveSettings = useCallback(() => {
    updateSettings(localSettings);
    success("Settings saved successfully");
  }, [localSettings, updateSettings, success]);

  const handleReset = useCallback(() => {
    setLocalSettings({ ...settings });
    success("Changes discarded");
  }, [settings, success]);

  const fileTypeOptions = [
    { id: "jpg", label: "JPG Images", category: "images" },
    { id: "png", label: "PNG Images", category: "images" },
    { id: "gif", label: "GIF Images", category: "images" },
    { id: "mp4", label: "MP4 Videos", category: "videos" },
    { id: "mkv", label: "MKV Videos", category: "videos" },
    { id: "avi", label: "AVI Videos", category: "videos" },
    { id: "mp3", label: "MP3 Audio", category: "audio" },
    { id: "wav", label: "WAV Audio", category: "audio" },
    { id: "flac", label: "FLAC Audio", category: "audio" },
    { id: "pdf", label: "PDF Documents", category: "documents" },
    { id: "docx", label: "Word Documents", category: "documents" },
    { id: "xlsx", label: "Excel Files", category: "documents" },
  ];

  const sections = [
    {
      id: "general",
      title: "General Settings",
      icon: Settings,
      content: (
        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Language
            </label>
            <select
              value={localSettings.language}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  language: e.target.value as "en" | "ar",
                }))
              }
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          {/* AI Sensitivity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              AI Sensitivity Level
            </label>
            <div className="space-y-2">
              {["low", "medium", "high"].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                >
                  <input
                    type="radio"
                    name="sensitivity"
                    value={level}
                    checked={localSettings.aiSensitivity === level}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        aiSensitivity: e.target.value as
                          | "low"
                          | "medium"
                          | "high",
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-foreground capitalize">
                      {level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {level === "low"
                        ? "Find only obvious duplicates"
                        : level === "medium"
                          ? "Balanced detection and accuracy"
                          : "Find all possible duplicates"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Show Notifications</p>
              <p className="text-xs text-muted-foreground">
                Display alerts during scanning and operations
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.showNotifications}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  showNotifications: e.target.checked,
                }))
              }
              className="w-5 h-5 rounded"
            />
          </div>
        </div>
      ),
    },
    {
      id: "folders",
      title: "Scan Folders",
      icon: "📁",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose which folders to scan for duplicate files
          </p>

          <div className="space-y-2">
            {localSettings.scanPaths.map((folder) => (
              <div
                key={folder}
                className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
              >
                <p className="text-sm text-foreground break-all">{folder}</p>
                <button
                  onClick={() => handleRemoveFolder(folder)}
                  className="text-destructive hover:text-destructive/80 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {localSettings.scanPaths.length === 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-900 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              No folders selected. Add folders to start scanning.
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <input
              type="text"
              placeholder="e.g., C:\\Users\\Documents"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddFolder()}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleAddFolder}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "filetypes",
      title: "File Types",
      icon: "📄",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select which file types to include in scans
          </p>

          {["images", "videos", "audio", "documents"].map((category) => (
            <div key={category}>
              <p className="text-sm font-semibold text-foreground mb-2 capitalize">
                {category}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {fileTypeOptions
                  .filter((opt) => opt.category === category)
                  .map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={localSettings.fileTypes.includes(option.id)}
                        onChange={() => handleToggleFileType(option.id)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-foreground">
                        {option.label}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "theme",
      title: "Theme & Colors",
      icon: "🎨",
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-900 dark:text-amber-300">
              Current theme: <span className="font-semibold">{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
              Use the toggle in the sidebar to switch themes
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-4">
              Color Scheme
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Primary",
                  key: "primary" as const,
                  current: localSettings.themeColors.primary,
                },
                {
                  name: "Secondary",
                  key: "secondary" as const,
                  current: localSettings.themeColors.secondary,
                },
                {
                  name: "Highlight",
                  key: "highlight" as const,
                  current: localSettings.themeColors.highlight,
                },
                {
                  name: "Background",
                  key: "background" as const,
                  current: localSettings.themeColors.background,
                },
              ].map((color) => (
                <div key={color.key}>
                  <p className="text-xs font-medium text-foreground mb-2">
                    {color.name}
                  </p>
                  <input
                    type="color"
                    value={color.current}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        themeColors: {
                          ...prev.themeColors,
                          [color.key]: e.target.value,
                        },
                      }))
                    }
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "safety",
      title: "Safety & Trash",
      icon: "🗑️",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Safe Trash Enabled</p>
              <p className="text-xs text-muted-foreground">
                Files move to trash before permanent deletion
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.trashEnabled}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  trashEnabled: e.target.checked,
                }))
              }
              className="w-5 h-5 rounded"
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-2">
              💡 Safe Trash Benefits
            </p>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li>✓ Recover files if deleted by mistake</li>
              <li>✓ Review before permanent deletion</li>
              <li>✓ Organize and manage deleted files</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen w-full bg-background dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Customize your Knoux experience
            </p>
          </div>

          <Button
            onClick={() => setCurrentPage("dashboard")}
            variant="outline"
          >
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <h2 className="text-lg font-semibold text-foreground">
                  {section.title}
                </h2>

                {expandedSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-border px-6 py-4 bg-muted/30">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card p-6">
        <div className="max-w-4xl mx-auto flex justify-end gap-3">
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Discard Changes
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
