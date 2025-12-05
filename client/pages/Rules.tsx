import Placeholder from "./Placeholder";
import { Grid3x3 } from "lucide-react";

export default function RulesPage() {
  return (
    <Placeholder
      title="Rules & Batch Actions"
      description="Create automated rules for duplicate deletion: keep the newest file, highest quality version, or largest file. Drag and drop to configure."
      icon={<Grid3x3 className="w-20 h-20 text-primary" />}
    />
  );
}
