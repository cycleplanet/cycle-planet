<template>
  <div>{{ cityCountry }}</div>
</template>

<script>
export default {
  props: ["lat", "lng"],
  data() {
    return {
      cityCountry: "",
    };
  },
  computed: {
    userCountry() {
      let apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.lat}&lon=${this.lng}&accept-language=en`;
      this.$axios
        .get(apiUrl)
        .then((result) => {
          let city = result.data.address.village;
          let countryuser = result.data.address.country;
          this.cityCountry = city + ", " + countryuser;
        })
        .catch((err) => {});
    },
  },
  mounted() {
    this.userCountry;
  },
};
</script>

<style></style>
