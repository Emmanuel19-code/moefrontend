import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TransformerStats } from "@/lib/types";
import { Alert,Transformer } from "@/shared/schema";

function toCamelCaseTransformer(raw: any): Transformer {
  return {
    id: raw.id,
    objectId: raw.object_id,
    globalId: raw.global_id,
    transformerId: raw.transformer_id,
    latitude: raw.latitude,
    longitude: raw.longitude,
    location: raw.location,
    address: raw.address,
    physicalCondition: raw.physical_condition,
    oilLeakage: raw.oil_leakage,
    overheatingSigns: raw.overheating_signs,
    rustCorrosion: raw.rust_corrosion,
    supportStructureType: raw.support_structure_type,
    supportStructureCondition: raw.support_structure_condition,
    safetySignagePresent: raw.safety_signage_present,
    coolingFinsPresent: raw.cooling_fins_present,
    coolingFinsState: raw.cooling_fins_state,
    clearanceFromBuildings: raw.clearance_from_buildings,
    bushingsCondition: raw.bushings_condition,
    insulatorsCondition: raw.insulators_condition,
    externalDamage: raw.external_damage,
    accessibilityIssues: raw.accessibility_issues,
    manufacturer: raw.manufacturer,
    capacity: raw.capacity,
    type: raw.type,
    assessmentDate: raw.assessment_date,
    creationDate: raw.creation_date,
    lastUpdateDate: raw.last_update_date,
    unauthorizedConnections: raw.unauthorized_connections,
  };
}

export function useTransformers() {
  return useQuery<Transformer[]>({
    queryKey: ["/api/transformers"],
    queryFn: async () => {
      const res = await fetch("/api/transformers");
      const data = await res.json();
      return data.map(toCamelCaseTransformer);
    }
  });
}

export function useTransformer(id: number) {
  return useQuery<Transformer>({
    queryKey: ["/api/transformers", id],
    enabled: !!id,
  });
}

export function useTransformerAlerts(transformerId: number) {
  return useQuery<Alert[]>({
    queryKey: ["/api/transformers", transformerId, "alerts"],
    enabled: !!transformerId,
  });
}

export function useAlerts() {
  return useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });
}

export function useTransformerStats() {
  return useQuery<TransformerStats>({
    queryKey: ["/api/statistics"],
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertId: number) => {
      const response = await apiRequest("PATCH", `/api/alerts/${alertId}/resolve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transformers"] });
    },
  });
}

export function useSyncData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/sync");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transformers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
  });
}
