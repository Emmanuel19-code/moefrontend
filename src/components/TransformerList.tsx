import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTransformers } from "@/hooks/use-transformers";
import { formatDistanceToNow } from "date-fns";
import { Search,  MapPin, Eye, Download, RefreshCw } from "lucide-react";


interface TransformerListProps {
  onTransformerSelect?: (transformerId: number) => void;
}

export function TransformerList({ onTransformerSelect }: TransformerListProps) {
  const { data: transformers = [], isLoading, refetch } = useTransformers();
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const filteredTransformers = transformers.filter(transformer => {
    const matchesSearch = !searchQuery || 
      transformer.transformerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transformer.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transformer.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCondition = conditionFilter === "all" || 
      transformer.physicalCondition?.toLowerCase() === conditionFilter.toLowerCase();
    
    const matchesType = typeFilter === "all" || 
      transformer.type?.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesCondition && matchesType;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = (transformerId: number) => {
    if (onTransformerSelect) {
      onTransformerSelect(transformerId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transformer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transformer Registry</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredTransformers.length} of {transformers.length} transformers
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs"
            >
              <RefreshCw className={`mr-1 h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" className="text-xs bg-ecg-blue hover:bg-blue-700">
              <Download className="mr-1 h-3 w-3" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by ID, location, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pole-mounted">Pole-mounted</SelectItem>
                <SelectItem value="ground-mounted">Ground-mounted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Transformer ID</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Condition</TableHead>
                <TableHead className="font-semibold">Capacity</TableHead>
                <TableHead className="font-semibold">Last Assessment</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransformers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery || conditionFilter !== "all" || typeFilter !== "all" 
                      ? "No transformers match your filters" 
                      : "No transformers found"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransformers.map((transformer) => (
                  <TableRow key={transformer.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {transformer.transformerId || `T-${transformer.id}`}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{transformer.location || transformer.address || 'Not specified'}</p>
                        {transformer.latitude && transformer.longitude && (
                          <p className="text-xs text-gray-500">
                            {transformer.latitude.toFixed(4)}°N, {transformer.longitude.toFixed(4)}°W
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {transformer.type || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getConditionBadge(transformer.physicalCondition)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {transformer.capacity || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {transformer.assessmentDate 
                          ? formatDistanceToNow(new Date(transformer.assessmentDate), { addSuffix: true })
                          : 'No assessment'
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(transformer.id)}
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        {transformer.latitude && transformer.longitude && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs"
                          >
                            <MapPin className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        {filteredTransformers.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-lg font-semibold text-green-700">
                {filteredTransformers.filter(t => t.physicalCondition === 'Good').length}
              </p>
              <p className="text-xs text-green-600">Good Condition</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <p className="text-lg font-semibold text-orange-700">
                {filteredTransformers.filter(t => t.physicalCondition === 'Fair').length}
              </p>
              <p className="text-xs text-orange-600">Fair Condition</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <p className="text-lg font-semibold text-red-700">
                {filteredTransformers.filter(t => t.physicalCondition === 'Poor').length}
              </p>
              <p className="text-xs text-red-600">Poor Condition</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-lg font-semibold text-blue-700">
                {filteredTransformers.filter(t => 
                  t.oilLeakage || t.overheatingSigns || t.unauthorizedConnections
                ).length}
              </p>
              <p className="text-xs text-blue-600">Critical Issues</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}