<template>
  <div class="prose pb-10">
    <h1>About</h1>

    <template v-if="$route.query.lang === 'en'">
      <NuxtLink class="link" to="/about">繁體中文版</NuxtLink>
      <h2>What's this?</h2>
      <p>
        I built this website to crawl
        <NuxtLink class="link" to="https://www.ptt.cc/bbs/Gamesale/index.html" target="_blank"
          >PTT Gamesale</NuxtLink
        >
        (PTT is like Reddit in Taiwan) every three hours, extract game data from posts, and present them in a
        searchable and filterable table. When selecting a specific game, the price trend will be visualized.
      </p>

      <h2>Extraction</h2>
      <p>
        It does exist other similar websites. However, they can only extract data from a single game (there
        are often multiple games sold in a post) due to the unrestricted formats of the post. On our website,
        we use OpenAI GPT-3.5 Turbo API to extract game data (about $2 per month), which can extract multiple
        games and other properties, such as whether the items are new or used. Then, we employ Fuzzy Search to
        find the closest game from the game database I organized to solve the problem of different names of
        the same game.
      </p>

      <h2>Future work</h2>
      <p>
        This website is currently an MVP. There are many spaces for improvement, such as improving the game
        database to increase accuracy, subscribing to the price notification of a specific game, etc.
      </p>

      <h2>About me</h2>
      <ul>
        <li>
          GitHub:
          <NuxtLink class="link" to="https://github.com/uier" target="_blank"
            >https://github.com/uier</NuxtLink
          >
        </li>
        <li>
          LinkedIn:
          <NuxtLink class="link" to="https://www.linkedin.com/in/tzuwei-yu/" target="_blank">
            https://www.linkedin.com/in/tzuwei-yu/
          </NuxtLink>
        </li>
      </ul>
    </template>
    <template v-else>
      <NuxtLink class="link" to="/about?lang=en">English ver.</NuxtLink>
      <h2>這個網站是做什麼的？</h2>
      <p>
        這是一個每三小時爬取
        <NuxtLink class="link" to="https://www.ptt.cc/bbs/Gamesale/index.html" target="_blank"
          >PTT Gamesale 板</NuxtLink
        >
        的網站，並從貼文中抽取網友欲販售或徵求的遊戲資料，整理成可搜尋篩選的表格呈現，並且在選取特定的一款遊戲時以視覺化繪出價格趨勢。
      </p>

      <h2>從文章中抽取遊戲資料的方法？</h2>
      <p>
        有其他人做過類似的網站，但由於 PTT Gamesale
        版沒有限制文章格式，過去的網站僅能從一篇文章中抽取一款遊戲資料（然而常常有網友在一篇文章中販售多款遊戲）。在這個網站中，我們使用了
        OpenAI GPT-3.5 Turbo API 成功抽取多款遊戲資料（每個月成本約 $2
        美金），並且能解讀其他資訊如該商品為二手或全新，再使用 Fuzzy Search
        從自行整理的遊戲資料庫中找出最接近的一款遊戲來標準化名稱（如「王國之淚」、「薩爾達王國之淚」皆指「薩爾達傳說
        王國之淚」這款遊戲）。
      </p>

      <h2>未來展望</h2>
      <p>
        此網站目前是一個最小可行性產品，有許多可以改進之空間，如：完善遊戲資料庫讓精準度再進一步上升、訂閱特定遊戲的到價通知等等。
      </p>

      <h2>關於作者</h2>
      <ul>
        <li>
          GitHub:
          <NuxtLink class="link" to="https://github.com/uier" target="_blank"
            >https://github.com/uier</NuxtLink
          >
        </li>
        <li>
          LinkedIn:
          <NuxtLink class="link" to="https://www.linkedin.com/in/tzuwei-yu/" target="_blank">
            https://www.linkedin.com/in/tzuwei-yu/
          </NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>
