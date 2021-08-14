<template>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="how_to_reg" :style="buttonStyle" text-color="white" />
      <span class="q-ml-sm">You need to login to continue</span>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancel" :style="buttonStyle" v-close-popup />
      <q-btn label="Log in" :style="buttonStyle" to="/auth" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {};
</script>

<style></style>
