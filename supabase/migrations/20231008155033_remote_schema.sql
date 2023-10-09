alter table "public"."Price" drop constraint "Price_ptt_article_id_key";

drop index if exists "public"."Price_ptt_article_id_key";

alter table "public"."Price" add constraint "Price_game_id_fkey" FOREIGN KEY (game_id) REFERENCES "Game"(id) not valid;

alter table "public"."Price" validate constraint "Price_game_id_fkey";


