import { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Book,
  FileText,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const { setCurrentPage } = useApp();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleFAQ = useCallback((id: string) => {
    setExpandedFAQ((prev) => (prev === id ? null : id));
  }, []);

  const faqs: FAQItem[] = [
    {
      id: "1",
      category: "getting-started",
      question: "How do I start scanning for duplicates?",
      answer:
        "First, add folders to scan in Settings. Then click 'Scan Now' on the Dashboard. Knoux will analyze all files and detect duplicates using advanced AI. The process may take a few moments depending on your folder size.",
    },
    {
      id: "2",
      category: "getting-started",
      question: "What file types does Knoux support?",
      answer:
        "Knoux supports Images (JPG, PNG, GIF), Videos (MP4, MKV, AVI), Audio (MP3, WAV, FLAC), and Documents (PDF, DOCX, XLSX). You can enable or disable file types in Settings.",
    },
    {
      id: "3",
      category: "duplicates",
      question: "How does Knoux detect duplicates?",
      answer:
        "Knoux uses a hybrid approach: Hash-based detection (MD5/SHA256) for exact matches and AI-powered content recognition for similar files. This ensures high accuracy while minimizing false positives.",
    },
    {
      id: "4",
      category: "duplicates",
      question: "Can Knoux miss duplicates?",
      answer:
        "Knoux is highly accurate, but detection depends on your AI sensitivity setting. Set it to 'High' for maximum detection. Some obscurely modified files might not be detected - this is a trade-off to avoid false positives.",
    },
    {
      id: "5",
      category: "safety",
      question: "What is Safe Trash?",
      answer:
        "Safe Trash is a feature that moves files to a protected trash area instead of permanently deleting them. You can review and restore files if needed. Enable it in Settings for maximum safety.",
    },
    {
      id: "6",
      category: "safety",
      question: "Can I recover deleted files?",
      answer:
        "Yes! If Safe Trash is enabled, deleted files go to a trash area where you can restore them. Even if you permanently delete from trash, you may be able to recover using system recovery tools.",
    },
    {
      id: "7",
      category: "features",
      question: "What are Rules and how do I use them?",
      answer:
        "Rules automate duplicate handling. Create a rule to 'Keep Largest Image' and it will automatically mark smaller duplicates for deletion. You can create multiple rules for different file types.",
    },
    {
      id: "8",
      category: "features",
      question: "How does the Smart Suggestion feature work?",
      answer:
        "When duplicates are found, Knoux analyzes file metadata (size, date, quality) to suggest the best file to keep. The suggestion considers recency, file size, and naming patterns.",
    },
    {
      id: "9",
      category: "privacy",
      question: "Is my data safe with Knoux?",
      answer:
        "Absolutely! Knoux works completely offline on your computer. No files are sent to the cloud, and no personal data is collected. All operations happen locally for 100% privacy.",
    },
    {
      id: "10",
      category: "privacy",
      question: "Does Knoux require internet?",
      answer:
        "No! Knoux is a fully offline application. It doesn't require internet connection to function. All duplicate detection and file operations happen locally on your computer.",
    },
  ];

  const categories = [
    { id: "all", name: "All Topics" },
    { id: "getting-started", name: "Getting Started" },
    { id: "duplicates", name: "Duplicate Detection" },
    { id: "safety", name: "Safety & Trash" },
    { id: "features", name: "Features" },
    { id: "privacy", name: "Privacy & Security" },
  ];

  const filteredFAQs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <div className="h-screen w-full bg-background dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-primary" />
              Help & Support
            </h1>
            <p className="text-muted-foreground mt-1">
              Find answers and learn how to use Knoux effectively
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
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* About Section */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              About Knoux Duplicate AI
            </h2>

            <div className="space-y-4 text-foreground">
              <p>
                <span className="font-semibold">Knoux Duplicate AI</span> is a
                professional-grade duplicate file detection and removal tool for
                Windows, macOS, and Linux.
              </p>

              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <p className="text-sm font-semibold text-primary mb-2">
                  🎯 Our Mission
                </p>
                <p className="text-sm">
                  "الذكاء في التنظيم، لا للتكرار" (Intelligence in Organization,
                  No Duplicates) - We believe your computer should be organized
                  and efficient.
                </p>
              </div>

              <div>
                <p className="font-semibold mb-2">Key Features:</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ AI-powered duplicate detection with 99%+ accuracy</li>
                  <li>✓ Support for all major file types</li>
                  <li>✓ Safe Trash for protected deletion</li>
                  <li>✓ Smart suggestions for file selection</li>
                  <li>✓ Batch rules for automation</li>
                  <li>✓ 100% offline - no internet required</li>
                  <li>✓ Complete privacy - no data collection</li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground pt-4 border-t border-border">
                <p>Version 1.0.0 • Built with React, TypeScript & TailwindCSS</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Frequently Asked Questions
            </h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    selectedCategory === cat.id
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground hover:bg-border"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 hover:bg-muted transition-colors flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-foreground text-sm">
                      {faq.question}
                    </h3>

                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {expandedFAQ === faq.id && (
                    <div className="border-t border-border px-6 py-4 bg-muted/30">
                      <p className="text-sm text-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Resources Section */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Book className="w-6 h-6 text-primary" />
              Learning Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <p className="font-semibold text-foreground mb-2">
                  📚 User Guide
                </p>
                <p className="text-sm text-muted-foreground">
                  Complete documentation on how to use Knoux features
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <p className="font-semibold text-foreground mb-2">
                  🎓 Video Tutorials
                </p>
                <p className="text-sm text-muted-foreground">
                  Step-by-step video guides for common tasks
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <p className="font-semibold text-foreground mb-2">
                  ⚙️ Advanced Settings
                </p>
                <p className="text-sm text-muted-foreground">
                  Learn about advanced configuration options
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <p className="font-semibold text-foreground mb-2">
                  🐛 Report Issues
                </p>
                <p className="text-sm text-muted-foreground">
                  Found a bug? Help us improve Knoux
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-secondary/20 border border-secondary rounded-lg p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Need More Help?
            </h2>

            <p className="text-sm text-foreground mb-6">
              We're here to help! If you can't find the answer to your question,
              feel free to reach out to our support team.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() =>
                  alert(
                    "Email support: support@knoux.com\nThis is a demo - use the contact form in the full version"
                  )
                }
              >
                📧 Contact Support
              </Button>
              <Button variant="outline">🌐 Visit Website</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
