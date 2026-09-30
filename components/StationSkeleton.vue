<template>
  <div v-for="n in 6" :key="n" class="panel rounded-2xl p-5" aria-hidden="true"><div class="mb-5 flex gap-3"><div class="skeleton h-12 w-12 rounded-2xl"/><div class="flex-1 space-y-2"><div class="skeleton h-4 w-2/3 rounded"/><div class="skeleton h-3 w-1/2 rounded"/></div></div><div class="skeleton mb-4 h-5 w-1/2 rounded"/><div class="skeleton mb-5 h-12 rounded"/><div class="skeleton mb-3 h-4 rounded"/><div class="skeleton h-11 rounded-xl"/></div>
</template>
