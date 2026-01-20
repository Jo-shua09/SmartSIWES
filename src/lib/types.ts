export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          full_name: string | null;
          title: string | null;
          location: string | null;
          bio: string | null;
          avatar_url: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          full_name?: string | null;
          title?: string | null;
          location?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          full_name?: string | null;
          title?: string | null;
          location?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          title: string;
          description: string | null;
          thumbnail: string | null;
          category: string | null;
          skills: string[] | null;
          is_video: boolean | null;
          technical_specs: Json | null;
          methodology: string[] | null;
          summary: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          description?: string | null;
          thumbnail?: string | null;
          category?: string | null;
          skills?: string[] | null;
          is_video?: boolean | null;
          technical_specs?: Json | null;
          methodology?: string[] | null;
          summary?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          thumbnail?: string | null;
          category?: string | null;
          skills?: string[] | null;
          is_video?: boolean | null;
          technical_specs?: Json | null;
          methodology?: string[] | null;
          summary?: string | null;
        };
      };
    };
  };
}
