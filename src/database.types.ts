export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          coach_id: number
          description: string | null
          duration: number
          id: string
          location_id: string
          name: string
          price: number
        }
        Insert: {
          coach_id: number
          description?: string | null
          duration: number
          id: string
          location_id: string
          name: string
          price: number
        }
        Update: {
          coach_id?: number
          description?: string | null
          duration?: number
          id?: string
          location_id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "activities_coach_id_fkey"
            columns: ["coach_id"]
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          activity_id: string
          date: string
          end_time: string
          id: string
          start_time: string
          status: string
          user_id: number
        }
        Insert: {
          activity_id: string
          date: string
          end_time: string
          id: string
          start_time: string
          status?: string
          user_id: number
        }
        Update: {
          activity_id?: string
          date?: string
          end_time?: string
          id?: string
          start_time?: string
          status?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_activity_id_fkey"
            columns: ["activity_id"]
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      coaches: {
        Row: {
          description: string | null
          id: number
          location_id: string
          name: string
        }
        Insert: {
          description?: string | null
          id: number
          location_id: string
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          location_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaches_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          address: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      operating_rules: {
        Row: {
          coach_id: number
          day: string
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          coach_id: number
          day: string
          end_time: string
          id: string
          start_time: string
        }
        Update: {
          coach_id?: number
          day?: string
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "operating_rules_coach_id_fkey"
            columns: ["coach_id"]
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          id: number
          name: string
          role: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          role?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          role?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_or_create_user: {
        Args: {
          user_id: number
          name: string
          username: string
        }
        Returns: {
          created_at: string
          id: number
          name: string
          role: string
          username: string | null
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
