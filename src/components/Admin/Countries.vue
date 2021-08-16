<template>
  <div>
    <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Countries (' + Object.keys(countryConstants).length + ')'"
    >
      <q-card class="q-my-md q-pa-md">
        <q-list bordered>
          <q-item
            clickable
            v-ripple
            v-for="(country, countrykey) in allCountryData"
            class="row"
            :key="countrykey"
            :class="
              getCountryDataByName(countrykey) ? 'bg-green-2' : 'bg-red-2'
            "
          >
            <q-item-section>{{ countrykey }}</q-item-section>
            <q-item-section>{{
              getCountryDataByName(countrykey)
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import {
  countryConstants,
  getCountryData,
  getCountryDataByName
} from "app/firebase-functions/shared/src/country-constants.js";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      countryConstants: countryConstants,
      getCountryData: getCountryData,
      getCountryDataByName: getCountryDataByName
    };
  },
  computed: {}
};
</script>

<style></style>
