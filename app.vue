<template>
  <NuxtLoadingIndicator color="#b4f36a" /><NuxtLayout
    ><NuxtPage :page-key="(route) => route.fullPath"
  /></NuxtLayout>
</template>
