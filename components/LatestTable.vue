<script setup lang="ts">
import { FlexRender, createColumnHelper, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { TRADE_TYPES, CONDITIONS } from "~/types/constants";

type Price = {
  id: number;
  Game: { name: string | null } | null;
  price: number | null;
  trade_type: number | null;
  condition: number | null;
  ptt_article_id: string | null;
  posted_at: string | null;
};

const props = defineProps<{
  data: Price[];
  page: number;
  count: number | null;
  pageCount: number;
}>();
const emit = defineEmits(["update-page"]);

const columnHelper = createColumnHelper<Price>();
const columns = [
  columnHelper.accessor("trade_type", { header: "", cell: (v) => getTradeTypeValue(v.getValue()) }),
  columnHelper.accessor("Game.name", { header: "遊戲名稱" }),
  columnHelper.accessor("price", { header: "價格" }),
  columnHelper.accessor("condition", { header: "品況", cell: (v) => getConditionValue(v.getValue()) }),
  columnHelper.display({
    id: "posted_at",
    header: "時間",
    cell: (v) => dayjs(v.row.original.posted_at).fromNow(),
    enableHiding: true,
  }),
  columnHelper.display({ id: "ptt_article_id", header: "原文" }),
];

const table = useVueTable({
  get data() {
    return props.data;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
});

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
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan">
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <template v-for="cell in row.getVisibleCells()" :key="cell.id">
          <td v-if="cell.column.id === 'posted_at'">
            <div class="tooltip" :data-tip="dayjs(cell.row.original.posted_at).format('YYYY-MM-DD HH:mm:ss')">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </div>
          </td>
          <td v-else-if="cell.column.id === 'ptt_article_id'">
            <NuxtLink
              :to="`https://www.ptt.cc/bbs/Gamesale/${cell.row.original.ptt_article_id}.html`"
              target="_blank"
            >
              <button class="btn btn-xs sm:btn-sm btn-ghost">
                <Icon name="ion:md-open" class="h-4 w-4" />
              </button>
            </NuxtLink>
          </td>
          <td v-else>
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </template>
      </tr>
    </tbody>
    <tfoot>
      <tr v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
        <th v-for="header in footerGroup.headers" :key="header.id" :colSpan="header.colSpan">
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.footer"
            :props="header.getContext()"
          />
        </th>
      </tr>
    </tfoot>
  </table>
  <div class="flex items-center gap-2">
    <div class="join">
      <button class="join-item btn" @click="emit('update-page', 1)">«</button>
      <button class="join-item btn" @click="emit('update-page', Math.max(1, page - 1))">‹</button>
      <button class="join-item bg-base-200 px-4">Page {{ page }} of {{ pageCount }}</button>
      <button class="join-item btn" @click="emit('update-page', Math.min(pageCount, page + 1))">›</button>
      <button class="join-item btn" @click="emit('update-page', pageCount)">»</button>
    </div>
  </div>
</template>
