"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Map,
  List,
  AlertTriangle,
  FileText,
  Settings,
  RefreshCw,
  Gauge,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Simulate query invalidation or notification here if needed
      setIsSyncing(false);
    }, 2000);
  };

  // Mock the shape of useSyncData hook
  const syncMutation = {
    isPending: isSyncing,
    mutate: handleSync,
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Gauge },
    { id: "map", label: "Map View", icon: Map },
    { id: "list", label: "Transformer List", icon: List },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 flex-shrink-0 flex flex-col">
      <div className="p-4 flex-1">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id
                    ? "bg-ecg-light-blue text-ecg-blue hover:bg-ecg-light-blue/80"
                    : "text-gray-600 hover:text-ecg-blue hover:bg-gray-50"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-ecg-light-blue p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-ecg-blue">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm font-medium">Data Sync</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            {syncMutation.isPending ? "Syncing..." : "Last sync: 2 minutes ago"}
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={syncMutation.mutate}
            disabled={syncMutation.isPending}
          >
            {syncMutation.isPending ? (
              <>
                <div className="animate-spin h-3 w-3 mr-2 border-2 border-current border-t-transparent rounded-full" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-3 w-3" />
                Sync Now
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
