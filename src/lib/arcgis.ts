// lib/arcgis.ts
import type { InsertTransformer, InsertAlert, Transformer } from "@/lib/schema";

const ARCGIS_FEATURE_SERVER_URL =
  "https://services1.arcgis.com/p8I1YAb5VvsDj1Sf/ArcGIS/rest/services/Transformer_Mapping_and_Condition_Assessment/FeatureServer/0";

export const arcgisService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetchAllTransformers(): Promise<{ features: any[] }> {
    const url = `${ARCGIS_FEATURE_SERVER_URL}/query?where=1%3D1&outFields=*&outSR=4326&f=json`;
    const response = await fetch(url);
    console.log(response);
    
    if (!response.ok) throw new Error("Failed to fetch ArcGIS data");
    return response.json();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertArcGISToTransformer(feature: any): InsertTransformer {
    const attrs = feature.attributes;

    return {
      objectId: attrs.OBJECTID,
      globalId: attrs.GlobalID,
      transformerId: attrs.Transformer_ID || null,
      latitude: feature.geometry?.y || attrs.esrignss_latitude || null,
      longitude: feature.geometry?.x || attrs.esrignss_longitude || null,
      location: attrs.Location || null,
      address: attrs.Address_If_Possible || null,
      type: attrs.Type_of_Transformer || null,
      capacity: attrs.Capacity_If_visible || null,
      manufacturer: attrs.Manufacturer_Name || null,
      physicalCondition: attrs.Physical_Condition_of_the_Trans || null,
      oilLeakage: attrs.Oil_Leakage_Visible === "Yes",
      rustCorrosion: attrs.Rust_or_Corrosion_on_the_Body === "Yes",
      externalDamage: attrs.External_Damage_eg_dents_cracks === "Yes",
      overheatingSigns: attrs.Signs_of_Overheating_eg_discolo === "Yes",
      bushingsCondition: attrs.Condition_of_Bushings || null,
      insulatorsCondition: attrs.Condition_of_Insulators || null,
      coolingFinsPresent: attrs.Presence_of_Cooling_Fins === "Yes",
      coolingFinsState: attrs.State_of_Cooling_Fins || null,
      supportStructureType: attrs.Type_of_Support_Structure || null,
      supportStructureCondition: attrs.Condition_of_Support_Structure || null,
      safetySignagePresent: attrs.Safety_Signage_Present === "Yes",
      clearanceFromBuildings: attrs.Clearance_from_Buildings || null,
      accessibilityIssues: attrs.Accessibility_Issues_eg_overgro === "Yes",
      unauthorizedConnections: attrs.Presence_of_Unauthorized_Connec === "Yes",
      assessmentDate: attrs.Date_and_Time ? new Date(attrs.Date_and_Time) : null,
      creationDate: attrs.CreationDate ? new Date(attrs.CreationDate) : null,
      lastUpdateDate: attrs.EditDate ? new Date(attrs.EditDate) : null,
    };
  },

  generateAlertsFromTransformer(transformer: Transformer): InsertAlert[] {
    const alerts: InsertAlert[] = [];

    if (transformer.oilLeakage)
      alerts.push({ transformerId: transformer.id, type: "oil_leakage", severity: "critical", message: "Oil leakage detected", isResolved: false });

    if (transformer.overheatingSigns)
      alerts.push({ transformerId: transformer.id, type: "overheating", severity: "warning", message: "Signs of overheating", isResolved: false });

    if (!transformer.safetySignagePresent)
      alerts.push({ transformerId: transformer.id, type: "safety_signage", severity: "warning", message: "Missing safety signage", isResolved: false });

    if (transformer.unauthorizedConnections)
      alerts.push({ transformerId: transformer.id, type: "unauthorized_connections", severity: "critical", message: "Unauthorized connections", isResolved: false });

    if (transformer.physicalCondition === "Poor")
      alerts.push({ transformerId: transformer.id, type: "poor_condition", severity: "critical", message: "Poor condition detected", isResolved: false });

    return alerts;
  },
};
