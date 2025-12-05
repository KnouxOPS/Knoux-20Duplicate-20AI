import Placeholder from "./Placeholder";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <Placeholder
      title="Help & About"
      description="Learn how to use Knoux Duplicate AI, find answers to common questions, and get support."
      icon={<HelpCircle className="w-20 h-20 text-primary" />}
    />
  );
}
