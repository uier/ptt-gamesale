<script setup lang="ts">
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { ref } from "vue";

const mockData = [
  {
    name: "薩爾達傳說 織夢島",
    price: 900,
    date: "2022-10-10T12:34:56.000Z",
  },
  {
    name: "動物森友會",
    price: 1000,
    date: "2022-10-09T13:00:00.000Z",
  },
];

const dayjs = useDayjs();

const columns = [
  { accessorKey: "name", label: "遊戲名稱" },
  { accessorKey: "price", label: "價格" },
  { accessorKey: "date", label: "時間", accessorFn: (row) => dayjs(row.date).format("YYYY-MM-DD HH:mm:ss") },
];

const data = ref(mockData);
const table = useVueTable({
  get data() {
    return data.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
});
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
