<script setup lang="ts">
import { TRADE_TYPES, CONDITIONS } from "~/types/constants";
import { Price } from "~/types";

defineProps<{
  modelValue: string;
  data: Price[];
  page: number;
  pageCount: number;
}>();
const emit = defineEmits(["update-page", "update:modelValue"]);

const headers: { name: string; column: string }[] = [
  { name: "", column: "trade_type" },
  { name: "平台", column: "platform" },
  { name: "遊戲", column: "name" },
  { name: "價格", column: "price" },
  { name: "品況", column: "condition" },
  { name: "時間", column: "posted_at" },
  { name: "原文", column: "ptt_article_id" },
];

const dayjs = useDayjs();

function getTradeTypeValue(tradeType: Price["trade_type"]) {
  switch (tradeType) {
    case TRADE_TYPES.SELL:
      return "售";
    case TRADE_TYPES.BUY:
      return "徵";
    default:
      return "-";
  }
}
function getConditionValue(condition: Price["condition"]) {
  switch (condition) {
    case CONDITIONS.NEW:
      return "全新";
    case CONDITIONS.USED:
      return "二手";
    default:
      return "-";
  }
}
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th
          v-for="{ name, column } in headers"
          :key="column"
          :class="{ 'hidden sm:table-cell': column === 'posted_at' }"
        >
          {{ name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ getTradeTypeValue(item.trade_type) }}</td>
        <td>{{ item.Game?.platform }}</td>
        <td>
          <button
            class="btn btn-ghost hover:btn-info btn-sm overflow-hidden px-1"
            @click="$emit('update:modelValue', item.Game?.name)"
          >
            {{ item.Game?.name }}
          </button>
        </td>
        <td>{{ item.price }}</td>
        <td>{{ getConditionValue(item.condition) }}</td>
        <td class="hidden sm:table-cell">
          <div class="tooltip" :data-tip="dayjs(item.posted_at).format('YYYY-MM-DD HH:mm:ss')">
            {{
              //@ts-ignore
              dayjs(item.posted_at).fromNow()
            }}
          </div>
        </td>
        <td>
          <NuxtLink :to="`https://www.ptt.cc/bbs/Gamesale/${item.ptt_article_id}.html`" target="_blank">
            <button class="btn btn-circle btn-xs sm:btn-sm btn-ghost px-0">
              <Icon name="ion:md-open" class="h-4 w-4" />
            </button>
          </NuxtLink>
        </td>
      </tr>
      <tr v-if="data.length === 0">
        <td :colspan="headers.length" class="text-center">查無結果</td>
      </tr>
    </tbody>
  </table>
  <div class="flex items-center gap-2 pb-10">
    <div class="join">
      <button class="join-item btn" @click="emit('update-page', 1)">«</button>
      <button class="join-item btn" @click="emit('update-page', Math.max(1, page - 1))">‹</button>
      <button class="join-item bg-base-200 px-4">Page {{ page }} of {{ pageCount }}</button>
      <button class="join-item btn" @click="emit('update-page', Math.min(pageCount, page + 1))">›</button>
      <button class="join-item btn" @click="emit('update-page', pageCount)">»</button>
    </div>
  </div>
</template>
