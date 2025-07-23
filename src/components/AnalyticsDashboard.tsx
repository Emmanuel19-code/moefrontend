import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransformers, useTransformerStats, useAlerts } from "@/hooks/use-transformers";
import { BarChart3, TrendingUp, AlertTriangle, MapPin, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnalyticsDashboard() {
  const { data: transformers = [] } = useTransformers();
  const { data: stats } = useTransformerStats();
  const { data: alerts = [] } = useAlerts();

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.isResolved);
  const warningAlerts = alerts.filter(alert => alert.severity === 'warning' && !alert.isResolved);
  
  const manufacturerDistribution = transformers.reduce((acc, transformer) => {
    const manufacturer = transformer.manufacturer || 'Unknown';
    acc[manufacturer] = (acc[manufacturer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeDistribution = transformers.reduce((acc, transformer) => {
    const type = transformer.type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getHealthScore = () => {
    if (!stats || stats.total === 0) return 0;
    const goodWeight = stats.good * 100;
    const fairWeight = stats.fair * 70;
    const poorWeight = stats.poor * 30;
    const criticalWeight = stats.critical * 10;
    
    return Math.round((goodWeight + fairWeight + poorWeight + criticalWeight) / stats.total);
  };

  const healthScore = getHealthScore();

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Fleet Health Score</p>
                <p className="text-3xl font-bold">{healthScore}%</p>
                <p className="text-xs text-blue-100 mt-1">Overall performance</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Critical Issues</p>
                <p className="text-3xl font-bold">{criticalAlerts.length}</p>
                <p className="text-xs text-red-100 mt-1">Require immediate attention</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Warnings</p>
                <p className="text-3xl font-bold">{warningAlerts.length}</p>
                <p className="text-xs text-orange-100 mt-1">Need monitoring</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Operational</p>
                <p className="text-3xl font-bold">{stats ? stats.good : 0}</p>
                <p className="text-xs text-green-100 mt-1">Good condition</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Condition Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-ecg-blue" />
              <span>Condition Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats && [
                { label: 'Good', value: stats.good, color: 'bg-green-500', bgColor: 'bg-green-50' },
                { label: 'Fair', value: stats.fair, color: 'bg-orange-500', bgColor: 'bg-orange-50' },
                { label: 'Poor', value: stats.poor, color: 'bg-red-500', bgColor: 'bg-red-50' },
                { label: 'Critical', value: stats.critical, color: 'bg-red-600', bgColor: 'bg-red-100' },
              ].map((item) => {
                const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
                return (
                  <div key={item.label} className={cn("p-4 rounded-lg", item.bgColor)}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-lg font-bold">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={cn("h-2 rounded-full", item.color)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}% of total</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Manufacturer Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Manufacturer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(manufacturerDistribution)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([manufacturer, count]) => {
                  const percentage = transformers.length > 0 ? (count / transformers.length) * 100 : 0;
                  return (
                    <div key={manufacturer} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{manufacturer}</span>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 bg-ecg-blue rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Transformer Types */}
        <Card>
          <CardHeader>
            <CardTitle>Transformer Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(typeDistribution).map(([type, count]) => {
                const percentage = transformers.length > 0 ? (count / transformers.length) * 100 : 0;
                return (
                  <div key={type} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{type}</span>
                      <span className="text-lg font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-ecg-green rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}% of fleet</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">High Risk Indicators</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Oil Leakage:</span>
                    <span className="font-medium">
                      {transformers.filter(t => t.oilLeakage).length} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overheating Signs:</span>
                    <span className="font-medium">
                      {transformers.filter(t => t.overheatingSigns).length} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unauthorized Connections:</span>
                    <span className="font-medium">
                      {transformers.filter(t => t.unauthorizedConnections).length} units
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Maintenance Needed</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Missing Safety Signage:</span>
                    <span className="font-medium">
                      {transformers.filter(t => !t.safetySignagePresent).length} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accessibility Issues:</span>
                    <span className="font-medium">
                      {transformers.filter(t => t.accessibilityIssues).length} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>External Damage:</span>
                    <span className="font-medium">
                      {transformers.filter(t => t.externalDamage).length} units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-ecg-blue" />
            <span>Geographic Coverage - East Legon</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">{transformers.length}</p>
              <p className="text-sm text-blue-600">Total Mapped Units</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">
                {transformers.filter(t => t.latitude && t.longitude).length}
              </p>
              <p className="text-sm text-green-600">Geo-located Units</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-700">100%</p>
              <p className="text-sm text-purple-600">Coverage Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}