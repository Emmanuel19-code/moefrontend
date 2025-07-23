import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAlerts, useResolveAlert } from "@/hooks/use-transformers";
import { formatDistanceToNow } from "date-fns";
import {  CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AlertsList() {
  const { data: alerts = [], isLoading } = useAlerts();
  const resolveAlert = useResolveAlert();

  const recentAlerts = alerts
    .filter(alert => !alert.isResolved)
    .slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const handleResolveAlert = (alertId: number) => {
    resolveAlert.mutate(alertId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Alerts
          <Badge variant="secondary">{recentAlerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No active alerts</p>
              <p className="text-sm">All transformers are operating normally</p>
            </div>
          ) : (
            recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border",
                  getSeverityColor(alert.severity)
                )}
              >
                <div className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs opacity-75">
                    Transformer ID: {alert.transformerId}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    {alert.createdAt 
                      ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })
                      : 'Recently'
                    }
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleResolveAlert(alert.id)}
                  disabled={resolveAlert.isPending}
                  className="text-xs"
                >
                  Resolve
                </Button>
              </div>
            ))
          )}
        </div>
        {recentAlerts.length > 0 && (
          <div className="pt-4 border-t border-gray-200 mt-4">
            <Button variant="ghost" className="w-full text-center text-sm text-ecg-blue hover:text-blue-700 font-medium">
              View All Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
