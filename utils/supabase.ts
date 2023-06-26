export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      Game: {
        Row: {
          created_at: string | null;
          id: number;
          name: string | null;
          platform: string | null;
          search_count: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name?: string | null;
          platform?: string | null;
          search_count?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string | null;
          platform?: string | null;
          search_count?: number | null;
        };
        Relationships: [];
      };
      Price: {
        Row: {
          condition: string | null;
          created_at: string | null;
          game_id: number | null;
          id: number;
          posted_at: string | null;
          price: number | null;
          ptt_article_id: string | null;
          ptt_article_url: string | null;
          trade_type: string | null;
        };
        Insert: {
          condition?: string | null;
          created_at?: string | null;
          game_id?: number | null;
          id?: number;
          posted_at?: string | null;
          price?: number | null;
          ptt_article_id?: string | null;
          ptt_article_url?: string | null;
          trade_type?: string | null;
        };
        Update: {
          condition?: string | null;
          created_at?: string | null;
          game_id?: number | null;
          id?: number;
          posted_at?: string | null;
          price?: number | null;
          ptt_article_id?: string | null;
          ptt_article_url?: string | null;
          trade_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Price_game_id_fkey";
            columns: ["game_id"];
            referencedRelation: "Game";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
