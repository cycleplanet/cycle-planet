<template>
  <q-card-section class="row q-pa-sm bg-amber" style="max-height: 50px;">
    <q-btn flat round dense v-close-popup icon="west" />
    <div class="text-h6"><slot></slot></div>
  </q-card-section>
</template>

<script>
export default {};
</script>

<style></style>
