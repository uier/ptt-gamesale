<script setup lang="ts">
import { Filter } from "~/types";
import { Database } from "~/types/supabase";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { CONDITIONS, TRADE_TYPES } from "~/types/constants";

const props = defineProps<{
  games: Pick<Database["public"]["Tables"]["Game"]["Row"], "id" | "name" | "platform">[] | null;
  modelValue: Filter;
}>();
const emits = defineEmits(["update:modelValue"]);

const search = ref("");
const shortcuts = ["薩爾達傳說 王國之淚", "瑪利歐賽車8 豪華版", "斯普拉遁3"];

function updateFilterBySearch() {
  const text = search.value.trim();
  if (text === "") {
    emits("update:modelValue", { ...props.modelValue, game_id: undefined, name: undefined });
    return;
  }
  const game_id = props.games?.find(({ name }) => name === text)?.id;
  if (game_id != null) {
    emits("update:modelValue", { ...props.modelValue, game_id, name: undefined });
  } else {
    emits("update:modelValue", { ...props.modelValue, game_id: undefined, name: text });
  }
}

watchDebounced(search, updateFilterBySearch, { debounce: 300 });

const conditionOptions = [
  { label: "不拘", value: null },
  { label: "全新", value: CONDITIONS.NEW },
  { label: "二手", value: CONDITIONS.USED },
];
const platformOptions = [
  { label: "NS", value: "NS" },
  { label: "PS4", value: "PS4" },
  { label: "PS5", value: "PS5" },
];
const tradeTypeOptions = [
  { label: "不拘", value: null },
  { label: "售", value: TRADE_TYPES.SELL },
  { label: "徵", value: TRADE_TYPES.BUY },
];

function getButtonClass(active: boolean) {
  return ["btn", "btn-info", "join-item", { "btn-outline": !active }];
}
function updateCondition(condition: Filter["condition"]) {
  emits("update:modelValue", { ...props.modelValue, condition });
}
function updatePlatform(platform: Filter["platform"][number]) {
  const platformIndex = props.modelValue.platform.indexOf(platform);
  if (platformIndex > -1) {
    emits("update:modelValue", {
      ...props.modelValue,
      platform: [...props.modelValue.platform.filter((p) => p !== platform)],
    });
  } else {
    emits("update:modelValue", { ...props.modelValue, platform: [...props.modelValue.platform, platform] });
  }
}
function updateTradeType(trade_type: Filter["trade_type"]) {
  emits("update:modelValue", { ...props.modelValue, trade_type });
}
</script>

<template>
  <div class="gap-4 justify-end sm:justify-start">
    <div class="form-control w-full gap-2">
      <div class="join">
        <input
          v-model="search"
          type="text"
          placeholder="搜尋遊戲名稱"
          class="input input-bordered w-full join-item"
          list="games"
        />
        <Popover class="relative">
          <PopoverButton
            class="btn btn-md btn-accent join-item"
            style="border-top-right-radius: 0.5rem; border-bottom-right-radius: 0.5rem"
          >
            <Icon name="ion:funnel" class="h-4 w-4" />
          </PopoverButton>
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
          >
            <PopoverPanel
              class="absolute z-10 mt-3 w-screen max-w-sm -translate-x-[80%] transform px-4 sm:px-0"
            >
              <div class="overflow-hidden rounded-lg shadow-lg ring-0">
                <div class="relative bg-base-200 p-6 flex flex-col gap-3">
                  <h3 class="text-lg font-medium">篩選器</h3>
                  <div>
                    <div>類型</div>
                    <div class="join">
                      <button
                        v-for="{ label, value } in tradeTypeOptions"
                        :key="label"
                        :class="getButtonClass(modelValue.trade_type === value)"
                        @click="updateTradeType(value)"
                      >
                        {{ label }}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div>平台</div>
                    <div class="join">
                      <button
                        v-for="{ label, value } in platformOptions"
                        :key="label"
                        :class="getButtonClass(modelValue.platform.includes(value))"
                        @click="updatePlatform(value)"
                      >
                        {{ label }}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div>品況</div>
                    <div class="join">
                      <button
                        v-for="{ label, value } in conditionOptions"
                        :key="label"
                        :class="getButtonClass(modelValue.condition === value)"
                        @click="updateCondition(value)"
                      >
                        {{ label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </div>
      <datalist id="games">
        <option v-if="!games" disabled>Loading...</option>
        <option v-for="{ id, name } in games" v-else :key="id" :value="name" />
      </datalist>
      <label class="label">
        <div class="label-text-alt flex items-center overflow-auto">
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
