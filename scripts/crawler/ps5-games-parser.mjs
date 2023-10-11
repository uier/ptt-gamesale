import fs from "fs";
import { parse } from "node-html-parser";

const fetcher = async (page) => {
  const url = `https://store.playstation.com/zh-hant-tw/category/f44fdcbf-a390-4543-962b-ad929bbf213c`;
  const option = {
    headers: {
      "User-Agent": "curl/8.1.2",
    },
  };
  return await fetch(`${url}/${page}`, option)
    .then((res) => res.text())
    .then((html) => parse(html));
};

async function getPlayStationGamesByPage(page) {
  const root = await fetcher(page);
  const items = Array.from(root.querySelectorAll("span.psw-t-body.psw-c-t-1.psw-t-truncate-2.psw-m-b-2"));
  const games = items.map((el) => parseName(el.textContent));
  console.log(`${games.length}\t${page % 10 ? "" : "\n"}`);
  return games;
}

async function getPlayStationGames(start, end) {
  const games = [];
  for (let i = start; i <= end; i++) {
    const results = await getPlayStationGamesByPage(i);
    games.push(...results);
    await new Promise((resolve) => setTimeout(resolve, 14000));
  }
  fs.writeFileSync(`./ps5-games-${start}-${end}.json`, JSON.stringify(games, null, 2));
}

function parseName(text) {
  return text.split(" (")[0];
}

getPlayStationGames(1, 75);
