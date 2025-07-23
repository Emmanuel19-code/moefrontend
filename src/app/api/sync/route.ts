import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// ArcGIS Feature Server URL
const ARCGIS_FEATURE_SERVER_URL =
  'https://services1.arcgis.com/p8I1YAb5VvsDj1Sf/arcgis/rest/services/Transformer_Mapping_and_Condition_Assessment/FeatureServer/0/query'

interface ArcGISFeature {
  attributes: {
    OBJECTID: number;
    GlobalID: string;
    esrignss_latitude?: number;
    esrignss_longitude?: number;
    Location?: string;
    Address_If_Possible?: string;
    Transformer_ID?: string;
    Type_of_Transformer?: string;
    Capacity_If_visible?: string;
    Manufacturer_Name?: string;
    Physical_Condition_of_the_Trans?: string;
    Oil_Leakage_Visible?: string;
    Rust_or_Corrosion_on_the_Body?: string;
    External_Damage_eg_dents_cracks?: string;
    Signs_of_Overheating_eg_discolo?: string;
    Condition_of_Bushings?: string;
    Condition_of_Insulators?: string;
    Presence_of_Cooling_Fins?: string;
    State_of_Cooling_Fins?: string;
    Type_of_Support_Structure?: string;
    Condition_of_Support_Structure?: string;
    Safety_Signage_Present?: string;
    Clearance_from_Buildings?: string;
    Accessibility_Issues_eg_overgro?: string;
    Presence_of_Unauthorized_Connec?: string;
    Date_and_Time?: number;
    CreationDate?: number;
    EditDate?: number;
  };
  geometry?: {
    x: number;
    y: number;
  };
}

export async function POST() {
  try {
    console.log('🔄 Starting ArcGIS data sync...');

    const arcgisResponse = await fetch(
      `${ARCGIS_FEATURE_SERVER_URL}?where=1%3D1&outFields=*&outSR=4326&f=json`
    );

    if (!arcgisResponse.ok) {
      console.log(`❌ ArcGIS API error: ${arcgisResponse.status}`);
      throw new Error(`ArcGIS API error: ${arcgisResponse.status}`);
    }

    const data = await arcgisResponse.json();
    console.log('📦 ArcGIS data received:', { count: data.features?.length });

    if (!data.features || data.features.length === 0) {
      return NextResponse.json({ message: 'No data found from ArcGIS' });
    }

    let syncedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;

    for (const feature of data.features) {
      const transformerData = convertArcGISToTransformer(feature);

      // Check if transformer already exists
      const { data: existingTransformer } = await supabase
        .from('transformers')
        .select('id')
        .eq('object_id', transformerData.object_id)
        .single();

      if (existingTransformer) {
        const { error } = await supabase
          .from('transformers')
          .update(transformerData)
          .eq('object_id', transformerData.object_id);

        if (error) {
          console.error('⚠️ Update error:', error);
        } else {
          updatedCount++;
        }
      } else {
        const { data: newTransformer, error } = await supabase
          .from('transformers')
          .insert(transformerData)
          .select()
          .single();

        if (error) {
          console.error('⚠️ Insert error:', error);
          continue;
        }

        createdCount++;

        const alerts = generateAlertsFromTransformer(newTransformer, transformerData);
        for (const alert of alerts) {
          const { error: alertError } = await supabase.from('alerts').insert(alert);
          if (alertError) {
            console.error('⚠️ Alert insert error:', alertError);
          }
        }
      }

      syncedCount++;
    }

    console.log(`✅ Sync completed: ${syncedCount} processed, ${createdCount} created, ${updatedCount} updated`);

    return NextResponse.json({
      message: 'Data synchronized successfully',
      processed: syncedCount,
      created: createdCount,
      updated: updatedCount,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('❌ Error syncing data:', error);
    return NextResponse.json(
      { error: 'Failed to sync data', details: error.message },
      { status: 500 }
    );
  }
}

function convertArcGISToTransformer(feature: ArcGISFeature) {
  const attrs = feature.attributes;

  return {
    object_id: attrs.OBJECTID,
    global_id: attrs.GlobalID,
    latitude: attrs.esrignss_latitude || feature.geometry?.y || null,
    longitude: attrs.esrignss_longitude || feature.geometry?.x || null,
    location: attrs.Location || null,
    address: attrs.Address_If_Possible || null,
    transformer_id: attrs.Transformer_ID || null,
    type: attrs.Type_of_Transformer || null,
    capacity: attrs.Capacity_If_visible || null,
    manufacturer: attrs.Manufacturer_Name || null,
    physical_condition: attrs.Physical_Condition_of_the_Trans || null,
    oil_leakage: attrs.Oil_Leakage_Visible?.toLowerCase() === 'yes',
    rust_corrosion: attrs.Rust_or_Corrosion_on_the_Body?.toLowerCase() === 'yes',
    external_damage: attrs.External_Damage_eg_dents_cracks?.toLowerCase() === 'yes',
    overheating_signs: attrs.Signs_of_Overheating_eg_discolo?.toLowerCase() === 'yes',
    bushings_condition: attrs.Condition_of_Bushings || null,
    insulators_condition: attrs.Condition_of_Insulators || null,
    cooling_fins_present: attrs.Presence_of_Cooling_Fins?.toLowerCase() === 'yes',
    cooling_fins_state: attrs.State_of_Cooling_Fins || null,
    support_structure_type: attrs.Type_of_Support_Structure || null,
    support_structure_condition: attrs.Condition_of_Support_Structure || null,
    safety_signage_present: attrs.Safety_Signage_Present?.toLowerCase() === 'yes',
    clearance_from_buildings: attrs.Clearance_from_Buildings || null,
    accessibility_issues: attrs.Accessibility_Issues_eg_overgro?.toLowerCase() === 'yes',
    unauthorized_connections: attrs.Presence_of_Unauthorized_Connec?.toLowerCase() === 'yes',
    creation_date: attrs.CreationDate ? new Date(attrs.CreationDate) : null,
    last_update_date: attrs.EditDate ? new Date(attrs.EditDate) : null,
    assessment_date: attrs.Date_and_Time ? new Date(attrs.Date_and_Time) : null,
  };
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateAlertsFromTransformer(transformer: any, data: any) {
  const alerts = [];

  // Oil leakage alert (boolean check)
  if (data.oil_leakage === true) {
    alerts.push({
      transformer_id: transformer.id,
      type: 'oil_leakage',
      severity: 'critical',
      message: `Oil leakage detected at transformer ${transformer.transformer_id || transformer.id}`,
      is_resolved: false,
    });
  }

  // Overheating alert
  if (data.overheating_signs === true) {
    alerts.push({
      transformer_id: transformer.id,
      type: 'overheating',
      severity: 'critical',
      message: `Signs of overheating detected at transformer ${transformer.transformer_id || transformer.id}`,
      is_resolved: false,
    });
  }

  // Safety signage alert (boolean, check for false)
  if (data.safety_signage_present === false) {
    alerts.push({
      transformer_id: transformer.id,
      type: 'safety_signage',
      severity: 'warning',
      message: `Safety signage missing at transformer ${transformer.transformer_id || transformer.id}`,
      is_resolved: false,
    });
  }

  // Unauthorized connections alert
  if (data.unauthorized_connections === true) {
    alerts.push({
      transformer_id: transformer.id,
      type: 'unauthorized_connections',
      severity: 'critical',
      message: `Unauthorized connections detected at transformer ${transformer.transformer_id || transformer.id}`,
      is_resolved: false,
    });
  }

  // Poor physical condition alert (still a string)
  if (
    data.physical_condition === 'poor' ||
    data.physical_condition === 'very poor'
  ) {
    alerts.push({
      transformer_id: transformer.id,
      type: 'poor_condition',
      severity: data.physical_condition === 'very poor' ? 'critical' : 'warning',
      message: `Transformer ${transformer.transformer_id || transformer.id} is in ${data.physical_condition} condition`,
      is_resolved: false,
    });
  }

  return alerts;
}
