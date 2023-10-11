import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";

const env = await load();

const SUPABASE_URL = env["SUPABASE_URL"];
const SUPABASE_KEY = env["SUPABASE_KEY"];

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function dumpGames() {
  const { data: games, error } = await supabase.from("Game").select("id, name, platform").limit(10000);
  if (error) {
    console.log(error);
    return;
  }
  console.log(games.length);
  const data = {
    NS: games.filter(({ platform }) => platform === "NS").map(({ id, name }) => ({ id, name })),
    PS4: games.filter(({ platform }) => platform === "PS4").map(({ id, name }) => ({ id, name })),
    PS5: games.filter(({ platform }) => platform === "PS5").map(({ id, name }) => ({ id, name })),
  };
  Deno.writeTextFileSync("./games.json", JSON.stringify(data, null, 2));
}

dumpGames();
