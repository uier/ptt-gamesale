export type Filter = {
  game_id?: number;
  name?: string;
  trade_type: number | null;
  condition: number | null;
  platform: string[];
};

export type Price = {
  id: number;
  Game: { name: string | null; platform: string | null } | null;
  price: number | null;
  trade_type: number | null;
  condition: number | null;
  ptt_article_id: string | null;
  posted_at: string | null;
};
