<template>
  <div>
    <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Markers (' + Object.keys(landMarkers).length + ')'"
    >
      <div>The markers are sorted by date (newest first)</div>

      <q-card class="q-my-md q-pa-md">
        <div v-for="(item, itemKey) in landMarkersSorted" :key="itemKey">
          <!-- {{item}} -->
          <q-expansion-item
            expand-separator
            :label="
              item.refKey === 'Border_item'
                ? item.country1.country + ' - ' + item.country2.country
                : item.refKey === 'Embassy'
                ? 'visa ' + item.countryKey + ' - ' + item.country_located
                : item.title
            "
            :caption="markerlist[item.refKey].title"
            :class="
              item.coordinates &&
              (item.refKey === 'Border_item' ? true : item.countryKey)
                ? 'bg-green-2 text-green-10'
                : 'bg-red-2 text-red-10'
            "
          >
            <div class="bg-white text-black">
              <div>
                <div class="row flex items-center">
                  by <username-avatar :userId="item.user_created" />
                </div>
                <div class="text-h6">Checks</div>
                <div>Has coordinates:{{ item.coordinates ? true : false }}</div>
                <div>
                  Country name correct?:{{
                    (item.refKey === "Border_item" ? true : item.countryKey)
                      ? true
                      : false
                  }}
                </div>

                <div
                  v-if="
                    item.refKey === 'Border_item' ? false : !item.countryKey
                  "
                >
                  <q-select
                    filled
                    :options="countryKeys"
                    v-model="changeCountryKey"
                    behavior="menu"
                  />
                  <q-btn
                    @click="changeMarkerCountry(item.itemKey, changeCountryKey)"
                    label="save"
                  />
                </div>
              </div>
              <q-separator></q-separator>
              <div class="row">
                <div class="text-h6">Data</div>
              </div>

              <div
                v-for="(childitem, childitemKey) in item"
                :key="childitemKey"
                class="q-ma-sm"
              >
                <div>
                  <b>{{ childitemKey }}:</b>{{ childitem }}
                </div>
              </div>
            </div>
          </q-expansion-item>
        </div>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";
import { firebase } from "boot/config";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      changeCountryKey: "",
    };
  },
  computed: {
    ...mapGetters("markers", ["landMarkersSorted"]),
  },
  methods: {
    changeMarkerCountry(itemKey, countryKey) {
      firebase.fs
        .collection("Markers")
        .doc(itemKey)
        .update({ countryKey: countryKey });
      this.changeCountryKey = "";
    },
  },
};
</script>

<style></style>
