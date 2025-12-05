import Placeholder from "./Placeholder";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <Placeholder
      title="Settings"
      description="Customize your Knoux experience: manage scan paths, adjust AI sensitivity, configure theme colors, and more."
      icon={<Settings className="w-20 h-20 text-primary" />}
    />
  );
}
