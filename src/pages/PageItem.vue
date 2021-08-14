<template>
  <div>
    <q-card>
      <item-page :singleItemData="landMarkers[itemKey]" />
    </q-card>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapActions } from "vuex";

export default {
  mixins: [mixinGeneral],
  computed: {
    itemKey() {
      return this.$route.params.itemKey;
    },
  },
  components: {
    "item-page": require("components/Marker/ItemPage.vue").default,
  },
  methods: {
    ...mapActions("markers", ["getAllLandMarkersFs"]),
  },
  created() {
    if (!this.landMarkers) {
      this.getAllLandMarkersFs();
    }
  },
};
</script>
