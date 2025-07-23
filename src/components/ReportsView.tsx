import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransformers, useAlerts, useTransformerStats } from "@/hooks/use-transformers";
import { format } from "date-fns";
import { Download, FileText, BarChart3, MapPin, AlertTriangle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ReportsView() {
  const [reportType, setReportType] = useState<string>("summary");
  const [timeRange, setTimeRange] = useState<string>("monthly");
  const { data: transformers = [] } = useTransformers();
  const { data: alerts = [] } = useAlerts();
  const { data: stats } = useTransformerStats();
  const { toast } = useToast();

  const handleGenerateReport = (type: string) => {
    toast({
      title: "Report Generated",
      description: `${type} report is being prepared for download.`,
    });
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Download Ready",
        description: "Your report has been generated successfully.",
      });
    }, 2000);
  };

  const reports = [
    {
      id: "executive-summary",
      title: "Executive Summary",
      description: "High-level overview of transformer fleet health and performance",
      icon: BarChart3,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      metrics: ["Fleet Health Score", "Critical Issues", "Performance Trends"],
    },
    {
      id: "condition-assessment",
      title: "Condition Assessment Report",
      description: "Detailed analysis of transformer physical conditions",
      icon: FileText,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      metrics: ["Condition Distribution", "Risk Assessment", "Maintenance Needs"],
    },
    {
      id: "alert-analysis",
      title: "Alert & Incident Report",
      description: "Comprehensive analysis of alerts and critical incidents",
      icon: AlertTriangle,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      metrics: ["Alert Trends", "Response Times", "Resolution Status"],
    },
    {
      id: "geographic",
      title: "Geographic Distribution",
      description: "Spatial analysis of transformer deployment in East Legon",
      icon: MapPin,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      metrics: ["Coverage Maps", "Geographic Hotspots", "Service Areas"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-ecg-blue" />
            <span>Generate Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Executive Summary</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="maintenance">Maintenance Report</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Time Range
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Last 7 Days</SelectItem>
                  <SelectItem value="monthly">Last 30 Days</SelectItem>
                  <SelectItem value="quarterly">Last 90 Days</SelectItem>
                  <SelectItem value="yearly">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => handleGenerateReport(`${reportType} (${timeRange})`)}
              className="bg-ecg-blue hover:bg-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className={`${report.color} border-2`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Icon className={`h-5 w-5 ${report.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600 font-normal">{report.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
                    <div className="space-y-1">
                      {report.metrics.map((metric, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReport(report.title)}
                    className="w-full"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Generate {report.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-ecg-green" />
            <span>Current Data Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{transformers.length}</p>
              <p className="text-sm text-blue-600">Total Transformers</p>
              <p className="text-xs text-gray-500">In East Legon area</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{stats?.good || 0}</p>
              <p className="text-sm text-green-600">Good Condition</p>
              <p className="text-xs text-gray-500">Operational units</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-700">
                {alerts.filter(a => !a.isResolved).length}
              </p>
              <p className="text-sm text-orange-600">Active Alerts</p>
              <p className="text-xs text-gray-500">Require attention</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-700">
                {alerts.filter(a => a.severity === 'critical' && !a.isResolved).length}
              </p>
              <p className="text-sm text-red-600">Critical Issues</p>
              <p className="text-xs text-gray-500">Immediate action needed</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Data Collection Period</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Assessment data from ArcGIS FieldMaps</p>
              <p>• Real-time synchronization every 5 minutes</p>
              <p>• Last updated: {format(new Date(), 'PPP p')}</p>
              <p>• Coverage: East Legon service area</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Executive Summary - Monthly", date: "2 days ago", status: "Ready" },
              { name: "Condition Assessment - Weekly", date: "5 days ago", status: "Ready" },
              { name: "Alert Analysis - Quarterly", date: "1 week ago", status: "Ready" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500">Generated {report.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}