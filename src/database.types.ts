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
          created_at: string
          description: string | null
          duration: number
          employee_id: number | null
          id: string
          location_id: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: number
          employee_id?: number | null
          id?: string
          location_id?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          employee_id?: number | null
          id?: string
          location_id?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
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
          booking_date: string
          created_at: string
          employee_id: number
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
          employee_id: number
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
          employee_id?: number
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
            foreignKeyName: "bookings_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "users"
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
          created_at: string
          day: string
          employee_id: number
          end_time: string
          id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day: string
          employee_id: number
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day?: string
          employee_id?: number
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operating_rules_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
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
      book_activity: {
        Args: {
          requestor_id: number
          p_employee_id: number
          p_activity_id: string
          p_date: string
          p_start_time: string
        }
        Returns: Record<string, unknown>
      }
      create_activity: {
        Args: {
          requestor_id: number
          activity_name: string
          activity_duration: number
          activity_price: number
          activity_description?: string
          activity_location_id?: string
          activity_employee_id?: number
        }
        Returns: Record<string, unknown>
      }
      create_location: {
        Args: {
          requestor_id: number
          location_name: string
          location_description?: string
          location_address?: string
        }
        Returns: Record<string, unknown>
      }
      get_or_create_user: {
        Args: {
          requestor_id: number
          name: string
          username: string
          photo_url?: string
        }
        Returns: Record<string, unknown>
      }
      get_timeslots: {
        Args: {
          p_activity_id: string
          p_employee_id: number
          p_date: string
        }
        Returns: {
          timeslot: string
        }[]
      }
      get_users: {
        Args: {
          requestor_id: number
        }
        Returns: {
          user_id: number
          name: string
          username: string
          photo_url: string
          description: string
          user_role: string
          location_id: string
          created_at: string
          updated_at: string
        }[]
      }
      update_user: {
        Args: {
          requestor_id: number
          requestor_name: string
          requestor_username?: string
          requestor_description?: string
          operating_rules?: Database["public"]["CompositeTypes"]["operating_rule"][]
        }
        Returns: Record<string, unknown>
      }
      upsert_operating_rules: {
        Args: {
          requestor_id: number
          upserted_operating_rules: Database["public"]["CompositeTypes"]["operating_rule"][]
        }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      operating_rule: {
        id: string
        employee_id: number
        day: string
        start_time: string
        end_time: string
      }
    }
  }
}
