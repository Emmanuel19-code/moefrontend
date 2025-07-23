import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  Download, Calendar, FileText,  RefreshCw } from "lucide-react";
import { useSyncData } from "@/hooks/use-transformers";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onTabChange?: (tab: string) => void;
}

export function QuickActions({ onTabChange }: QuickActionsProps) {
  const syncMutation = useSyncData();
  const { toast } = useToast();

  const handleAction = (actionType: string, actionName: string) => {
    switch (actionType) {
      case 'analytics':
        if (onTabChange) onTabChange('analytics');
        break;
      case 'sync':
        syncMutation.mutate(undefined, {
          onSuccess: () => {
            toast({
              title: "Data Synchronized",
              description: "Transformer data has been updated from ArcGIS",
            });
          },
          onError: () => {
            toast({
              title: "Sync Failed",
              description: "Unable to sync data. Please try again.",
              //variant: "destructive",
            });
          }
        });
        break;
      case 'export':
        toast({
          title: "Export Started",
          description: "Your report is being generated and will be downloaded shortly.",
        });
        break;
      case 'maintenance':
        toast({
          title: "Maintenance Scheduler",
          description: "This feature will be available in the next update.",
        });
        break;
      default:
        toast({
          title: actionName,
          description: "This feature is being developed.",
        });
    }
  };

  const actions = [
    {
      title: "Sync Data",
      description: "Update from ArcGIS",
      icon: RefreshCw,
      color: "bg-ecg-light-blue text-ecg-blue",
      action: () => handleAction("sync", "Sync Data"),
      loading: syncMutation.isPending,
    },
    {
      title: "Generate Report",
      description: "Export assessment data",
      icon: Download,
      color: "bg-ecg-light-green text-ecg-green",
      action: () => handleAction("export", "Generate Report"),
    },
    {
      title: "Schedule Maintenance",
      description: "Plan upcoming work",
      icon: Calendar,
      color: "bg-orange-100 text-orange-600",
      action: () => handleAction("maintenance", "Schedule Maintenance"),
    },
    {
      title: "View Analytics",
      description: "Performance insights",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
      action: () => handleAction("analytics", "View Analytics"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start p-3 h-auto hover:bg-gray-50"
                onClick={action.action}
                disabled={action.loading}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${action.color}`}>
                  {action.loading ? (
                    <div className="spinner" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
