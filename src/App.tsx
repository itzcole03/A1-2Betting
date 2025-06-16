import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./components/dashboard/Dashboard";
import { PrizePicks } from "./components/prizepicks/PrizePicks";
import { Analytics } from "./components/analytics/Analytics";
import { ToastContainer } from "./components/common/Toast";
import { useRealTimeData } from "./hooks/useRealTimeData";
import { useEnhancedRealDataSources } from "./hooks/useEnhancedRealDataSources";
import { useRealDataValidation } from "./hooks/useRealDataValidation";
import { useToasts } from "./hooks/useToasts";

function AppContent() {
  const { state } = useApp();
  const [currentSection, setCurrentSection] = useState("dashboard");
  const { toasts, addToast, removeToast } = useToasts();

  // Use real data hooks
  const {
    connectedSourcesCount: realTimeConnected,
    dataQuality: realTimeQuality,
  } = useRealTimeData();
  const {
    connectedSourcesCount: enhancedConnected,
    dataQuality: enhancedQuality,
    totalSourcesCount: enhancedTotal,
  } = useEnhancedRealDataSources();

  const validation = useRealDataValidation();

  // Combine data from both sources
  const totalConnected = realTimeConnected + enhancedConnected;
  const combinedQuality = (realTimeQuality + enhancedQuality) / 2;

  useEffect(() => {
    // Apply dark mode class to document
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkMode]);

  useEffect(() => {
    // Welcome toast with real data status
    if (totalConnected > 0) {
      addToast(
        `🔴 Real Data Platform Active! Connected to ${totalConnected} live sources`,
        "success",
      );
    } else {
      addToast(
        "⚠️ No real data sources available. Check API keys and network connection.",
        "warning",
      );
    }

    // API validation toast
    if (!validation.isValid) {
      addToast(
        `🔑 ${validation.missingKeys.length} API keys missing. Check Data Debug panel.`,
        "warning",
      );
    }
  }, [
    addToast,
    totalConnected,
    validation.isValid,
    validation.missingKeys.length,
  ]);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <Dashboard />;
      case "prizepicks":
        return <PrizePicks />;
      case "analytics":
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        connectedSources={totalConnected}
        dataQuality={combinedQuality}
      />

      <div className="flex-1 overflow-auto">
        <Header
          connectedSources={totalConnected}
          dataQuality={combinedQuality}
        />
        <div className="p-6" style={{ marginTop: "-2px" }}>
          {renderCurrentSection()}
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
