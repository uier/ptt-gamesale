import * as postgres from "https://deno.land/x/postgres@v0.14.2/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { fetchNewArticles } from "./crawl.ts";
import { type Article, type Price, processArticle } from "./lib.ts";

const databaseUrl = Deno.env.get("SUPABASE_DB_URL")!;
const pool = new postgres.Pool(databaseUrl, 3, true);

/*
To invoke:
curl -i --location --request POST 'http://localhost:54321/functions/v1/sync-ptt' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
  --header 'Content-Type: application/json'
*/

serve(async () => {
  try {
    const connection = await pool.connect();
    try {
      const result = await connection.queryObject<{
        id: number;
        last_crawl_timestamp: bigint;
      }>`SELECT * FROM "Crawler" WHERE id = 1`;
      const timestamp = result.rows[0].last_crawl_timestamp;

      const newArticles: Article[] = await fetchNewArticles(timestamp);
      const updateTimestamp = +new Date();
      console.info(
        `Fetched ${newArticles.length} new articles from ${new Date(Number(timestamp)).toLocaleString(
          "zh-tw"
        )} to ${new Date(updateTimestamp).toLocaleString("zh-tw")}`
      );

      const newPrices: Price[] = (
        await Promise.allSettled(newArticles.map((a) => processArticle(a, findGameID)))
      )
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<Price[]>).value)
        .flat();

      if (newPrices.length > 0) {
        storeInDB(newPrices);
        updateTimestampInDB(updateTimestamp);
      }

      return new Response(`Stored ${newPrices.length} new prices`, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});

async function findGameID(name: string, platform: string): Promise<number | null> {
  const connection = await pool.connect();
  try {
    const result = await connection.queryObject<{ id: number }>`
      SELECT id FROM "Game" WHERE name = ${name} AND platform = ${platform}
    `;
    if (result.rows.length === 0) {
      console.warn(`GAME_NOT_FOUND,${name},${platform}`);
      return null;
    } else {
      return result.rows[0].id;
    }
  } catch (error) {
    console.error("findGameID:", error);
  } finally {
    connection.release();
  }
  return null;
}

async function storeInDB(prices: Price[]) {
  const connection = await pool.connect();
  for (const p of prices) {
    try {
      const { game_id, price, posted_at, condition, trade_type, ptt_article_id } = p;
      await connection.queryObject`
        INSERT INTO "Price" (game_id, price, posted_at, condition, trade_type, ptt_article_id)
        VALUES (${game_id}, ${price}, ${posted_at}, ${condition}, ${trade_type}, ${ptt_article_id})
      `;
    } catch (error) {
      console.error("storeInDB:", p, error);
    }
  }
  connection.release();
}

async function updateTimestampInDB(timestamp: number) {
  const connection = await pool.connect();
  try {
    await connection.queryObject`
      UPDATE "Crawler"
      SET last_crawl_timestamp = ${timestamp}
      WHERE id = 1
    `;
  } catch (error) {
    console.error("updateTimestampInDB:", error);
  } finally {
    connection.release();
  }
}
