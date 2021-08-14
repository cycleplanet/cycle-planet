<template>
  <q-card-section class="row q-pa-sm bg-amber">
    <div class="text-h6"><slot></slot></div>
    <q-space />
    <q-btn flat round dense v-close-popup icon="close" />
  </q-card-section>
</template>

<script>
export default {};
</script>

<style></style>
