<template>
  <div>
    <q-item
      class="no-padding"
      dense
      clickable
      v-ripple
      @click="$emit('markerclick')"
    >
      <q-item-section class="text-bold">
        <q-item-label class="text-overline">{{
          markerlist[refKey].title
        }}</q-item-label>
        <q-item-label class="text-h6">{{ singleItemData.title }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item class="no-padding">
      <q-item-section>
        <q-item-label
          lines="2"
          v-html-safe="
            singleItemData.description
              ? singleItemData.description
              : 'There is no description yet.'
          "
        ></q-item-label>
      </q-item-section>
    </q-item>
    <q-item class="no-padding row flex items-center" dense>
      <like-item :singleItemData="singleItemData" />
      <div class="row">
        <q-btn
          dense
          flat
          @click="
            isWebApp
              ? openUrl(
                  'https://www.openstreetmap.org/#map=19/' +
                    singleItemData.coordinates.lat +
                    '/' +
                    singleItemData.coordinates.lng
                )
              : openMapUrl(
                  singleItemData.coordinates.lat,
                  singleItemData.coordinates.lng
                )
          "
        >
          <q-icon left name="get_app" />
        </q-btn>
      </div>
      <div class="underline-hover cursor-pointer" @click="$emit('markerclick')">
        View more
      </div>
    </q-item>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import Vue from 'vue';
import VueSecureHTML from 'vue-html-secure';

Vue.use(VueSecureHTML);

export default {
  mixins: [mixinGeneral],
  props: ["singleItemData"],
  components: {
    "like-item": require("components/Shared/Modals/LikeMarker.vue").default,
  },

  computed: {
    refKey() {
      return this.singleItemData.refKey;
    },
    itemKey() {
      return this.singleItemData.itemKey;
    },
    countryKey() {
      return this.singleItemData.countryKey;
    },
  },
};
</script>

<style></style>
