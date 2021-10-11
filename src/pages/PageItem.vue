<template>
  <div>
    <q-card v-if="landMarkers[itemKey]">
      <item-page :singleItemData="landMarkers[itemKey]" />
    </q-card>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [mixinGeneral],
  data(){
    return{
    }
  },
  computed: {
    itemKey() {
      return this.$route.params.itemKey;
    },
  },
  components: {
    "item-page": require("components/Marker/ItemPage.vue").default,
  },
 
  methods: {
    ...mapActions("markers", ["loadSinglePoi"]),
  },
  created() {
    console.log('created');
      this.loadSinglePoi(this.$route.params.itemKey);
  },
};
</script>
