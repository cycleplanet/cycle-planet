<template>
  <q-page>
    <country-page :countryKey="countryKey" />
  </q-page>
</template>

<script>
export default {
  components: {
    "country-page": require("components/Country/CountryPage.vue").default,
  },

  computed: {
    countryKey() {
      return this.$route.params.countryKey;
    },
  },
};
</script>

<style></style>
