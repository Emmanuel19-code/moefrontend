"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Transformer = {
  id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  feeder: string;
  capacity: string;
  baseQty: number;
  baseUoM: string;
};

interface Props {
  transformers: Transformer[];
}

const TransformerMap = ({ transformers }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Fix Leaflet default icon path issue inside useEffect
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
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    }
  }, []);

  // Map auto-fitter
  const FitBounds = () => {
    const map = useMap();
    useEffect(() => {
      if (transformers.length > 0) {
        const bounds = L.latLngBounds(
          transformers.map((t) => [
            t.location.coordinates[1],
            t.location.coordinates[0],
          ])
        );
        map.fitBounds(bounds);
      }
    }, [transformers, map]);
    return null;
  };

  return (
    <MapContainer
      center={[7.9465, -1.0232]} // default center (Ghana)
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds />
      {transformers.map((transformer) => (
        <Marker
          key={transformer.id}
          position={[
            transformer.location.coordinates[1],
            transformer.location.coordinates[0],
          ]}
        >
          <Popup>
            <strong>{transformer.name}</strong>
            <br />
            Feeder: {transformer.feeder}
            <br />
            Capacity: {transformer.capacity}
            <br />
            Base Qty: {transformer.baseQty}
            <br />
            Base UoM: {transformer.baseUoM}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TransformerMap;
