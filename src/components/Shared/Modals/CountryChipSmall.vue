<template>
  <div>
    <q-chip
      :size="screenwidthbig ? '10px' : '8px'"
      clickable
      class="text-subtitle1 no-padding"
    >
      <q-avatar
        style="width: auto;"
        clickable
        @click="clickedcountry(countryKey)"
      >
        <img
          style="margin-left: -1px;"
          :src="countryImageSrc"
        />
      </q-avatar>
      <div clickable @click="clickedcountry(countryKey)">{{ countryKey }}</div>
    </q-chip>
  </div>
</template>

<script>
import { getCountryDataByName } from "app/firebase-functions/shared/src/country-constants";

export default {
  props: ["countryKey"],
  data() {
    return {};
  },
  computed: {
    countryImageSrc() {
      return "countryflagsnew/" + getCountryDataByName(this.countryKey).iso2.toLowerCase() + ".svg";
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
