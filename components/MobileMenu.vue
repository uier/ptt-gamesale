<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const router = useRouter();
function navigate(path: string) {
  router.push(path);
}

const props = defineProps<{
  isDark: boolean;
}>();
const emit = defineEmits(["toggle-dark"]);
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="btn btn-md btn-circle btn-ghost">
        <Icon name="ion:menu" class="h-6 w-6" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="z-50 absolute right-0 mt-2 w-36 origin-top-right rounded-md divide-y divide-neutral-content bg-base-100 shadow-lg focus:outline-none"
      >
        <div class="p-1">
          <MenuItem v-slot="{ active }" as="div">
            <button :class="[active && 'btn-active', 'btn btn-ghost']" @click="navigate('/')">Latest</button>
          </MenuItem>
          <MenuItem v-slot="{ active }" as="div">
            <button :class="[active && 'btn-active', 'btn btn-ghost']" @click="navigate('/history')">
              History
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }" as="div">
            <button :class="[active && 'btn-active', 'btn btn-ghost']" @click="navigate('/about')">
              About
            </button>
          </MenuItem>
        </div>
        <div class="p-1">
          <MenuItem as="div">
            <button class="btn btn-ghost" @click="emit('toggle-dark')">
              {{ props.isDark ? "Light Mode" : "Dark Mode" }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
