/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransformer, useTransformerAlerts } from "@/hooks/use-transformers";
import { formatDistanceToNow } from "date-fns";
import {
  Edit,
  Calendar,
  Download,
  MapPin,
  Zap,
} from "lucide-react";

interface TransformerDetailModalProps {
  transformerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransformerDetailModal({
  transformerId,
  open,
  onOpenChange,
}: TransformerDetailModalProps) {
  const { data: transformer, isLoading } = useTransformer(transformerId || 0);
  console.log("this is transformer",transformer)
  const { data: alerts = [] } = useTransformerAlerts(transformerId || 0);
  if (!transformerId) console.log(`could not find ${transformerId}`);
  const transformerAlert = alerts.find((alert) => alert.id === transformerId);
  const transformerDetail = transformer?.find(
    (transformerDetail: any) => transformerDetail.id === transformerId
  );
  console.log(transformerDetail)
  const getConditionBadge = (condition: string | null ) => {
    if (!condition) return <Badge variant="secondary">Unknown</Badge>;

    switch (condition.toLowerCase()) {
      case "good":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Good
          </Badge>
        );
      case "fair":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Fair
          </Badge>
        );
      case "poor":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Poor
          </Badge>
        );
      default:
        return <Badge variant="secondary">{condition}</Badge>;
    }
  };

  const getBooleanBadge = (
    value: boolean | null | undefined,
    trueLabel = "Yes",
    falseLabel = "No"
  ) => {
    if (value === null) return <Badge variant="secondary">Unknown</Badge>;

    return (
      <Badge
        className={
          value
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-ecg-blue" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {transformerDetail?.transformerId ||
                  `Transformer ${transformerId}`}
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                {transformerDetail?.location ||
                  transformerDetail?.address ||
                  "Location not specified"}
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
          <div
            className="overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "calc(90vh - 120px)" }}
          >
            <div className="p-6 space-y-6">
              {/* Active Alerts */}
              {/*alerts.filter((a) => !a.isResolved).length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Active Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {alerts
                      .filter((a) => !a.isResolved)
                      .map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-red-700">{alert.message}</span>
                          <Badge variant="destructive" className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )*/}
             

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transformer ID:</span>
                      <span className="font-medium">
                        {transformerDetail?.transformerId || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {transformerDetail?.type || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">
                        {transformerDetail?.capacity || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Manufacturer:</span>
                      <span className="font-medium">
                        {transformerDetail?.manufacturer || "Not specified"}
                      </span>
                    </div>
                    {transformerDetail?.latitude &&
                      transformerDetail?.longitude && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Coordinates:</span>
                          <span className="font-medium text-xs">
                            {transformerDetail?.latitude.toFixed(4)}°N,{" "}
                            {transformerDetail?.longitude.toFixed(4)}°W
                          </span>
                        </div>
                      )}
                  </CardContent>
                </Card>

                {/* Physical Condition */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Physical Condition
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Overall Condition:</span>
                      {getConditionBadge(`${transformerDetail?.physicalCondition}`)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Oil Leakage:</span>
                      {getBooleanBadge(transformerDetail?.oilLeakage)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Rust/Corrosion:</span>
                      {getBooleanBadge(transformerDetail?.rustCorrosion)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">External Damage:</span>
                      {getBooleanBadge(transformerDetail?.externalDamage)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Overheating Signs:</span>
                      {getBooleanBadge(transformerDetail?.overheatingSigns)}
                    </div>
                  </CardContent>
                </Card>

                {/* Safety & Accessibility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Safety & Accessibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Safety Signage:</span>
                      {getBooleanBadge(
                        transformerDetail?.safetySignagePresent,
                        "Present",
                        "Missing"
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Clearance from Buildings:
                      </span>
                      <span className="font-medium">
                        {transformerDetail?.clearanceFromBuildings ||
                          "Not assessed"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Accessibility Issues:
                      </span>
                      {getBooleanBadge(transformerDetail?.accessibilityIssues)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Unauthorized Connections:
                      </span>
                      {getBooleanBadge(
                        transformerDetail?.unauthorizedConnections
                      )}
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
                        {transformerDetail?.supportStructureType ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Structure Condition:
                      </span>
                      {getConditionBadge(
                        `${transformerDetail?.supportStructureCondition}`
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bushings Condition:</span>
                      <span className="font-medium">
                        {transformerDetail?.bushingsCondition || "Not assessed"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Insulators Condition:
                      </span>
                      <span className="font-medium">
                        {transformerDetail?.insulatorsCondition ||
                          "Not assessed"}
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
                    {transformerDetail?.assessmentDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {transformerDetail?.assessmentDate
                            ? formatDistanceToNow(
                                new Date(transformerDetail?.assessmentDate),
                                { addSuffix: true }
                              )
                            : "Date not available"}
                        </span>
                        <span className="text-gray-900">
                          Field Assessment Completed
                        </span>
                      </div>
                    )}
                    {transformerDetail?.lastUpdateDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {transformerDetail?.lastUpdateDate
                            ? formatDistanceToNow(
                                new Date(transformerDetail?.lastUpdateDate),
                                { addSuffix: true }
                              )
                            : "Date not available"}
                        </span>
                        <span className="text-gray-900">Data Last Updated</span>
                      </div>
                    )}
                    {transformerDetail?.creationDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {transformerDetail?.creationDate
                            ? formatDistanceToNow(
                                new Date(transformerDetail?.creationDate),
                                { addSuffix: true }
                              )
                            : "Date not available"}
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
                {transformerDetail?.latitude && transformerDetail?.longitude && (
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
