export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      "admin-only": {
        Row: {
          created_at: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      announcement_comments: {
        Row: {
          announcement_id: string;
          content: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          announcement_id: string;
          content: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          announcement_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcement_comments_announcement_id_fkey";
            columns: ["announcement_id"];
            isOneToOne: false;
            referencedRelation: "announcements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcement_comments_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      announcement_likes: {
        Row: {
          announcement_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          announcement_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          announcement_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcement_likes_announcement_id_fkey";
            columns: ["announcement_id"];
            isOneToOne: false;
            referencedRelation: "announcements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcement_likes_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      announcements: {
        Row: {
          author_id: string;
          comments_count: number;
          content: string;
          created_at: string;
          event_id: number;
          id: string;
          likes_count: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          comments_count?: number;
          content: string;
          created_at?: string;
          event_id: number;
          id?: string;
          likes_count?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          comments_count?: number;
          content?: string;
          created_at?: string;
          event_id?: number;
          id?: string;
          likes_count?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey1";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcements_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      event_invite: {
        Row: {
          created_at: string;
          event_id: number;
          id: number;
          rsvp: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          event_id: number;
          id?: number;
          rsvp?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          event_id?: number;
          id?: number;
          rsvp?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_invite_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_invite_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          auto_invited_to_event: number | null;
          code: string;
          consumed: boolean | null;
          created_at: string;
          expires: string | null;
          firstname: string | null;
          id: number;
          lastname: string | null;
          single_use: boolean;
        };
        Insert: {
          auto_invited_to_event?: number | null;
          code: string;
          consumed?: boolean | null;
          created_at?: string;
          expires?: string | null;
          firstname?: string | null;
          id?: number;
          lastname?: string | null;
          single_use: boolean;
        };
        Update: {
          auto_invited_to_event?: number | null;
          code?: string;
          consumed?: boolean | null;
          created_at?: string;
          expires?: string | null;
          firstname?: string | null;
          id?: number;
          lastname?: string | null;
          single_use?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "invitation_links_auto_invited_to_event_fkey";
            columns: ["auto_invited_to_event"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          expo_push_token: string | null;
          first_name: string | null;
          id: string;
          invite_link: number | null;
          is_admin: boolean;
          last_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          expo_push_token?: string | null;
          first_name?: string | null;
          id: string;
          invite_link?: number | null;
          is_admin?: boolean;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          expo_push_token?: string | null;
          first_name?: string | null;
          id?: string;
          invite_link?: number | null;
          is_admin?: boolean;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_invite_link_fkey";
            columns: ["invite_link"];
            isOneToOne: false;
            referencedRelation: "invitations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      consume_invitation: {
        Args: { _id: number };
        Returns: undefined;
      };
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
