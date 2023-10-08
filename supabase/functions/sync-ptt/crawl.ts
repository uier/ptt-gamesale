import { DOMParser, type Element } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const BASE_URL = "https://www.ptt.cc";
const BOARD = "Gamesale";

const pttFetcher = async (path: string) => {
  const url = `${BASE_URL}/${path}`;
  const option = {
    headers: { Cookie: "over18=1" },
  };
  return await withExpotentialBackoff(() =>
    fetch(url, option)
      .then((res) => res.text())
      .then((html) => new DOMParser().parseFromString(html, "text/html")!)
  );
};

/**
 * @param after an unix timestamp in milliseconds
 * Example usage: fetchNewArticles(Date.parse("Sat Sep  16 22:16:00 2023 GMT+8"));
 */
export async function fetchNewArticles(after: bigint) {
  const results = [];
  let page = await getLatestPageNum();
  let stop = false;
  while (!stop) {
    const articles = await fetchArticlesByPage(page);
    const newArticles = articles.filter(({ time }) => time > Number(after));
    results.push(...newArticles);
    stop = stop || articles.length !== newArticles.length;
    page--;
  }
  return results;
}

// https://stackoverflow.com/questions/64928212/how-to-use-promise-allsettled-with-typescript
const isRejected = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult =>
  input.status === "rejected";
const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
  input.status === "fulfilled";
async function fetchArticlesByPage(page: number) {
  const root = await pttFetcher(`/bbs/${BOARD}/index${page}.html`);
  const pinnedArticleCount = root.querySelectorAll("div.r-list-sep ~ div.r-ent").length;
  const articles = (
    pinnedArticleCount > 0
      ? Array.from(root.querySelectorAll("div.r-ent")).slice(0, -pinnedArticleCount)
      : Array.from(root.querySelectorAll("div.r-ent"))
  ) as Element[];
  const articlePaths = articles
    .filter((article) => article.querySelector("div.title a"))
    .map((article) => article.querySelector("div.title a")!.getAttribute("href")!);
  const articleResults = await Promise.allSettled(articlePaths.map((path) => fetchArticle(path)));
  const failedArticlePaths = articleResults
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => isRejected(d))
    .map(({ i }) => articlePaths[i]);
  if (failedArticlePaths.length > 0) {
    console.warn("failed to fetch articles:\n", failedArticlePaths.join("\n"));
  }
  return articleResults.filter(isFulfilled).map(({ value }) => value);
}

async function fetchArticle(path: string) {
  const root = await pttFetcher(path);
  const metas = Array.from(root.querySelectorAll(".article-meta-value")).map((meta) => meta.textContent);
  const lines = root.querySelector("#main-content")!.textContent.split("\n");
  const endIndex = lines.findIndex((line) => line.includes("※ 文章網址: "));
  const contents = lines.slice(1, endIndex);
  return {
    id: path.split("/").at(-1)!.replace(".html", ""),
    author: metas?.[0] || "",
    category: metas[2]?.split("[")?.[1]?.split("]")?.[0]?.trim() || "",
    title: metas[2]?.split("]")?.[1]?.trim() || "",
    time: transformToUnix(metas?.[3]) || 0,
    content: contents?.slice(0, -2).join("\n") || "",
    ip: contents?.at(-1)?.split(": ")?.at(-1) || "",
  };
}

async function getLatestPageNum() {
  const root = await pttFetcher(`/bbs/${BOARD}/index.html`);
  const node = Array.from(root.querySelectorAll("a.btn.wide") as Iterable<Element>).find((el) =>
    el.textContent.includes("上頁")
  )!;
  const pageNumStr = node.getAttribute("href")!.match(/index(\d+).html/)![1];
  return parseInt(pageNumStr, 10) + 1;
}

async function withExpotentialBackoff<T>(fn: () => Promise<T>, maxRetry = 3, jitter = 1000) {
  let retry = 0,
    err;
  while (retry < maxRetry) {
    try {
      return await fn();
    } catch (error) {
      retry++;
      err = error;
      const delay = 2 ** retry * 1000 + Math.random() * jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw err;
}

function transformToUnix(datetime: string) {
  return datetime ? Date.parse(`${datetime} GMT+0800`) : null;
}
