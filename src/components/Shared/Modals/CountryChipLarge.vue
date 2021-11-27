<template>
  <div :style="screenwidthbig ? 'padding:2px' : 'padding:1px'">
    <q-chip
      :size="screenwidthbig ? '15px' : '12px'"
      clickable
      outline
      class="text-subtitle1"
    >
      <q-avatar
        rounded
        style="width: auto;"
        class=""
        clickable
        @click="clickedcountry(countryKey)"
      >
        <img
          style="border: 1px solid black; margin-left: -1px;"
          :src="countryImageSrc"
        />
      </q-avatar>
      <div clickable @click="clickedcountry(countryKey)">{{ countryKey }}</div>
    </q-chip>
  </div>
</template>

<script>
import { getCountryDataByName } from "app/firebase-functions/shared/src/country-constants.js";

export default {
  props: ["countryKey"],
  data() {
    return {};
  },
  computed: {
    countryImageSrc() {
      return 'countryflagsnew/' + getCountryDataByName(this.countryKey).iso2.toLowerCase() + '.svg';
    },

    screenwidthbig() {
      let screenWidth = screen.width;
      if (screenWidth < 768) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    clickedcountry(countryKey) {
      this.$router.push("/country/" + countryKey);
    },
  },
};
</script>

<style></style>
