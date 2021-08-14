<template>
  <div>
    <q-card
      class="no-padding bg-white"
      style="max-width: 600px;"
      v-if="singleItemData"
    >
      <modal-header
        >Detailed
        {{ markerlist[singleItemData.refKey].title }} information</modal-header
      >
      <item-page :singleItemData="singleItemData" />
    </q-card>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  props: ["singleItemData"],
  mixins: [mixinGeneral],

  components: {
    "item-page": require("components/Marker/ItemPage.vue").default,
  },
};
</script>
