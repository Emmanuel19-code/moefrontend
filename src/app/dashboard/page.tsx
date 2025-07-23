"use client";
import { AlertsList } from "@/components/AlertsList";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ConditionSummary } from "@/components/ConditionSummary";
import { Header } from "@/components/Header";
import { QuickActions } from "@/components/QuickActions";
import { ReportsView } from "@/components/ReportsView";
import { SettingsView } from "@/components/SettingsView";
import { Sidebar } from "@/components/Sidebar";
import { StatsCards } from "@/components/StatsCards";
import { TransformerDetailModal } from "@/components/TransforDetailModal";
import { TransformerList } from "@/components/TransformerList";
import { useState } from "react";
import dynamic from "next/dynamic";


const TransformerMap = dynamic(() =>
  import("@/components/TransformerMap").then(mod => mod.TransformerMap),
  { ssr: false }
);
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTransformerId, setSelectedTransformerId] = useState<
    number | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTransformerSelect = (transformerId: number) => {
    setSelectedTransformerId(transformerId);
    setModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid gap-6">
            <StatsCards />
            <div className="grid gap-6 md:grid-cols-2">
              <QuickActions onTabChange={setActiveTab} />
              <ConditionSummary />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TransformerMap onTransformerSelect={handleTransformerSelect} />
              </div>
              <AlertsList />
            </div>
          </div>
        );
      case "map":
        return <TransformerMap onTransformerSelect={handleTransformerSelect} />;
      case "list":
        return (
          <TransformerList onTransformerSelect={handleTransformerSelect} />
        );
      case "analytics":
        return <AnalyticsDashboard />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <div className="grid gap-6">
            <StatsCards />
            <div className="grid gap-6 md:grid-cols-2">
              <QuickActions onTabChange={setActiveTab} />
              <ConditionSummary />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TransformerMap onTransformerSelect={handleTransformerSelect} />
              </div>
              <AlertsList />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
      <TransformerDetailModal
        transformerId={selectedTransformerId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
