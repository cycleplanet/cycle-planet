<template>
  <div style="min-height: 500px;">
    <q-select
      outlined
      v-model="countrySelected"
      :options="mySelectedCountriesComputed"
      label="Select country"
      class="q-mb-md bg-white"
    />

    <div v-if="countrySelected">
      <country-page :countryKey="countrySelected" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["mySelectedCountriesComputed"],

  data() {
    return {
      countrySelected: null,
    };
  },
  components: {
    "country-page": require("components/Country/CountryPage.vue").default,
  },
};
</script>

<style></style>
