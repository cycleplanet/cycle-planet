<template>
  <div class="">
    <q-separator></q-separator>
    <div class="q-pa-xs q-mt-sm row vertical-middle">
      <q-btn flat dense @click="itemDialog = true">Show more</q-btn>
      <q-space></q-space>

      <like-item :singleItemData="landMarkers[itemKey]" />
    </div>

    <q-dialog v-model="itemDialog">
      <item-dialog
        :singleItemData="singleItemData"
        @close="itemDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["singleItemData"],

  data() {
    return {
      itemDialog: false,
    };
  },

  components: {
    "item-dialog": require("components/Marker/ItemDialog.vue").default,
    // 'item-dialog': require('components/Country/Modals/ItemDialog.vue').default,
    "like-item": require("components/Shared/Modals/LikeMarker.vue").default,
  },
  computed: {
    refKey() {
      return this.singleItemData.refKey;
    },
    countryKey() {
      return this.singleItemData.countryKey;
    },
    itemKey() {
      return this.singleItemData.itemKey;
    },
  },

  methods: {},
};
</script>

<style></style>
