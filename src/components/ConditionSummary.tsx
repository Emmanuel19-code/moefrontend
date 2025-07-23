import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTransformerStats } from "@/hooks/use-transformers";

export function ConditionSummary() {
  const { data: stats, isLoading } = useTransformerStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Condition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Condition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No transformer data available</p>
        </CardContent>
      </Card>
    );
  }

  const conditions = [
    {
      label: "Good Condition",
      count: stats.good,
      percentage: (stats.good / stats.total) * 100,
      color: "bg-green-500",
      dotColor: "bg-green-500",
    },
    {
      label: "Fair Condition", 
      count: stats.fair,
      percentage: (stats.fair / stats.total) * 100,
      color: "bg-orange-500",
      dotColor: "bg-orange-500",
    },
    {
      label: "Poor Condition",
      count: stats.poor,
      percentage: (stats.poor / stats.total) * 100,
      color: "bg-red-500",
      dotColor: "bg-red-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Condition Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conditions.map((condition, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${condition.dotColor}`} />
                  <span className="text-sm text-gray-700">{condition.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{condition.count}</p>
                  <p className="text-xs text-gray-500">{condition.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <Progress 
                value={condition.percentage} 
                className="h-2"
                // Custom progress bar color
                style={{
                  '--progress-background': condition.color.replace('bg-', ''),
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
