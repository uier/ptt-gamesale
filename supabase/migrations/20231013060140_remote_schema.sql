alter table "public"."Price" drop constraint "Price_game_id_fkey";

alter table "public"."Price" add column "parsed_name" text;

alter table "public"."Price" add constraint "Price_game_id_fkey" FOREIGN KEY (game_id) REFERENCES "Game"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Price" validate constraint "Price_game_id_fkey";

create policy "Enable read access for all users"
on "public"."Game"
as permissive
for select
to public
using (true);



