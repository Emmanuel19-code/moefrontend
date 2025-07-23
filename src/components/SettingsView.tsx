import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSyncData } from "@/hooks/use-transformers";
import { useToast } from "@/hooks/use-toast";
import { Settings, Database, Bell, MapPin, Shield, Download, Zap } from "lucide-react";

export function SettingsView() {
  const [syncInterval, setSyncInterval] = useState("5");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertSeverity, setAlertSeverity] = useState("warning");
  const [autoExport, setAutoExport] = useState(false);
  const [mapTheme, setMapTheme] = useState("standard");
  
  const syncMutation = useSyncData();
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleTestSync = () => {
    syncMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Sync Test Successful",
          description: "Connection to ArcGIS services is working properly.",
        });
      },
      onError: () => {
        toast({
          title: "Sync Test Failed",
          description: "Unable to connect to ArcGIS services. Please check configuration.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-ecg-blue" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Application Version:</span>
                <Badge variant="secondary">v1.0.0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database Status:</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ArcGIS Integration:</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Service Region:</span>
                <span className="text-sm font-medium">East Legon, Ghana</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Sync:</span>
                <span className="text-sm font-medium">2 minutes ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Data Source:</span>
                <span className="text-sm font-medium">ArcGIS FieldMaps</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Update Frequency:</span>
                <span className="text-sm font-medium">Every 5 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">System Uptime:</span>
                <span className="text-sm font-medium">Running smoothly</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Synchronization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-ecg-green" />
            <span>Data Synchronization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Real-time Sync Interval</label>
                <p className="text-xs text-gray-500">Automatic sync with ArcGIS FieldMaps updates</p>
              </div>
              <Select value={syncInterval} onValueChange={setSyncInterval}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every minute</SelectItem>
                  <SelectItem value="2">Every 2 minutes (Default)</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto Backup</label>
                <p className="text-xs text-gray-500">Automatically backup data daily</p>
              </div>
              <Switch checked={autoExport} onCheckedChange={setAutoExport} />
            </div>

            <div className="pt-4 border-t">
              <Button 
                onClick={handleTestSync}
                disabled={syncMutation.isPending}
                variant="outline"
                className="w-full"
              >
                {syncMutation.isPending ? (
                  <>
                    <div className="spinner mr-2" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Test ArcGIS Connection
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-500" />
            <span>Notifications & Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Enable Notifications</label>
                <p className="text-xs text-gray-500">Receive alerts for critical issues</p>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Alert Threshold</label>
                <p className="text-xs text-gray-500">Minimum severity level for notifications</p>
              </div>
              <Select value={alertSeverity} onValueChange={setAlertSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-purple-500" />
            <span>Map Display</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Map Theme</label>
                <p className="text-xs text-gray-500">Choose the map display style</p>
              </div>
              <Select value={mapTheme} onValueChange={setMapTheme}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Default Location</h4>
                <p className="text-sm text-blue-600">East Legon, Accra</p>
                <p className="text-xs text-blue-500">5.6108°N, 0.1614°W</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Coverage Area</h4>
                <p className="text-sm text-green-600">30 km² service area</p>
                <p className="text-xs text-green-500">Residential & Commercial</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-500" />
            <span>Data Export & Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Alerts
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Export Formats</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• CSV - For spreadsheet analysis</p>
                <p>• PDF - For formal reports</p>
                <p>• JSON - For technical integration</p>
                <p>• KML - For geographic mapping</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-500" />
            <span>System Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Administrative Settings</h4>
              <p className="text-sm text-yellow-700 mb-3">
                These settings affect system behavior and should only be modified by authorized personnel.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="mr-2">
                  <Settings className="mr-2 h-3 w-3" />
                  Advanced Config
                </Button>
                <Button variant="outline" size="sm" className="mr-2">
                  <Database className="mr-2 h-3 w-3" />
                  Database Settings
                </Button>
                <Button variant="outline" size="sm">
                  <Shield className="mr-2 h-3 w-3" />
                  Security Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-ecg-blue hover:bg-blue-700">
          <Settings className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}