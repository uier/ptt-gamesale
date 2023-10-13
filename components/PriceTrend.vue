<script setup lang="ts">
import { use, ECElementEvent } from "echarts/core";
import VChart from "vue-echarts";
import { TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { CONDITIONS } from "~/types/constants";
import { Trend } from "~/types";
import { z } from "zod";

use([TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer, UniversalTransition]);

const props = defineProps<{
  data: Trend[];
}>();

const option = computed(() => {
  return {
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
          .map(({ price, posted_at, ptt_article_id }) => [+new Date(posted_at || ""), price, ptt_article_id]),
        symbol: "circle",
        smooth: 0.2,
      },
      {
        name: "全新",
        type: "line",
        data: props.data
          .filter(({ condition }) => condition === CONDITIONS.NEW)
          .map(({ price, posted_at, ptt_article_id }) => [+new Date(posted_at || ""), price, ptt_article_id]),
        symbol: "circle",
        smooth: 0.2,
      },
    ],
  };
});

function handleClick(args: ECElementEvent) {
  const articleId = z.string().safeParse((args.data as any[])[2]);
  if (articleId.success) {
    window.open(`https://www.ptt.cc/bbs/Gamesale/${articleId.data}.html`, "_blank", "noopener noreferrer");
  }
}
</script>

<template>
  <div class="h-[300px]">
    <v-chart :option="option" autoresize @click="handleClick" />
  </div>
</template>
