import OpenAI from "https://esm.sh/openai@4.11.1";
import { Database } from "../../../types/supabase.ts";
import { fetchNewArticles } from "./crawl.ts";
import { searchGame, type Category } from "./fuzzy.ts";

export type Article = Awaited<ReturnType<typeof fetchNewArticles>>[number];
export type Price = Database["public"]["Tables"]["Price"]["Insert"];
export type Name2ID = (name: string, platform: string) => Promise<number | null>;

export async function processArticle(
  article: Article,
  findGameID: Name2ID
): Promise<Price[] | null | undefined> {
  if (blacklist(article)) throw new Error("Blacklisted article");
  return await extractGamesale(simplifyArticle(article), findGameID);
}

function blacklist(article: Article): boolean {
  if (!["NS", "PS4", "PS5"].some((p) => article.category.includes(p))) return true;
  return false;
}

export function simplifyArticle(article: Article): Article {
  return {
    ...article,
    content: simplifyContent(article.content),
  };
}

export function simplifyContent(content: string): string {
  return content
    .replace(/.*【遊戲分級】：.*\n/g, "")
    .replace(/.*【交易方式】：.*\n/g, "")
    .replace(/.*【地區語系】：.*\n/g, "")
    .replace(/.*【商品圖片】：.*\n/g, "")
    .replace(/售[ ]+價/, "售價")
    .replace(/徵[ ]+求[ ]+價/, "徵求價")
    .replace(/.*【地.*區】：.*\n/g, "")
    .replace(/.*【附.*註】：.*\n/g, "")
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/^[ \t]+$/gm, "")
    .replace(/\n{2,}/g, "\n");
}

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function extractGamesale(
  article: Article,
  findGameID: Name2ID
): Promise<Price[] | null | undefined> {
  const result = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          '請你扮演Parser根據文章回答遊戲價格,每個遊戲輸出一行,格式為`名稱,價格,二手`;且遵守以下格式\n- 名稱不需包含"全新"或"二手"等狀況資訊\n- 價格為一個整數且不需要符號\n- 二手預設為`1`,該遊戲為全新時為`0`',
      },
      {
        role: "user",
        content:
          "★【物品名稱】：\n薩爾達傳說曠野之息\n薩爾達傳說御天之劍\n路易吉洋樓3\n★【售價】：\n薩爾達傳說曠野之息－1,400\n薩爾達傳說御天之劍－600\n那由多之軌跡1050\n★【保存狀況】：曠野之息全新，其餘二手，盒裝完整",
      },
      {
        role: "assistant",
        content: "薩爾達傳說曠野之息,1400,0\n薩爾達傳說御天之劍,600,1\n路易吉洋樓3,1050,1",
      },
      {
        role: "user",
        content: article.content,
      },
    ],
    temperature: 0,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (result.choices.length < 1) {
    throw new Error("No response from OpenAI");
  } else if (result.choices[0].message.content === null) {
    throw new Error("No content in response from OpenAI");
  }
  const prices = (
    await Promise.allSettled(
      result.choices[0].message.content.split("\n").map(async (line) => {
        const [name, price, used] = line.split(",");
        return {
          game_id: await findGameID(searchGame(name, article.category as Category), article.category),
          price: parseInt(price, 10),
          condition: used === "0" ? 0 : used === "1" ? 1 : -1,
          ptt_article_id: article.id,
          posted_at: new Date(article.time).toISOString(),
          trade_type: article.title.includes("徵") ? 0 : article.title.includes("售") ? 1 : -1,
        };
      })
    )
  )
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<Price>).value);
  return prices;
}
