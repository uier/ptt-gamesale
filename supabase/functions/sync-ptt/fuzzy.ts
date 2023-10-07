import Fuse from "https://esm.sh/fuse.js@6.6.2";
import games from "./games.json" assert { type: "json" };

export type Category = "NS" | "PS4" | "PS5";

const fuseOptions = {
  includeScore: false,
  findAllMatches: false,
  ignoreLocation: true,
  sortFn: (a: any, b: any) => {
    if (Math.abs(a.score - b.score) <= Math.exp(-6)) {
      return a.item.length - b.item.length;
    }
    return a.score - b.score;
  },
};

export function searchGame(pattern: string, category: Category) {
  const list = games[category];
  const fuse = new Fuse(list, fuseOptions);
  return fuse.search(pattern);
}
