<template>
  <div>
    <h1 class="text-3xl font-bold">About</h1>
    <h1 class="text-xl mt-10 font-bold">這個網站是做什麼的？</h1>
    <p>
      這是一個每三小時爬取
      <NuxtLink class="link" to="https://www.ptt.cc/bbs/Gamesale/index.html" target="_blank"
        >PTT Gamesale 板</NuxtLink
      >
      的網站，並從貼文中抽取網友欲販售或徵求的遊戲資料，整理成可搜尋篩選的表格呈現，並且在選取特定的一款遊戲時以視覺化繪出價格趨勢。
    </p>
    <h1 class="text-xl mt-10 font-bold">從文章中抽取遊戲資料的方法？</h1>
    <p>
      過去有其他人做過類似的網站，但文章的格式較自由，他們表示僅能從一篇文章中抽取一款遊戲資料。在這個網站中，我使用了
      OpenAI GPT-3.5 Turbo API 來抽取遊戲資料（每個月成本約 $2
      美金），能夠從一篇文章中抽取多款遊戲資料（名稱、二手或全新、價格），再使用 Fuzzy Search
      從我整理的遊戲資料庫中找出最接近的一款遊戲來標準化名稱。
    </p>
    <h1 class="text-xl mt-10 font-bold">未來展望</h1>
    <p>
      此網站目前是一個最小可行性產品，有許多可以改進之空間，如：完善遊戲資料庫讓精準度再進一步上升、訂閱特定遊戲的到價通知等等。
    </p>
    <h1 class="text-xl mt-10 font-bold">關於作者</h1>
    <p>
      GitHub:
      <NuxtLink class="link" to="https://github.com/uier" target="_blank">https://github.com/uier</NuxtLink
      ><br />
      LinkedIn:
      <NuxtLink class="link" to="https://www.linkedin.com/in/tzuwei-yu/" target="_blank"
        >https://www.linkedin.com/in/tzuwei-yu/</NuxtLink
      >
    </p>
  </div>
</template>
