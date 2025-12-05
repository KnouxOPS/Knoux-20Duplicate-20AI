import { useApp } from "@/context/AppContext";
import Splash from "./Splash";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";
import ScanPage from "./Scan";
import SettingsPage from "./Settings";
import RulesPage from "./Rules";
import HelpPage from "./Help";

export default function Index() {
  const { currentPage } = useApp();

  return (
    <>
      {currentPage === "splash" && <Splash />}
      {currentPage === "onboarding" && <Onboarding />}
      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "scan" && <ScanPage />}
      {currentPage === "settings" && <SettingsPage />}
      {currentPage === "rules" && <RulesPage />}
      {currentPage === "help" && <HelpPage />}
    </>
  );
}
