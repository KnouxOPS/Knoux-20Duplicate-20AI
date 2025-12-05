import { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Toggle2, ChevronDown, ChevronUp } from "lucide-react";

interface Rule {
  id: string;
  name: string;
  type: "keep_largest" | "keep_newest" | "keep_best_quality" | "custom";
  category: "image" | "video" | "document" | "audio" | "all";
  enabled: boolean;
  description: string;
}

export default function RulesPage() {
  const { setCurrentPage } = useApp();
  const { success, info } = useNotification();

  const [rules, setRules] = useState<Rule[]>([
    {
      id: "rule-1",
      name: "Keep Largest Images",
      type: "keep_largest",
      category: "image",
      enabled: true,
      description: "Automatically delete smaller duplicate images",
    },
    {
      id: "rule-2",
      name: "Keep Newest Documents",
      type: "keep_newest",
      category: "document",
      enabled: false,
      description: "Keep the most recent versions of documents",
    },
  ]);

  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    name: "",
    type: "keep_largest" as const,
    category: "all" as const,
  });

  const ruleTypes = [
    {
      id: "keep_largest",
      name: "Keep Largest File",
      description: "Delete smaller duplicates",
    },
    {
      id: "keep_newest",
      name: "Keep Newest File",
      description: "Delete older duplicates",
    },
    {
      id: "keep_best_quality",
      name: "Keep Best Quality",
      description: "Delete lower quality files",
    },
    {
      id: "custom",
      name: "Custom Rule",
      description: "Create a custom deletion rule",
    },
  ];

  const categories = [
    { id: "all", name: "All Files" },
    { id: "image", name: "Images" },
    { id: "video", name: "Videos" },
    { id: "document", name: "Documents" },
    { id: "audio", name: "Audio Files" },
  ];

  const handleAddRule = useCallback(() => {
    if (!newRule.name) {
      info("Please enter a rule name");
      return;
    }

    const rule: Rule = {
      id: `rule-${Date.now()}`,
      name: newRule.name,
      type: newRule.type,
      category: newRule.category,
      enabled: true,
      description: `${newRule.type} for ${newRule.category} files`,
    };

    setRules((prev) => [...prev, rule]);
    setShowNewRuleForm(false);
    setNewRule({ name: "", type: "keep_largest", category: "all" });
    success(`Rule "${rule.name}" created`);
  }, [newRule, success, info]);

  const handleDeleteRule = useCallback((ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId);
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
    success(`Rule "${rule?.name}" deleted`);
  }, [rules, success]);

  const handleToggleRule = useCallback((ruleId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      )
    );
  }, []);

  const handleApplyRules = useCallback(() => {
    const enabledCount = rules.filter((r) => r.enabled).length;
    if (enabledCount === 0) {
      info("Enable at least one rule to apply");
      return;
    }

    success(
      `Applied ${enabledCount} rule${enabledCount > 1 ? "s" : ""} to duplicates`,
      {
        description:
          "The selected rules will be applied to your duplicate files",
      }
    );
  }, [rules, success, info]);

  return (
    <div className="h-screen w-full bg-background dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              ⚙️ Rules & Batch Actions
            </h1>
            <p className="text-muted-foreground mt-1">
              Create automated rules to handle duplicate files
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
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <span className="font-semibold">💡 How Rules Work:</span> Create
              rules that automatically select which files to keep when
              duplicates are found. Rules are applied during or after scanning.
            </p>
          </div>

          {/* New Rule Form */}
          {showNewRuleForm && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 animate-fade-in-up">
              <h2 className="text-lg font-bold text-foreground">Create New Rule</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rule Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Delete Old Backups"
                  value={newRule.name}
                  onChange={(e) =>
                    setNewRule((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rule Type
                  </label>
                  <select
                    value={newRule.type}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        type: e.target.value as
                          | "keep_largest"
                          | "keep_newest"
                          | "keep_best_quality"
                          | "custom",
                      }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ruleTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    File Category
                  </label>
                  <select
                    value={newRule.category}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        category: e.target.value as
                          | "image"
                          | "video"
                          | "document"
                          | "audio"
                          | "all",
                      }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowNewRuleForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddRule}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Rule
                </Button>
              </div>
            </div>
          )}

          {/* Rules List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Your Rules ({rules.length})
              </h2>
              <Button
                onClick={() => setShowNewRuleForm(!showNewRuleForm)}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Rule
              </Button>
            </div>

            {rules.length === 0 && !showNewRuleForm && (
              <div className="bg-card border border-dashed border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No rules created yet
                </p>
                <Button
                  onClick={() => setShowNewRuleForm(true)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Rule
                </Button>
              </div>
            )}

            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in-up"
              >
                <button
                  onClick={() =>
                    setExpandedRule(
                      expandedRule === rule.id ? null : rule.id
                    )
                  }
                  className="w-full px-6 py-4 hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        rule.enabled ? "bg-primary" : "bg-muted-foreground"
                      }`}
                    ></div>

                    <div>
                      <p className="font-semibold text-foreground">
                        {rule.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRule(rule.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.enabled
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                      title={rule.enabled ? "Disable rule" : "Enable rule"}
                    >
                      <Toggle2 className="w-5 h-5" />
                    </button>

                    {expandedRule === rule.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedRule === rule.id && (
                  <div className="border-t border-border px-6 py-4 bg-muted/30 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Type
                        </p>
                        <p className="font-medium text-foreground">
                          {ruleTypes.find((t) => t.id === rule.type)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Category
                        </p>
                        <p className="font-medium text-foreground">
                          {categories.find((c) => c.id === rule.category)?.name}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex gap-3">
                      <Button
                        onClick={() => handleDeleteRule(rule.id)}
                        variant="outline"
                        className="flex-1 text-destructive hover:text-destructive flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Rule
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preview */}
          {rules.filter((r) => r.enabled).length > 0 && (
            <div className="bg-secondary/20 border border-secondary rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-4">
                📋 Rules Summary
              </h2>
              <ul className="space-y-2">
                {rules
                  .filter((r) => r.enabled)
                  .map((rule) => (
                    <li key={rule.id} className="text-sm text-foreground">
                      ✓ <span className="font-medium">{rule.name}</span> -{" "}
                      <span className="text-muted-foreground">
                        {rule.description}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {rules.filter((r) => r.enabled).length > 0 && (
        <div className="border-t border-border bg-card p-6">
          <div className="max-w-5xl mx-auto flex justify-end gap-3">
            <Button onClick={() => setCurrentPage("dashboard")} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleApplyRules}
              className="bg-primary hover:bg-primary/90 text-white px-6"
            >
              Apply Rules to Duplicates
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
