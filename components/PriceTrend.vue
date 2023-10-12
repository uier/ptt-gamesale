<script setup lang="ts">
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { CONDITIONS } from "~/types/constants";
import { Price } from "~/types";

use([TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer, UniversalTransition]);

const props = defineProps<{
  data: Price[] | null;
}>();

const option = computed(() => {
  return (
    props.data && {
      tooltip: { trigger: "axis" },
      legend: { show: true },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true,
      },
      xAxis: { type: "time" },
      yAxis: { type: "value" },
      series: [
        {
          name: "二手",
          type: "line",
          data: props.data
            .filter(({ condition }) => condition === CONDITIONS.USED)
            .map(({ price, posted_at }) => [+new Date(posted_at || ""), price]),
          symbol: "circle",
          smooth: 0.2,
        },
        {
          name: "全新",
          type: "line",
          data: props.data
            .filter(({ condition }) => condition === CONDITIONS.NEW)
            .map(({ price, posted_at }) => [+new Date(posted_at || ""), price]),
          symbol: "circle",
          smooth: 0.2,
        },
      ],
    }
  );
});
</script>

<template>
  <div class="h-[300px]">
    <v-chart :option="option" autoresize />
  </div>
</template>
