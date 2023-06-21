<script setup lang="ts">
import { FlexRender, createColumnHelper, getCoreRowModel, useVueTable } from "@tanstack/vue-table";

type Price = {
  id: number;
  Game: { name: string | null } | null;
  price: number | null;
  ptt_article_id: string | null;
  posted_at: string | null;
};

const props = defineProps<{
  data: Price[];
}>();

const columnHelper = createColumnHelper<Price>();
const columns = [
  columnHelper.accessor("Game.name", { header: "遊戲名稱" }),
  columnHelper.accessor("price", { header: "價格" }),
  columnHelper.accessor("posted_at", {
    header: "時間",
    cell: (v) => dayjs(v.getValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
];

const table = useVueTable({
  get data() {
    return props.data;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
});

const dayjs = useDayjs();
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
        <td v-for="cell in row.getVisibleCells()" :key="cell.id">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </td>
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
</template>
