<template>
  <div>
    <div class="q-pa-md">
      <q-card class="q-pa-md">
        <p class="text-h4">Thanks a lot {{ myUserDetails.fullname }}!</p>
        <p class="text-body1">
          With your support we can make this platform even better! May the winds
          be with you ;)
        </p>
      </q-card>
    </div>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
};
</script>

<style></style>
