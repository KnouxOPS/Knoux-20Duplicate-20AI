import { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
  CheckCircle,
} from "lucide-react";

interface DuplicateFile {
  id: string;
  name: string;
  path: string;
  size: number;
  sizeFormatted: string;
  type: "image" | "video" | "audio" | "document" | "other";
  created: number;
  modified: number;
  thumbnail?: string;
  isSelected: boolean;
}

interface DuplicateGroup {
  id: string;
  type: string;
  fileCount: number;
  totalSize: number;
  totalSizeFormatted: string;
  recoverableSize: number;
  recoverableSizeFormatted: string;
  files: DuplicateFile[];
  expanded: boolean;
  bestFileIndex: number;
}

export default function ScanPage() {
  const { setCurrentPage, t, isRTL } = useApp();
  const { success, error: notifyError, info } = useNotification();

  const [scanning, setScanning] = useState(false);
  const [groups, setGroups] = useState<DuplicateGroup[]>(
    generateMockDuplicates(),
  );
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(
    new Set(),
  );
  const [previewFile, setPreviewFile] = useState<DuplicateFile | null>(null);

  const toggleGroup = useCallback((groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, expanded: !g.expanded } : g)),
    );
  }, []);

  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedForDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  }, []);

  const keepFile = useCallback(
    (groupId: string, fileIndex: number) => {
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;

      const newSelectedSet = new Set(selectedForDelete);
      newSelectedSet.delete(group.files[fileIndex].id);

      group.files.forEach((file, idx) => {
        if (idx !== fileIndex) {
          newSelectedSet.add(file.id);
        }
      });

      setSelectedForDelete(newSelectedSet);
      success(`${group.files[fileIndex].name} ${isRTL ? "تم تحديده للاحتفاظ" : "marked to keep"}`);
    },
    [groups, selectedForDelete, success, isRTL],
  );

  const handleDeleteFiles = useCallback(async () => {
    if (selectedForDelete.size === 0) {
      notifyError(isRTL ? "لم يتم تحديد ملفات للحذف" : "No files selected for deletion");
      return;
    }

    try {
      setScanning(true);
      const filesToDelete = Array.from(selectedForDelete);

      setGroups((prev) =>
        prev
          .map((group) => ({
            ...group,
            files: group.files.filter((f) => !filesToDelete.includes(f.id)),
          }))
          .filter((group) => group.files.length > 0),
      );

      setSelectedForDelete(new Set());

      success(
        isRTL 
          ? `تم نقل ${filesToDelete.length} ملف إلى سلة المحذوفات بنجاح`
          : `Successfully moved ${filesToDelete.length} files to trash`, 
        {
          description: isRTL 
            ? "يمكنك استعادتها من سلة المحذوفات إذا لزم الأمر"
            : "You can restore them from the trash if needed",
        }
      );
    } catch (err) {
      notifyError(isRTL ? "فشل في حذف الملفات" : "Failed to delete files");
    } finally {
      setScanning(false);
    }
  }, [selectedForDelete, success, notifyError, isRTL]);

  const handleStartScan = useCallback(async () => {
    try {
      setScanning(true);
      info(isRTL ? "جاري بدء فحص التكرارات..." : "Starting duplicate scan...");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newGroups = generateMockDuplicates();
      setGroups(newGroups);
      setSelectedForDelete(new Set());

      success(
        isRTL 
          ? `اكتمل الفحص! تم العثور على ${newGroups.length} مجموعات مكررة`
          : `Scan completed! Found ${newGroups.length} duplicate groups`
      );
    } catch (err) {
      notifyError(isRTL ? "فشل الفحص" : "Scan failed");
    } finally {
      setScanning(false);
    }
  }, [success, notifyError, info, isRTL]);

  const totalSize = groups.reduce((sum, g) => sum + g.totalSize, 0);
  const totalRecoverable = groups.reduce(
    (sum, g) => sum + g.recoverableSize,
    0,
  );
  const totalFiles = groups.reduce((sum, g) => sum + g.fileCount, 0);

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎬";
      case "document":
        return "📄";
      case "audio":
        return "🎵";
      default:
        return "📁";
    }
  };

  const getTypeLabel = (type: string) => {
    if (isRTL) {
      switch (type) {
        case "image": return "صور";
        case "video": return "فيديوهات";
        case "document": return "مستندات";
        case "audio": return "صوتيات";
        default: return "أخرى";
      }
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="h-screen w-full bg-background dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={isRTL ? "text-right" : ""}>
              <h1 className="text-3xl font-bold text-foreground">
                {t.scan.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isRTL 
                  ? `تم العثور على ${groups.length} مجموعات مكررة مع ${formatFileSize(totalRecoverable)} من المساحة القابلة للاستعادة`
                  : `Found ${groups.length} duplicate groups with ${formatFileSize(totalRecoverable)} of recoverable space`
                }
              </p>
            </div>

            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Button
                onClick={() => setCurrentPage("dashboard")}
                variant="outline"
              >
                {t.scan.back}
              </Button>
              <Button
                onClick={handleStartScan}
                disabled={scanning}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {scanning ? t.scan.scanning : t.scan.newScan}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`bg-muted rounded-lg p-4 ${isRTL ? "text-right" : ""}`}>
              <p className="text-xs text-muted-foreground mb-1">
                {t.scan.totalDuplicates}
              </p>
              <p className="text-2xl font-bold text-foreground">{totalFiles}</p>
            </div>
            <div className={`bg-muted rounded-lg p-4 ${isRTL ? "text-right" : ""}`}>
              <p className="text-xs text-muted-foreground mb-1">{t.scan.totalSize}</p>
              <p className="text-2xl font-bold text-foreground">
                {formatFileSize(totalSize)}
              </p>
            </div>
            <div className={`bg-secondary/20 rounded-lg p-4 ${isRTL ? "text-right" : ""}`}>
              <p className="text-xs text-muted-foreground mb-1">{t.scan.canRecover}</p>
              <p className="text-2xl font-bold text-secondary">
                {formatFileSize(totalRecoverable)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-4">
          {groups.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t.scan.noDuplicatesFound}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t.scan.systemClean}
              </p>
              <Button
                onClick={handleStartScan}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {t.scan.runNewScan}
              </Button>
            </div>
          ) : (
            <>
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in-up"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full px-6 py-4 hover:bg-muted transition-colors flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex items-center gap-4 flex-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="text-2xl">{getTypeEmoji(group.type)}</div>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="font-semibold text-foreground">
                          {getTypeLabel(group.type)} {t.scan.duplicates}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {group.fileCount} {isRTL ? "ملفات" : "files"} • {group.totalSizeFormatted}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={isRTL ? "text-left" : "text-right"}>
                        <p className="text-sm font-medium text-secondary">
                          {group.recoverableSizeFormatted}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.scan.recoverable}
                        </p>
                      </div>

                      {group.expanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Group Content */}
                  {group.expanded && (
                    <div className="border-t border-border px-6 py-4 bg-muted/30 space-y-3">
                      {group.files.map((file, idx) => (
                        <div
                          key={file.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isRTL ? "flex-row-reverse" : ""} ${
                            selectedForDelete.has(file.id)
                              ? "bg-destructive/10 border border-destructive"
                              : "bg-background border border-border hover:border-primary"
                          }`}
                        >
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedForDelete.has(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                            className="w-5 h-5 rounded cursor-pointer"
                          />

                          {/* File Info */}
                          <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                            <p className="font-medium text-foreground text-sm">
                              {idx === group.bestFileIndex && (
                                <span className={`inline-block bg-primary text-white text-xs px-2 py-0.5 rounded ${isRTL ? "ml-2" : "mr-2"}`}>
                                  {t.scan.best}
                                </span>
                              )}
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file.sizeFormatted} • {isRTL ? "آخر تعديل:" : "Modified:"}{" "}
                              {new Date(file.modified).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPreviewFile(file)}
                              className="h-8 w-8 p-0"
                              title={t.scan.preview}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            {idx !== group.bestFileIndex && (
                              <Button
                                size="sm"
                                onClick={() => keepFile(group.id, idx)}
                                className="h-8 px-2 text-xs"
                                variant="outline"
                                title={t.scan.keep}
                              >
                                {t.scan.keep}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Action Footer */}
              {groups.length > 0 && (
                <div className={`sticky bottom-0 bg-card border-t border-border p-6 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">
                        {selectedForDelete.size}
                      </span>{" "}
                      {t.scan.filesSelectedForDeletion}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.scan.movedToSafeTrash}
                    </p>
                  </div>

                  <Button
                    onClick={handleDeleteFiles}
                    disabled={selectedForDelete.size === 0 || scanning}
                    className={`bg-destructive hover:bg-destructive/90 text-white flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {t.scan.deleteSelectedFiles}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-auto">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <h2 className="text-lg font-bold text-foreground">
                {t.scan.filePreview}
              </h2>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className={isRTL ? "text-right" : ""}>
                <p className="text-sm text-muted-foreground mb-1">{t.scan.filename}</p>
                <p className="font-mono text-sm text-foreground">
                  {previewFile.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-sm text-muted-foreground mb-1">{t.scan.size}</p>
                  <p className="font-semibold text-foreground">
                    {previewFile.sizeFormatted}
                  </p>
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-sm text-muted-foreground mb-1">{t.scan.type}</p>
                  <p className="font-semibold text-foreground capitalize">
                    {getTypeLabel(previewFile.type)}
                  </p>
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-sm text-muted-foreground mb-1">{t.scan.created}</p>
                  <p className="font-semibold text-foreground">
                    {new Date(previewFile.created).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                  </p>
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-sm text-muted-foreground mb-1">{t.scan.modified}</p>
                  <p className="font-semibold text-foreground">
                    {new Date(previewFile.modified).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                  </p>
                </div>
              </div>

              <div className={isRTL ? "text-right" : ""}>
                <p className="text-sm text-muted-foreground mb-1">{t.scan.path}</p>
                <p className={`font-mono text-xs text-muted-foreground break-all ${isRTL ? "direction-ltr" : ""}`}>
                  {previewFile.path}
                </p>
              </div>
            </div>

            <div className={`flex gap-3 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Button
                onClick={() => setPreviewFile(null)}
                variant="outline"
                className="flex-1"
              >
                {t.scan.close}
              </Button>
              <Button
                onClick={() => {
                  toggleFileSelection(previewFile.id);
                  setPreviewFile(null);
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                {selectedForDelete.has(previewFile.id)
                  ? t.scan.keepThisFile
                  : t.scan.deleteThisFile}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateMockDuplicates(): DuplicateGroup[] {
  return [
    {
      id: "group-1",
      type: "image",
      fileCount: 3,
      totalSize: 15728640,
      totalSizeFormatted: "15 MB",
      recoverableSize: 10485760,
      recoverableSizeFormatted: "10 MB",
      expanded: false,
      bestFileIndex: 0,
      files: [
        {
          id: "file-1-1",
          name: "vacation_2024.jpg",
          path: "C:\\Users\\Documents\\Photos\\vacation_2024.jpg",
          size: 5242880,
          sizeFormatted: "5 MB",
          type: "image",
          created: Date.now() - 7 * 24 * 60 * 60 * 1000,
          modified: Date.now() - 7 * 24 * 60 * 60 * 1000,
          isSelected: false,
        },
        {
          id: "file-1-2",
          name: "vacation_2024 (1).jpg",
          path: "C:\\Users\\Desktop\\vacation_2024 (1).jpg",
          size: 5242880,
          sizeFormatted: "5 MB",
          type: "image",
          created: Date.now() - 10 * 24 * 60 * 60 * 1000,
          modified: Date.now() - 10 * 24 * 60 * 60 * 1000,
          isSelected: false,
        },
        {
          id: "file-1-3",
          name: "vacation_2024_copy.jpg",
          path: "C:\\Users\\Downloads\\vacation_2024_copy.jpg",
          size: 5242880,
          sizeFormatted: "5 MB",
          type: "image",
          created: Date.now() - 20 * 24 * 60 * 60 * 1000,
          modified: Date.now() - 20 * 24 * 60 * 60 * 1000,
          isSelected: false,
        },
      ],
    },
    {
      id: "group-2",
      type: "document",
      fileCount: 2,
      totalSize: 2097152,
      totalSizeFormatted: "2 MB",
      recoverableSize: 1048576,
      recoverableSizeFormatted: "1 MB",
      expanded: false,
      bestFileIndex: 0,
      files: [
        {
          id: "file-2-1",
          name: "report_final.pdf",
          path: "C:\\Users\\Documents\\report_final.pdf",
          size: 1048576,
          sizeFormatted: "1 MB",
          type: "document",
          created: Date.now() - 3 * 24 * 60 * 60 * 1000,
          modified: Date.now() - 3 * 24 * 60 * 60 * 1000,
          isSelected: false,
        },
        {
          id: "file-2-2",
          name: "report_final (1).pdf",
          path: "C:\\Users\\Desktop\\report_final (1).pdf",
          size: 1048576,
          sizeFormatted: "1 MB",
          type: "document",
          created: Date.now() - 5 * 24 * 60 * 60 * 1000,
          modified: Date.now() - 5 * 24 * 60 * 60 * 1000,
          isSelected: false,
        },
      ],
    },
    {
      id: "group-3",
      type: "video",
      fileCount: 2,
      totalSize: 3145728,
      totalSizeFormatted: "3 MB",
      recoverableSize: 1572864,
      recoverableSizeFormatted: "1.5 MB",
      expanded: false,
      bestFileIndex: 0,
      files: [
        {
          id: "file-3-1",
          name: "birthday_party.mp4",
          path: "C:\\Users\\Videos\\birthday_party.mp4",
          size: 1572864,
          sizeFormatted: "1.5 MB",
          type: "video",
          created: Date.now() - 2 * 24 * 60 * 60 * 1000,
          modified: Date.now() - 2 * 24 * 60 * 60 * 1000,
          isSelected: false,
        },
        {
          id: "file-3-2",
          name: "birthday_party_backup.mp4",
          path: "C:\\Users\\Documents\\Backups\\birthday_party_backup.mp4",
          size: 1572864,
          sizeFormatted: "1.5 MB",
          type: "video",
          created: Date.now() - 30 * 24 * 60 * 60 * 1000,
          modified: Date.now() - 30 * 24 * 60 * 60 * 1000,
          isSelected: false,
        },
      ],
    },
  ];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
