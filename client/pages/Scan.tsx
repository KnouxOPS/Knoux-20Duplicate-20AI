import Placeholder from "./Placeholder";
import { Scan } from "lucide-react";

export default function ScanPage() {
  return (
    <Placeholder
      title="Scan Results"
      description="This page will show your scan results with smart groups of duplicate files, preview options, and bulk actions."
      icon={<Scan className="w-20 h-20 text-primary" />}
    />
  );
}
