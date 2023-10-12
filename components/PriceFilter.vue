<script setup lang="ts">
import { Filter } from "~/types";
import { Database } from "~/types/supabase";

const props = defineProps<{
  games: Pick<Database["public"]["Tables"]["Game"]["Row"], "id" | "name" | "platform">[] | null;
  modelValue: Filter;
}>();
const emits = defineEmits(["update:modelValue"]);

const search = ref("");
const shortcuts = ["薩爾達傳說 王國之淚", "瑪利歐賽車8豪華版", "斯普拉遁3"];

function updateFilterBySearch() {
  const game_id = props.games?.find(({ name }) => name === search.value)?.id;
  if (game_id) {
    emits("update:modelValue", { ...props.modelValue, game_id, name: undefined });
  } else {
    emits("update:modelValue", { ...props.modelValue, game_id: undefined, name: search.value });
  }
}

watchDebounced(search, updateFilterBySearch, { debounce: 300 });
</script>

<template>
  <div class="flex flex-nowrap gap-4 justify-end sm:justify-start">
    <div class="form-control w-full gap-2">
      <div class="join">
        <input
          v-model="search"
          type="text"
          placeholder="搜尋遊戲名稱"
          class="input input-bordered w-full join-item"
          list="games"
        />
        <label for="filter-drawer" class="drawer-button btn btn-md btn-primary join-item">
          <Icon name="ion:funnel" class="h-4 w-4" />
        </label>
        <!-- <button class="btn btn-md btn-info join-item">
          <Icon name="ion:funnel" class="h-4 w-4" />
        </button> -->
      </div>
      <datalist id="games">
        <option v-if="!games" disabled>Loading...</option>
        <option v-for="{ id, name } in games" v-else :key="id" :value="name" />
      </datalist>
      <label class="label">
        <div class="label-text-alt flex items-center overflow-auto pb-2">
          <span class="text-sm whitespace-nowrap">搜搜看：</span>
          <button
            v-for="s in shortcuts"
            :key="s"
            class="btn btn-xs text-xs sm:btn-sm sm:text-sm btn-info mr-1.5 sm:mr-3"
            @click="search = s"
          >
            {{ s }}
          </button>
        </div>
      </label>
    </div>
  </div>
</template>
