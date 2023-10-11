import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const BASE_URL = 'https://www.ptt.cc'
const BOARD = 'Gamesale'
const OUTPUT_FILE = './deno-ptt-games.json'

const pttFetcher = async (path) => {
  const url = `${BASE_URL}/${path}`
  const option = {
    headers: { Cookie: 'over18=1' }
  }
  return await withExpotentialBackoff(
    () => fetch(url, option).then(res => res.text()).then(html => new DOMParser().parseFromString(html, 'text/html'))
  )
}

/**
 * @param {number} after an unix timestamp in milliseconds
 */
async function fetchNewArticles(after) {
  const results = []
  let page = await getLatestPageNum()
  let stop = false
  while (!stop) {
    const articles = await fetchArticlesByPage(page)
    const newArticles = articles.filter(({ time }) => time > after).filter(validateArticle)
    results.push(...newArticles)
    stop |= articles.length !== newArticles.length
    page--
  }
  Deno.writeTextFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2))
}

async function fetchArticlesByPage(pageNum) {
  const root = await pttFetcher(`/bbs/${BOARD}/index${pageNum}.html`)
  const pinnedArticleCount = root.querySelectorAll('div.r-list-sep ~ div.r-ent').length
  const articles = pinnedArticleCount > 0
    ? Array.from(root.querySelectorAll('div.r-ent')).slice(0, -pinnedArticleCount)
    : Array.from(root.querySelectorAll('div.r-ent'))
  const articlePaths = articles
    .filter(article => article.querySelector('div.title a'))
    .map(article => article.querySelector('div.title a').getAttribute('href'))
  return (
    await Promise.allSettled(articlePaths.map(path => fetchArticle(path)))
  ).map(({ value }) => value)
}

async function fetchArticle(path) {
  const root = await pttFetcher(path)
  const metas = Array.from(root.querySelectorAll('.article-meta-value')).map(meta => meta.textContent)
  const lines = root.querySelector('#main-content').textContent.split('\n')
  const endIndex = lines.findIndex(line => line.includes('※ 文章網址: '))
  const contents = lines.slice(1, endIndex)
  return {
    id: path.split('/').at(-1).replace('.html', ''),
    author: metas?.[0] || '',
    category: metas[2]?.split('[')?.[1]?.split(']')?.[0]?.trim() || '',
    title: metas[2]?.split(']')?.[1]?.trim() || '',
    time: transformToUnix(metas?.[3]) || '',
    content: contents?.slice(0, -2).join('\n') || '',
    ip: contents?.at(-1)?.split(': ')?.at(-1) || '',
  }
}

async function getLatestPageNum() {
  const root = await pttFetcher(`/bbs/${BOARD}/index.html`)
  const node = Array.from(root.querySelectorAll('a.btn.wide')).find(el => el.textContent.includes('上頁'));
  const pageNumStr = node.getAttribute('href').match(/index(\d+).html/)[1]
  return parseInt(pageNumStr, 10) + 1
}

async function withExpotentialBackoff(fn, maxRetry = 3) {
  let retry = 0, err
  while (retry < maxRetry) {
    try {
      return await fn()
    } catch (error) {
      retry++
      err = error
      const delay = 2 ** retry * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw err
}

function transformToUnix(datetime) {
  return datetime ? Date.parse(`${datetime} GMT+0800`) : null
}

function validateArticle(article) {
  return article && hasExpectedKeys(article, ['id', 'author', 'category', 'title', 'time', 'content', 'ip'])
}

function hasExpectedKeys(obj, expectedKeys) {
  for (const key of expectedKeys) {
    if (!obj.hasOwnProperty(key)) return false
  }
  return true;
}

fetchNewArticles(Date.parse('Sat Sep  17 22:16:00 2023 GMT+8'))