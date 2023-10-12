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

const filter = ref<Filter>({
  condition: null,
  trade_type: null,
  platform: ["NS", "PS4", "PS5"],
});

const ROW_PER_PAGE = 10;

const { data: prices } = await useAsyncData(
  "price",
  async () => {
    let query = client
      .from("Price")
      .select(
        "id, game_id, Game!inner (name, platform), price, trade_type, condition, ptt_article_id, posted_at",
        {
          count: "exact",
        }
      )
      .neq("game_id", 0)
      .in("Game.platform", filter.value.platform)
      .range((page.value - 1) * ROW_PER_PAGE, page.value * ROW_PER_PAGE - 1)
      .order("posted_at", { ascending: false });
    if (filter.value.condition !== null) {
      query = query.eq("condition", filter.value.condition);
    }
    if (filter.value.trade_type !== null) {
      query = query.eq("trade_type", filter.value.trade_type);
    }
    if (filter.value.game_id !== undefined) {
      query = query.eq("game_id", filter.value.game_id);
    }
    if (filter.value.name !== undefined) {
      query = query.textSearch("Game.name", filter.value.name);
    }
    const result = await query;
    return result;
  },
  { watch: [page, filter] }
);

const { data: games } = await useAsyncData("games", async () => {
  const result = await client.from("Game").select("id, name, platform");
  return result.data;
});

const pageCount = computed(() => {
  if (prices.value?.count == null) {
    return 1;
  }
  return Math.ceil(prices.value.count / ROW_PER_PAGE);
});

function updatePage(p: number) {
  params.page = p.toString();
}
</script>

<template>
  <div class="h-full w-full pb-10">
    <PriceFilter v-model="filter" :games="games" />

    <div class="my-3" />

    <h1 class="pl-1 text-sm md:text-md">{{ `共 ${prices?.count || 0} 筆` }}</h1>

    <div class="my-3" />

    <template v-if="filter.game_id != null">
      <PriceTrend :data="prices?.data || []" />
      <div class="my-3" />
    </template>

    <LatestTable :data="prices?.data || []" :page="page" :page-count="pageCount" @update-page="updatePage" />
  </div>
</template>
