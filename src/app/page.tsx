"use client"
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { StatsCards } from "@/components/StatsCards";

import { AlertsList } from "@/components/AlertsList";
import { ConditionSummary } from "@/components/ConditionSummary";
import { QuickActions } from "@/components/QuickActions";
import { TransformerList } from "@/components/TransformerList";
import { ReportsView } from "@/components/ReportsView";
import { SettingsView } from "@/components/SettingsView";
import { TransformerDetailModal } from "@/components/TransforDetailModal";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import dynamic from "next/dynamic";

const TransformerMap = dynamic(() =>
  import("@/components/TransformerMap").then(mod => mod.TransformerMap),
  { ssr: false }
);


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTransformerId, setSelectedTransformerId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTransformerSelect = (transformerId: number) => {
    setSelectedTransformerId(transformerId);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Top Statistics */}
            <div className="bg-white p-6 border-b border-gray-200">
              <StatsCards />
            </div>

            {/* Main Dashboard Content */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Map View */}
                <div className="lg:col-span-2">
                  <TransformerMap onTransformerSelect={handleTransformerSelect} />
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  <AlertsList />
                  <ConditionSummary />
                  <QuickActions onTabChange={setActiveTab} />
                </div>
              </div>
            </div>
          </>
        );
      
      case "map":
        return (
          <div className="flex-1 p-6">
            <div className="h-full">
              <TransformerMap onTransformerSelect={handleTransformerSelect} />
            </div>
          </div>
        );
      
      case "list":
        return (
          <div className="flex-1 p-6">
            <TransformerList onTransformerSelect={handleTransformerSelect} />
          </div>
        );
      
      case "analytics":
        return (
          <div className="flex-1 p-6">
            <AnalyticsDashboard />
          </div>
        );
      
      case "alerts":
        return (
          <div className="flex-1 p-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">All System Alerts</h2>
                <AlertsList />
              </div>
            </div>
          </div>
        );
      
      case "reports":
        return (
          <div className="flex-1 p-6">
            <ReportsView />
          </div>
        );
      
      case "settings":
        return (
          <div className="flex-1 p-6">
            <SettingsView />
          </div>
        );
      
      default:
        return (
          <div className="flex-1 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-gray-500">The requested page could not be found.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <TransformerDetailModal
        transformerId={selectedTransformerId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}