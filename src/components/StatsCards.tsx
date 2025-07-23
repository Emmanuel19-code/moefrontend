import { Card, CardContent } from "@/components/ui/card";
import { Zap, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useTransformerStats } from "@/hooks/use-transformers";
import { cn } from "@/lib/utils";

export function StatsCards() {
  const { data: stats, isLoading } = useTransformerStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Failed to load statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Transformers",
      value: stats.total,
      icon: Zap,
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-100",
      iconBg: "bg-white bg-opacity-20",
    },
    {
      title: "Good Condition",
      value: stats.good,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-100",
      iconBg: "bg-white bg-opacity-20",
    },
    {
      title: "Needs Attention",
      value: stats.fair,
      icon: AlertTriangle,
      gradient: "from-orange-500 to-orange-600",
      textColor: "text-orange-100",
      iconBg: "bg-white bg-opacity-20",
    },
    {
      title: "Critical Issues",
      value: stats.critical,
      icon: XCircle,
      gradient: "from-red-500 to-red-600",
      textColor: "text-red-100",
      iconBg: "bg-white bg-opacity-20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={cn(
              "dashboard-card bg-gradient-to-r text-white border-0",
              card.gradient
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm font-medium", card.textColor)}>
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={cn("p-3 rounded-lg", card.iconBg)}>
                  <Icon className="text-xl h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
