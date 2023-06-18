<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 h-screen">
    <div class="py-4 flex justify-between items-center">
      <h1 class="text-3xl font-bold tracking-tighter">PTT Gamesale Tracker</h1>
      <button class="btn btn-sm btn-ghost sm:hidden"><Icon name="ion:menu" class="h-6 w-6" /></button>
      <div class="hidden sm:flex divide-gray-500 divide-x">
        <NuxtLink to="/" class="hover:link px-4">Latest</NuxtLink>
        <NuxtLink to="/history" class="hover:link px-4">History</NuxtLink>
        <NuxtLink to="/about" class="hover:link px-4">About</NuxtLink>
      </div>
    </div>

    <div class="my-8" />

    <slot />
  </div>
</template>
