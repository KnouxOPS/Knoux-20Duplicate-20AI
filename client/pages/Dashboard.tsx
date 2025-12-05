import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  Scan,
  Grid3x3,
  Trash2,
  FileText,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { setCurrentPage, isDarkMode, setIsDarkMode } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      current: true,
    },
    {
      id: "scan",
      label: "Scan Now",
      icon: Scan,
      current: false,
    },
    {
      id: "rules",
      label: "Rules & Batch Actions",
      icon: Grid3x3,
      current: false,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      current: false,
    },
    {
      id: "help",
      label: "Help / About",
      icon: HelpCircle,
      current: false,
    },
  ];

  return (
    <div className="h-screen flex bg-background dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold text-foreground">Knoux</p>
                <p className="text-xs text-muted-foreground">AI Duplicate</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.current
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                title={sidebarOpen ? "" : item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            title={sidebarOpen ? "" : isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0" />
            )}
            {sidebarOpen && (
              <span className="text-sm font-medium">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            title={sidebarOpen ? "" : "Expand"}
          >
            <Menu className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium">
                {sidebarOpen ? "Collapse" : "Expand"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor your system's duplicate files at a glance
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Files */}
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Files
                  </p>
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Across all folders
                </p>
              </div>

              {/* Duplicates Found */}
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    Duplicates Found
                  </p>
                  <Scan className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-3xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Duplicate copies detected
                </p>
              </div>

              {/* Total Duplicates Size */}
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Size
                  </p>
                  <Trash2 className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground">0 MB</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Possible savings
                </p>
              </div>

              {/* Storage Efficiency */}
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    Storage Efficiency
                  </p>
                  <BarChart3 className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-3xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  No duplicates yet
                </p>
              </div>
            </div>

            {/* File Type Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6 animate-fade-in-up">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  File Type Distribution
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-file-image"></div>
                        <span className="text-sm text-foreground">Images</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        0 files
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-file-image h-2 rounded-full w-0"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-file-video"></div>
                        <span className="text-sm text-foreground">Videos</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        0 files
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-file-video h-2 rounded-full w-0"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-file-document"></div>
                        <span className="text-sm text-foreground">
                          Documents
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        0 files
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-file-document h-2 rounded-full w-0"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-file-audio"></div>
                        <span className="text-sm text-foreground">Audio</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        0 files
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-file-audio h-2 rounded-full w-0"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-lg p-6 animate-fade-in-up">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Quick Tips
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Start a Scan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click "Scan Now" to begin detecting duplicates
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        AI Smart Detection
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uses advanced AI to find true duplicates, not just by name
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Safe Deletion
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Files are moved to safe trash before permanent deletion
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Batch Actions
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Create rules to automatically handle duplicate files
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary to-purple-700 rounded-lg p-8 text-white animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Clean Your System?
              </h2>
              <p className="mb-6 text-white/90">
                Start a duplicate scan now to discover hidden duplicates and
                reclaim valuable storage space.
              </p>
              <Button
                onClick={() => setCurrentPage("scan")}
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <Scan className="w-4 h-4 mr-2" />
                Start Scan Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
