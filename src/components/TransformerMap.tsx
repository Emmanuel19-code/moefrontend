"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize2, Filter, Download } from "lucide-react";
import { useTransformers } from "@/hooks/use-transformers";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet
//delete (L.Icon.Default.prototype as unknown)._getIconUrl;
//L.Icon.Default.mergeOptions({
//  iconRetinaUrl:
//    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNEQzI2MjYiLz4KPHBhdGggZD0iTTEyLjUgNDBMMTAuNTk0NiAzMS4wODExSDEyLjVIMTQuNDA1NEwxMi41IDQwWiIgZmlsbD0iI0RDMjYyNiIvPgo8cGF0aCBkPSJNMTIuNSAzMUMxNi42NDIxIDMxIDIwIDI3LjY0MjEgMjAgMjMuNUMyMCAxOS4zNTc5IDE2LjY0MjEgMTYgMTIuNSAxNkM4LjM1Nzg2IDE2IDUgMTkuMzU3OSA1IDIzLjVDNSAyNy42NDIxIDguMzU3ODYgMzEgMTIuNSAzMVoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+",
//  iconUrl:
//    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNEQzI2MjYiLz4KPHBhdGggZD0iTTEyLjUgNDBMMTAuNTk0NiAzMS4wODExSDEyLjVIMTQuNDA1NEwxMi41IDQwWiIgZmlsbD0iI0RDMjYyNiIvPgo8cGF0aCBkPSJNMTIuNSAzMUMxNi42NDIxIDMxIDIwIDI3LjY0MjEgMjAgMjMuNUMyMCAxOS4zNTc5IDE2LjY0MjEgMTYgMTIuNSAxNkM4LjM1Nzg2IDE2IDUgMTkuMzU3OSA1IDIzLjVDNSAyNy42NDIxIDguMzU3ODYgMzEgMTIuNSAzMVoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+",
//  shadowUrl:
//    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIyMC41IiByeD0iMjAuNSIgcnk9IjIwLjUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4K",
//  iconSize: [25, 41],
//  iconAnchor: [12, 41],
//  popupAnchor: [1, -34],
//  shadowSize: [41, 41],
//});

interface TransformerMapProps {
  onTransformerSelect?: (transformerId: number) => void;
}

export function TransformerMap({ onTransformerSelect }: TransformerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { data: transformers = [], isLoading, refetch } = useTransformers();
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Ghana/East Legon coordinates
  const defaultCenter: [number, number] = [5.6108, -0.1614];
  const defaultZoom = 13;
   useEffect(() => {
    if (typeof window !== "undefined" && L?.Icon?.Default) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNEQzI2MjYiLz4KPHBhdGggZD0iTTEyLjUgNDBMMTAuNTk0NiAzMS4wODExSDEyLjVIMTQuNDA1NEwxMi41IDQwWiIgZmlsbD0iI0RDMjYyNiIvPgo8cGF0aCBkPSJNMTIuNSAzMUMxNi42NDIxIDMxIDIwIDI3LjY0MjEgMjAgMjMuNUMyMCAxOS4zNTc5IDE2LjY0MjEgMTYgMTIuNSAxNkM4LjM1Nzg2IDE2IDUgMTkuMzU3OSA1IDIzLjVDNSAyNy42NDIxIDguMzU3ODYgMzEgMTIuNSAzMVoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+",
        iconUrl:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNEQzI2MjYiLz4KPHBhdGggZD0iTTEyLjUgNDBMMTAuNTk0NiAzMS4wODExSDEyLjVIMTQuNDA1NEwxMi41IDQwWiIgZmlsbD0iI0RDMjYyNiIvPgo8cGF0aCBkPSJNMTIuNSAzMUMxNi42NDIxIDMxIDIwIDI3LjY0MjEgMjAgMjMuNUMyMCAxOS4zNTc5IDE2LjY0MjEgMTYgMTIuNSAxNkM4LjM1Nzg2IDE2IDUgMTkuMzU3OSA1IDIzLjVDNSAyNy42NDIxIDguMzU3ODYgMzEgMTIuNSAzMVoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+",
        shadowUrl:
           "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIyMC41IiByeD0iMjAuNSIgcnk9IjIwLjUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4K",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    }
  }, []);
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(defaultCenter, defaultZoom);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !transformers.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    transformers.forEach((transformer) => {
      if (!transformer.latitude || !transformer.longitude) return;
      const condition = transformer.physicalCondition|| "Unknown";
      let markerColor = "#6B7280"; // gray for unknown

      if (transformer.oilLeakage === true) {
        markerColor = "#FF0000"; // bright red for oil leakage
      } else {
        switch (condition.toLowerCase()) {
          case "good":
            markerColor = "#10B981"; // green
            break;
          case "fair":
            markerColor = "#F59E0B"; // orange
            break;
          case "poor":
            markerColor = "#EF4444"; // red
            break;
        }
      }

      // Create custom icon
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${markerColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([transformer.latitude, transformer.longitude], {
        icon: customIcon,
      });

      // Add popup
      const popupContent = `
        <div class="p-2">
          <h3 class="font-semibold text-sm">${
            transformer.transformerId || "Unknown ID"
          }</h3>
          <p class="text-xs text-gray-600">${
            transformer.location || "Location not specified"
          }</p>
          <p class="text-xs mt-1">
            <span class="font-medium">Condition:</span> 
            <span style="color: ${markerColor}">${condition}</span>
          </p>
          ${
            transformer.type
              ? `<p class="text-xs"><span class="font-medium">Type:</span> ${transformer.type}</p>`
              : ""
          }
          ${
            transformer.capacity
              ? `<p class="text-xs"><span class="font-medium">Capacity:</span> ${transformer.capacity}</p>`
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click handler
      marker.on("click", () => {
        if (onTransformerSelect) {
          
          onTransformerSelect(transformer.id);
        }
      });

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });

    // Fit bounds if we have transformers
    if (markersRef.current.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [transformers, onTransformerSelect]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Transformer Locations - East Legon
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Showing {transformers.length} transformers
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
              <RefreshCw
                className={`mr-1 h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Maximize2 className="mr-1 h-3 w-3" />
              Fullscreen
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Map Legend */}
        <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Good</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Fair</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Poor</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Unknown</span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            className="h-96 bg-gray-100 rounded-lg relative overflow-hidden z-0"
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-ecg-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="spinner" />
                </div>
                <p className="text-gray-600 mb-2">Loading Transformer Map</p>
                <p className="text-sm text-gray-500">East Legon Area</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              Showing <strong>{transformers.length} transformers</strong> in
              East Legon
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="text-xs">
              <Filter className="mr-1 h-3 w-3" />
              Filter
            </Button>
            <Button size="sm" className="text-xs bg-ecg-blue hover:bg-blue-700">
              <Download className="mr-1 h-3 w-3" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
