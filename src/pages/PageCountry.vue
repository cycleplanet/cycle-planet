<template>
  <div>
    <country-page :countryKey="countryKey" />
  </div>
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
