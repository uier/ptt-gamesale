<script setup lang="ts">
import { useDark } from "@vueuse/core";
import { MENU_ITEMS } from "~/types/constants";

const isDark = useDark({
  selector: "html",
  attribute: "data-theme",
  valueDark: "dracula",
  valueLight: "light",
});
</script>

<template>
  <div class="py-4 flex justify-between items-center">
    <h1 class="text-xl md:text-3xl font-bold tracking-tighter sm:tracking-normal">
      PTT Gamesale 板遊戲價格追蹤
    </h1>

    <MobileMenu class="sm:hidden" :is-dark="isDark" @toggle-dark="() => (isDark = !isDark)" />

    <div class="hidden sm:flex sm:items-center divide-gray-500 divide-x">
      <label class="swap">
        <input v-model="isDark" type="checkbox" class="mx-4" />
        <div class="swap-on"><Icon name="ion:sunny-outline" class="h-5 w-5" /></div>
        <div class="swap-off"><Icon name="ion:moon-outline" class="h-5 w-5" /></div>
      </label>
      <NuxtLink v-for="{ path, text } in MENU_ITEMS" :key="path" :to="path" class="hover:link px-4">
        {{ text }}
      </NuxtLink>
    </div>
  </div>
</template>
