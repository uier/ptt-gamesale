<script setup lang="ts">
import { Database } from "~/types/supabase";
import { z } from "zod";
import { Filter } from "~/types";

const client = useSupabaseClient<Database>();
const params = useUrlSearchParams("history");
const page = computed(() => {
  const stringTest = z.string().safeParse(params.page);
  if (!stringTest.success) return 1;
  const result = z.number().int().min(1).safeParse(parseInt(stringTest.data, 10));
  if (!result.success) return 1;
  return result.data;
});

const filter = ref<Filter>({});

const ROW_PER_PAGE = 10;

const { data: prices } = await useAsyncData(
  "price",
  async () => {
    const result = await client
      .from("Price")
      .select("id, game_id, Game(name, platform), price, trade_type, condition, ptt_article_id, posted_at")
      .neq("game_id", 0)
      .order("posted_at", { ascending: false })
      .range((page.value - 1) * ROW_PER_PAGE, page.value * ROW_PER_PAGE - 1);
    return result.data;
  },
  { watch: [page] }
);

const { data: count } = await useAsyncData("price-count", async () => {
  const result = await client.from("Price").select("*", { count: "exact", head: true });
  return result.count;
});

const { data: games } = await useAsyncData("games", async () => {
  const result = await client.from("Game").select("id, name, platform");
  return result.data;
});

const pageCount = computed(() => {
  if (count.value === null) {
    return 1;
  }
  return Math.ceil(count.value / ROW_PER_PAGE);
});

function updatePage(p: number) {
  params.page = p.toString();
}
</script>

<template>
  <div class="h-full w-full pb-10">
    <PriceFilter v-model="filter" :games="games" />

    <div class="my-3 md:my-8" />

    <div class="flex item-center justify-between">
      <h1 class="text-md md:text-xl font-semibold">最新 {{ count && `：共 ${count} 筆` }}</h1>
    </div>

    <div class="my-3 md:my-8" />

    <LatestTable
      :data="prices || []"
      :page="page"
      :count="count"
      :page-count="pageCount"
      @update-page="updatePage"
    />

    <div class="drawer drawer-end">
      <input id="filter-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-side">
        <label for="filter-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <div class="p-10">
          <div>Condition</div>
          <div>Trade Type</div>
          <div>Platform</div>
          <div>Time Range</div>
          <div>Price Range</div>
        </div>
      </div>
    </div>
  </div>
</template>
