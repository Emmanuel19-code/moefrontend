import { storage } from "@/lib/storage";
import { arcgisService } from "@/lib/arcgis";

export async function syncDataFromArcGIS() {
  const response = await arcgisService.fetchAllTransformers();
  for (const feature of response.features) {
    const transformerData = arcgisService.convertArcGISToTransformer(feature);
    const existing = await storage.getTransformerByObjectId(transformerData.objectId!);

    let transformer;
    if (existing) {
      transformer = await storage.updateTransformer(existing.id, transformerData);
    } else {
      transformer = await storage.createTransformer(transformerData);
    }
    if (transformer) {
      const alerts = arcgisService.generateAlertsFromTransformer(transformer);
      const existingAlerts = await storage.getAlertsByTransformerId(transformer.id);
      for (const alertData of alerts) {
        const alertExists = existingAlerts.some(
          (a) => a.type === alertData.type && !a.isResolved
        );
        if (!alertExists) {
          await storage.createAlert(alertData);
        }
      }
    }
  }
}