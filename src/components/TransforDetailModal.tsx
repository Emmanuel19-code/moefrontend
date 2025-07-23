import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransformer, useTransformerAlerts } from "@/hooks/use-transformers";
import { formatDistanceToNow } from "date-fns";
import { Edit, Calendar, Download, MapPin, Zap, AlertTriangle } from "lucide-react";

interface TransformerDetailModalProps {
  transformerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransformerDetailModal({ 
  transformerId, 
  open, 
  onOpenChange 
}: TransformerDetailModalProps) {
  const { data: transformer, isLoading } = useTransformer(transformerId || 0);
  const { data: alerts = [] } = useTransformerAlerts(transformerId || 0);
  console.log(`transformer ${transformerId}`,transformer)
  console.log("alerts ",alerts)
  if (!transformerId) return null;

  const getConditionBadge = (condition: string | null) => {
    if (!condition) return <Badge variant="secondary">Unknown</Badge>;
    
    switch (condition.toLowerCase()) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Good</Badge>;
      case 'fair':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Poor</Badge>;
      default:
        return <Badge variant="secondary">{condition}</Badge>;
    }
  };

  const getBooleanBadge = (value: boolean | null, trueLabel = "Yes", falseLabel = "No") => {
    if (value === null) return <Badge variant="secondary">Unknown</Badge>;
    
    return (
      <Badge 
        className={value 
          ? "bg-red-100 text-red-800 hover:bg-red-100" 
          : "bg-green-100 text-green-800 hover:bg-green-100"
        }
      >
        {value ? trueLabel : falseLabel}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-ecg-blue" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {transformer?.transformerId || `Transformer ${transformerId}`}
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                {transformer?.location || transformer?.address || 'Location not specified'}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : transformer ? (
          <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 120px)' }}>
            <div className="p-6 space-y-6">
              {/* Active Alerts */}
              {alerts.filter(a => !a.isResolved).length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Active Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {alerts.filter(a => !a.isResolved).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between text-sm">
                        <span className="text-red-700">{alert.message}</span>
                        <Badge variant="destructive" className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transformer ID:</span>
                      <span className="font-medium">{transformer.transformerId || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{transformer.type || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{transformer.capacity || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Manufacturer:</span>
                      <span className="font-medium">{transformer.manufacturer || 'Not specified'}</span>
                    </div>
                    {(transformer.latitude && transformer.longitude) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Coordinates:</span>
                        <span className="font-medium text-xs">
                          {transformer.latitude.toFixed(4)}°N, {transformer.longitude.toFixed(4)}°W
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Physical Condition */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Physical Condition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overall Condition:</span>
                      {getConditionBadge(transformer.physicalCondition)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Oil Leakage:</span>
                      {getBooleanBadge(transformer.oilLeakage)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rust/Corrosion:</span>
                      {getBooleanBadge(transformer.rustCorrosion)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">External Damage:</span>
                      {getBooleanBadge(transformer.externalDamage)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overheating Signs:</span>
                      {getBooleanBadge(transformer.overheatingSigns)}
                    </div>
                  </CardContent>
                </Card>

                {/* Safety & Accessibility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Safety & Accessibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Safety Signage:</span>
                      {getBooleanBadge(transformer.safetySignagePresent, "Present", "Missing")}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Clearance from Buildings:</span>
                      <span className="font-medium">
                        {transformer.clearanceFromBuildings || 'Not assessed'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Accessibility Issues:</span>
                      {getBooleanBadge(transformer.accessibilityIssues)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Unauthorized Connections:</span>
                      {getBooleanBadge(transformer.unauthorizedConnections)}
                    </div>
                  </CardContent>
                </Card>

                {/* Support Structure */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Support Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Structure Type:</span>
                      <span className="font-medium">
                        {transformer.supportStructureType || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Structure Condition:</span>
                      {getConditionBadge(transformer.supportStructureCondition)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bushings Condition:</span>
                      <span className="font-medium">
                        {transformer.bushingsCondition || 'Not assessed'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Insulators Condition:</span>
                      <span className="font-medium">
                        {transformer.insulatorsCondition || 'Not assessed'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Assessment History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {transformer.assessmentDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {transformer.assessmentDate 
                            ? formatDistanceToNow(new Date(transformer.assessmentDate), { addSuffix: true })
                            : 'Date not available'
                          }
                        </span>
                        <span className="text-gray-900">Field Assessment Completed</span>
                      </div>
                    )}
                    {transformer.lastUpdateDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {transformer.lastUpdateDate 
                            ? formatDistanceToNow(new Date(transformer.lastUpdateDate), { addSuffix: true })
                            : 'Date not available'  
                          }
                        </span>
                        <span className="text-gray-900">Data Last Updated</span>
                      </div>
                    )}
                    {transformer.creationDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {transformer.creationDate 
                            ? formatDistanceToNow(new Date(transformer.creationDate), { addSuffix: true })
                            : 'Date not available'
                          }
                        </span>
                        <span className="text-gray-900">Record Created</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button className="bg-ecg-blue hover:bg-blue-700">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Assessment
                </Button>
                <Button className="bg-ecg-green hover:bg-green-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                {transformer.latitude && transformer.longitude && (
                  <Button variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">Transformer not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
