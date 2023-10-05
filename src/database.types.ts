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
          coach_id: string | null
          created_at: string
          description: string | null
          duration: number
          id: string
          location_id: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          coach_id?: string | null
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          location_id?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          coach_id?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          location_id?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
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
          booking_date: string
          created_at: string
          end_time: string
          id: string
          start_time: string
          status: string
          updated_at: string
          user_id: number
        }
        Insert: {
          activity_id: string
          booking_date: string
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          status: string
          updated_at?: string
          user_id: number
        }
        Update: {
          activity_id?: string
          booking_date?: string
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          status?: string
          updated_at?: string
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
      employees: {
        Row: {
          created_at: string
          description: string | null
          id: number
          location_id: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: number
          location_id?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          location_id?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      operating_rules: {
        Row: {
          coach_id: string
          created_at: string
          day: string
          end_time: string
          id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          day: string
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          day?: string
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: number
          name: string
          photo_url: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: number
          name: string
          photo_url?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          photo_url?: string | null
          updated_at?: string
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
          requestor_id: number
          name: string
          username: string
          photo_url?: string
        }
        Returns: Record<string, unknown>
      }
      get_users: {
        Args: {
          requestor_id: number
        }
        Returns: Record<string, unknown>[]
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
