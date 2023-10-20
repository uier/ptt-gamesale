import Fuse from "https://esm.sh/fuse.js@6.6.2";
import games from "./games.json" assert { type: "json" };

export type Category = "NS" | "PS4" | "PS5";

const fuseOptions = {
  includeScore: true,
  findAllMatches: false,
  ignoreLocation: true,
  keys: ["name"],
  sortFn: (a: any, b: any) => {
    if (Math.abs(a.score - b.score) <= Math.exp(-6)) {
      return a.item[0].v.length - b.item[0].v.length;
    }
    return a.score - b.score;
  },
};

export function searchGame(pattern: string, category: Category): { id: number; score: number } | null {
  const list = games[category];
  const fuse = new Fuse(list, fuseOptions);
  const results = fuse.search(pattern);
  if (results.length === 0) return null;
  return { id: results[0].item.id, score: results[0].score };
}
