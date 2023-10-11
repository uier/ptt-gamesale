import fs from 'fs'
import { parse } from 'node-html-parser'

const fetcher = async (year) => {
  const url = `https://zh.wikipedia.org/zh-tw/${year}%E5%B9%B4%E4%BB%BB%E5%A4%A9%E5%A0%82Switch%E6%B8%B8%E6%88%8F%E5%88%97%E8%A1%A8`
  return await fetch(url).then(res => res.text()).then(html => parse(html))
}

async function getNintendoSwitchGamesByPage(year) {
  const root = await fetcher(year)
  const table = root.querySelector('table.wikitable.sortable')
  const gameRows = Array.from(table.querySelectorAll('tr')).slice(2)
  const games = gameRows.map(row => parseName(row.querySelector('td'))).filter(name => name !== '(e.g.格式名:遊戲名稱)')
  // .map((game) => {
  //   return game.replace(/（.語.*/, '')
  // })
  return games
}

async function getNintendoSwitchGames(start, end) {
  const games = []
  for (let i = start; i <= end; i++) {
    const results = await getNintendoSwitchGamesByPage(i)
    games.push(...results)
  }
  fs.writeFileSync(`./ns-games-${start}-${end}.json`, JSON.stringify(games, null, 2))
}

function parseName(td) {
  const s = td.firstChild.textContent
  return s.includes('\n') ? s.split('\n').find(Boolean) : s
}

getNintendoSwitchGames(2017, 2023)
