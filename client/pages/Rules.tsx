import { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ToggleLeft, ChevronDown, ChevronUp } from "lucide-react";

interface Rule {
  id: string;
  name: string;
  type: "keep_largest" | "keep_newest" | "keep_best_quality" | "custom";
  category: "image" | "video" | "document" | "audio" | "all";
  enabled: boolean;
  description: string;
}

export default function RulesPage() {
  const { setCurrentPage, t, isRTL } = useApp();
  const { success, info } = useNotification();

  const [rules, setRules] = useState<Rule[]>([
    {
      id: "rule-1",
      name: isRTL ? "احتفظ بأكبر الصور" : "Keep Largest Images",
      type: "keep_largest",
      category: "image",
      enabled: true,
      description: isRTL ? "حذف الصور المكررة الأصغر حجمًا تلقائيًا" : "Automatically delete smaller duplicate images",
    },
    {
      id: "rule-2",
      name: isRTL ? "احتفظ بأحدث المستندات" : "Keep Newest Documents",
      type: "keep_newest",
      category: "document",
      enabled: false,
      description: isRTL ? "الاحتفاظ بأحدث نسخ المستندات" : "Keep the most recent versions of documents",
    },
  ]);

  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<{
    name: string;
    type: "keep_largest" | "keep_newest" | "keep_best_quality" | "custom";
    category: "image" | "video" | "document" | "audio" | "all";
  }>({
    name: "",
    type: "keep_largest",
    category: "all",
  });

  const ruleTypes = [
    {
      id: "keep_largest",
      name: isRTL ? "احتفظ بالأكبر" : "Keep Largest File",
      description: isRTL ? "حذف التكرارات الأصغر" : "Delete smaller duplicates",
    },
    {
      id: "keep_newest",
      name: isRTL ? "احتفظ بالأحدث" : "Keep Newest File",
      description: isRTL ? "حذف التكرارات الأقدم" : "Delete older duplicates",
    },
    {
      id: "keep_best_quality",
      name: isRTL ? "احتفظ بأفضل جودة" : "Keep Best Quality",
      description: isRTL ? "حذف الملفات الأقل جودة" : "Delete lower quality files",
    },
    {
      id: "custom",
      name: isRTL ? "قاعدة مخصصة" : "Custom Rule",
      description: isRTL ? "إنشاء قاعدة حذف مخصصة" : "Create a custom deletion rule",
    },
  ];

  const categories = [
    { id: "all", name: isRTL ? "جميع الملفات" : "All Files" },
    { id: "image", name: isRTL ? "الصور" : "Images" },
    { id: "video", name: isRTL ? "الفيديوهات" : "Videos" },
    { id: "document", name: isRTL ? "المستندات" : "Documents" },
    { id: "audio", name: isRTL ? "الصوتيات" : "Audio Files" },
  ];

  const handleAddRule = useCallback(() => {
    if (!newRule.name) {
      info(isRTL ? "الرجاء إدخال اسم القاعدة" : "Please enter a rule name");
      return;
    }

    const rule: Rule = {
      id: `rule-${Date.now()}`,
      name: newRule.name,
      type: newRule.type,
      category: newRule.category,
      enabled: true,
      description: `${ruleTypes.find(r => r.id === newRule.type)?.name} - ${categories.find(c => c.id === newRule.category)?.name}`,
    };

    setRules((prev) => [...prev, rule]);
    setShowNewRuleForm(false);
    setNewRule({ name: "", type: "keep_largest", category: "all" });
    success(isRTL ? `تم إنشاء القاعدة "${rule.name}"` : `Rule "${rule.name}" created`);
  }, [newRule, success, info, isRTL, ruleTypes, categories]);

  const handleDeleteRule = useCallback(
    (ruleId: string) => {
      const rule = rules.find((r) => r.id === ruleId);
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      success(isRTL ? `تم حذف القاعدة "${rule?.name}"` : `Rule "${rule?.name}" deleted`);
    },
    [rules, success, isRTL],
  );

  const handleToggleRule = useCallback((ruleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)),
    );
  }, []);

  const handleApplyRules = useCallback(() => {
    const enabledCount = rules.filter((r) => r.enabled).length;
    if (enabledCount === 0) {
      info(isRTL ? "فعّل قاعدة واحدة على الأقل للتطبيق" : "Enable at least one rule to apply");
      return;
    }

    success(
      isRTL 
        ? `تم تطبيق ${enabledCount} قاعدة على التكرارات`
        : `Applied ${enabledCount} rule${enabledCount > 1 ? "s" : ""} to duplicates`,
      {
        description: isRTL
          ? "سيتم تطبيق القواعد المحددة على الملفات المكررة"
          : "The selected rules will be applied to your duplicate files",
      },
    );
  }, [rules, success, info, isRTL]);

  return (
    <div className="h-screen w-full bg-background dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className={`max-w-5xl mx-auto flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              {t.rules.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t.rules.subtitle}
            </p>
          </div>

          <Button onClick={() => setCurrentPage("dashboard")} variant="outline">
            {t.rules.back}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Info Box */}
          <div className={`bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${isRTL ? "text-right" : ""}`}>
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <span className="font-semibold">💡 {isRTL ? "كيف تعمل القواعد:" : "How Rules Work:"}</span>{" "}
              {isRTL 
                ? "أنشئ قواعد تحدد تلقائيًا الملفات التي يجب الاحتفاظ بها عند اكتشاف التكرارات. يتم تطبيق القواعد أثناء أو بعد الفحص."
                : "Create rules that automatically select which files to keep when duplicates are found. Rules are applied during or after scanning."
              }
            </p>
          </div>

          {/* New Rule Form */}
          {showNewRuleForm && (
            <div className={`bg-card border border-border rounded-lg p-6 space-y-4 animate-fade-in-up ${isRTL ? "text-right" : ""}`}>
              <h2 className="text-lg font-bold text-foreground">
                {t.rules.createNewRule}
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.rules.ruleName}
                </label>
                <input
                  type="text"
                  placeholder={isRTL ? "مثال: حذف النسخ الاحتياطية القديمة" : "e.g., Delete Old Backups"}
                  value={newRule.name}
                  onChange={(e) =>
                    setNewRule((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${isRTL ? "text-right" : ""}`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.rules.ruleType}
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
                    className={`w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${isRTL ? "text-right" : ""}`}
                    dir={isRTL ? "rtl" : "ltr"}
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
                    {t.rules.fileCategory}
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
                    className={`w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${isRTL ? "text-right" : ""}`}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`flex gap-3 pt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button
                  onClick={() => setShowNewRuleForm(false)}
                  variant="outline"
                >
                  {t.rules.cancel}
                </Button>
                <Button
                  onClick={handleAddRule}
                  className={`flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Plus className="w-4 h-4" />
                  {t.rules.createRule}
                </Button>
              </div>
            </div>
          )}

          {/* Rules List */}
          <div className="space-y-3">
            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <h2 className="text-lg font-bold text-foreground">
                {t.rules.yourRules} ({rules.length})
              </h2>
              <Button
                onClick={() => setShowNewRuleForm(!showNewRuleForm)}
                className={`bg-primary hover:bg-primary/90 text-white flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Plus className="w-4 h-4" />
                {isRTL ? "قاعدة جديدة" : "New Rule"}
              </Button>
            </div>

            {rules.length === 0 && !showNewRuleForm && (
              <div className="bg-card border border-dashed border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {t.rules.noRulesYet}
                </p>
                <Button
                  onClick={() => setShowNewRuleForm(true)}
                  className={`bg-primary hover:bg-primary/90 text-white ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {isRTL ? "أنشئ قاعدتك الأولى" : "Create Your First Rule"}
                </Button>
              </div>
            )}

            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in-up"
              >
                {/* Rule Header - using div instead of nested button */}
                <div
                  onClick={() =>
                    setExpandedRule(expandedRule === rule.id ? null : rule.id)
                  }
                  className={`w-full px-6 py-4 hover:bg-muted transition-colors flex items-center justify-between cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex items-center gap-4 flex-1 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
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

                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div
                      onClick={(e) => handleToggleRule(rule.id, e)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        rule.enabled
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                      title={rule.enabled ? (isRTL ? "تعطيل القاعدة" : "Disable rule") : (isRTL ? "تفعيل القاعدة" : "Enable rule")}
                    >
                      <ToggleLeft className="w-5 h-5" />
                    </div>

                    {expandedRule === rule.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedRule === rule.id && (
                  <div className={`border-t border-border px-6 py-4 bg-muted/30 space-y-4 ${isRTL ? "text-right" : ""}`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {isRTL ? "النوع" : "Type"}
                        </p>
                        <p className="font-medium text-foreground">
                          {ruleTypes.find((t) => t.id === rule.type)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {isRTL ? "الفئة" : "Category"}
                        </p>
                        <p className="font-medium text-foreground">
                          {categories.find((c) => c.id === rule.category)?.name}
                        </p>
                      </div>
                    </div>

                    <div className={`pt-4 border-t border-border flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Button
                        onClick={() => handleDeleteRule(rule.id)}
                        variant="outline"
                        className={`flex-1 text-destructive hover:text-destructive flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        {isRTL ? "حذف القاعدة" : "Delete Rule"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preview */}
          {rules.filter((r) => r.enabled).length > 0 && (
            <div className={`bg-secondary/20 border border-secondary rounded-lg p-6 ${isRTL ? "text-right" : ""}`}>
              <h2 className="font-semibold text-foreground mb-4">
                📋 {isRTL ? "ملخص القواعد" : "Rules Summary"}
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
          <div className={`max-w-5xl mx-auto flex justify-end gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="outline"
            >
              {t.rules.cancel}
            </Button>
            <Button
              onClick={handleApplyRules}
              className="bg-primary hover:bg-primary/90 text-white px-6"
            >
              {isRTL ? "تطبيق القواعد على التكرارات" : "Apply Rules to Duplicates"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
