<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>
<template>
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #0b120d;
      padding: 80px;
      color: #f4f7f2;
      font-family: 'Avtofakt Sans';
    "
  >
    <div
      style="
        display: flex;
        color: #b4f36a;
        font-size: 30px;
        margin-bottom: 50px;
      "
    >
      АВТОФАКТ / ЭНЕРГИЯ ДЛЯ ДВИЖЕНИЯ
    </div>
    <div
      style="
        display: flex;
        font-size: 68px;
        line-height: 1.12;
        font-weight: 700;
      "
    >
      {{ title }}
    </div>
    <div
      style="display: flex; font-size: 25px; color: #b4c0b7; margin-top: 30px"
    >
      {{ description }}
    </div>
    <div
      style="display: flex; color: #b4f36a; font-size: 25px; margin-top: 45px"
    >
      avtofakt.by · Беларусь
    </div>
  </div>
</template>
