<script setup lang="ts">
import { Database } from "~/utils/supabase";

const client = useSupabaseClient<Database>();

const { data: prices } = await useAsyncData("Price", async () => {
  const { data } = await client
    .from("Price")
    .select("id, Game (name), price, condition, ptt_article_id, posted_at")
    .order("posted_at", { ascending: false });
  return data;
});
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold">Latest Game Prices</h1>

    <div class="my-8" />

    <LatestTable :data="prices || []" />

    <button class="absolute bottom-24 right-4 btn-sm sm:btn-md btn-circle btn-info">
      <Icon name="ion:funnel" class="sm:h-6 sm:w-6" />
    </button>
    <button class="absolute bottom-10 right-4 btn-sm sm:btn-md btn-circle btn-info">
      <Icon name="ion:arrow-up" class="sm:h-6 sm:w-6" />
    </button>
  </div>
</template>
