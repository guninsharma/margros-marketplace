export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_logs: {
        Row: {
          contacted_at: string | null
          id: string
          listing_id: string
          listing_type: string
          user_id: string
        }
        Insert: {
          contacted_at?: string | null
          id?: string
          listing_id: string
          listing_type: string
          user_id: string
        }
        Update: {
          contacted_at?: string | null
          id?: string
          listing_id?: string
          listing_type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          category: string | null
          city: string | null
          created_at: string | null
          cuisine_type: string[] | null
          email: string | null
          embedding: string | null
          full_address: string | null
          google_maps_url: string | null
          id: string
          is_verified: boolean | null
          locality: string
          name: string
          phone: string | null
          rating: number | null
          review_count: number | null
          updated_at: string | null
          verification_notes: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          cuisine_type?: string[] | null
          email?: string | null
          embedding?: string | null
          full_address?: string | null
          google_maps_url?: string | null
          id?: string
          is_verified?: boolean | null
          locality: string
          name: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
          verification_notes?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          cuisine_type?: string[] | null
          email?: string | null
          embedding?: string | null
          full_address?: string | null
          google_maps_url?: string | null
          id?: string
          is_verified?: boolean | null
          locality?: string
          name?: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
          verification_notes?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          agency_name: string | null
          city: string | null
          created_at: string | null
          department: string
          embedding: string | null
          experience_years: number | null
          full_name: string
          id: string
          is_available: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          locality: string
          mobile: string | null
          photo_url: string | null
          role_title: string | null
          salary_expectation: number | null
          source_platform: string | null
          type: string | null
          updated_at: string | null
          verification_notes: string | null
        }
        Insert: {
          agency_name?: string | null
          city?: string | null
          created_at?: string | null
          department: string
          embedding?: string | null
          experience_years?: number | null
          full_name: string
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          locality: string
          mobile?: string | null
          photo_url?: string | null
          role_title?: string | null
          salary_expectation?: number | null
          source_platform?: string | null
          type?: string | null
          updated_at?: string | null
          verification_notes?: string | null
        }
        Update: {
          agency_name?: string | null
          city?: string | null
          created_at?: string | null
          department?: string
          embedding?: string | null
          experience_years?: number | null
          full_name?: string
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          locality?: string
          mobile?: string | null
          photo_url?: string | null
          role_title?: string | null
          salary_expectation?: number | null
          source_platform?: string | null
          type?: string | null
          updated_at?: string | null
          verification_notes?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          business_name: string
          category: string
          category_group: string
          city: string | null
          contact_person_name: string | null
          created_at: string | null
          description: string | null
          email: string | null
          embedding: string | null
          id: string
          is_verified: boolean | null
          locality: string
          phone: string | null
          updated_at: string | null
          verification_notes: string | null
          whatsapp: string | null
        }
        Insert: {
          business_name: string
          category: string
          category_group: string
          city?: string | null
          contact_person_name?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          embedding?: string | null
          id?: string
          is_verified?: boolean | null
          locality: string
          phone?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          whatsapp?: string | null
        }
        Update: {
          business_name?: string
          category?: string
          category_group?: string
          city?: string | null
          contact_person_name?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          embedding?: string | null
          id?: string
          is_verified?: boolean | null
          locality?: string
          phone?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_staff: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          department: string
          experience_years: number
          full_name: string
          id: string
          is_verified: boolean
          locality: string
          photo_url: string
          role_title: string
          similarity: number
        }[]
      }
      match_vendors: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          business_name: string
          category: string
          category_group: string
          description: string
          id: string
          is_verified: boolean
          locality: string
          similarity: number
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
