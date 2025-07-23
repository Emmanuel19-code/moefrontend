export interface Database {
  public: {
    Tables: {
      transformers: {
        Row: {
          id: number
          objectId: number
          globalId: string
          latitude: number | null
          longitude: number | null
          location: string | null
          address: string | null
          transformerId: string | null
          transformerType: string | null
          capacity: string | null
          manufacturer: string | null
          physicalCondition: string | null
          oilLeakage: string | null
          rustCorrosion: string | null
          externalDamage: string | null
          overheating: string | null
          bushingsCondition: string | null
          insulatorsCondition: string | null
          coolingFins: string | null
          coolingFinsState: string | null
          supportStructureType: string | null
          supportStructureCondition: string | null
          safetySignage: string | null
          clearanceFromBuildings: string | null
          accessibilityIssues: string | null
          unauthorizedConnections: string | null
          dateTime: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          objectId: number
          globalId: string
          latitude?: number | null
          longitude?: number | null
          location?: string | null
          address?: string | null
          transformerId?: string | null
          transformerType?: string | null
          capacity?: string | null
          manufacturer?: string | null
          physicalCondition?: string | null
          oilLeakage?: string | null
          rustCorrosion?: string | null
          externalDamage?: string | null
          overheating?: string | null
          bushingsCondition?: string | null
          insulatorsCondition?: string | null
          coolingFins?: string | null
          coolingFinsState?: string | null
          supportStructureType?: string | null
          supportStructureCondition?: string | null
          safetySignage?: string | null
          clearanceFromBuildings?: string | null
          accessibilityIssues?: string | null
          unauthorizedConnections?: string | null
          dateTime?: string | null
        }
        Update: {
          objectId?: number
          globalId?: string
          latitude?: number | null
          longitude?: number | null
          location?: string | null
          address?: string | null
          transformerId?: string | null
          transformerType?: string | null
          capacity?: string | null
          manufacturer?: string | null
          physicalCondition?: string | null
          oilLeakage?: string | null
          rustCorrosion?: string | null
          externalDamage?: string | null
          overheating?: string | null
          bushingsCondition?: string | null
          insulatorsCondition?: string | null
          coolingFins?: string | null
          coolingFinsState?: string | null
          supportStructureType?: string | null
          supportStructureCondition?: string | null
          safetySignage?: string | null
          clearanceFromBuildings?: string | null
          accessibilityIssues?: string | null
          unauthorizedConnections?: string | null
          dateTime?: string | null
        }
      }
      alerts: {
        Row: {
          id: number
          transformerId: number
          type: string
          severity: string
          title: string
          description: string
          resolved: boolean
          resolvedAt: string | null
          createdAt: string
        }
        Insert: {
          transformerId: number
          type: string
          severity: string
          title: string
          description: string
          resolved?: boolean
          resolvedAt?: string | null
        }
        Update: {
          transformerId?: number
          type?: string
          severity?: string
          title?: string
          description?: string
          resolved?: boolean
          resolvedAt?: string | null
        }
      }
    }
  }
}