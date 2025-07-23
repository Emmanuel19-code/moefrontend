export interface TransformerStats {
  total: number;
  good: number;
  fair: number;
  poor: number;
  critical: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FilterOptions {
  condition?: string[];
  hasAlerts?: boolean;
  type?: string[];
  manufacturer?: string[];
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  includeAlerts: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertType = 
  | 'oil_leakage'
  | 'overheating'
  | 'safety_signage'
  | 'unauthorized_connections'
  | 'poor_condition'
  | 'maintenance_due';

export interface TransformerMarker {
  id: number;
  position: [number, number];
  condition: string;
  hasAlerts: boolean;
  alertCount: number;
}
