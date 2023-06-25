<script setup lang="ts">
const search = ref("");

const shortcuts = ["薩爾達傳說 王國之淚", "瑪利歐賽車8豪華版", "斯普拉遁3"];

function handleClickShortcuts(shortcut: string) {
  search.value = shortcut;
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold">Game Price History</h1>

    <div class="my-8" />

    <div class="flex flex-wrap sm:flex-nowrap gap-4 justify-end sm:justify-start">
      <div class="form-control w-full gap-2">
        <input
          v-model="search"
          type="text"
          placeholder="搜尋遊戲名稱"
          class="input input-bordered w-full"
          list="games"
        />
        <datalist id="games">
          <option v-for="s in shortcuts" :key="s" :value="s" :label="s" />
        </datalist>
        <label class="label">
          <div class="label-text-alt flex gap-3 items-center overflow-auto pb-2">
            <span class="text-sm whitespace-nowrap">搜搜看：</span>
            <button
              v-for="s in shortcuts"
              :key="s"
              class="btn btn-xs text-xs sm:btn-sm sm:text-sm btn-info"
              @click="handleClickShortcuts(s)"
            >
              {{ s }}
            </button>
          </div>
        </label>
      </div>

      <button class="btn btn-success btn-sm sm:btn-md">Submit</button>
    </div>
  </div>
</template>
