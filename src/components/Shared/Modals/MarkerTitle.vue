<template>
  <div>
    <div>{{ itemtitle }}</div>
  </div>
</template>

<script>
export default {
  props: ["singleItemData"],
  data() {
    return {};
  },

  computed: {
    itemtitle() {
      if (this.singleItemData.refKey === "Border_item") {
        return (
          this.singleItemData.country1.country +
          " (" +
          this.singleItemData.country1.city +
          ") - " +
          this.singleItemData.country2.country +
          " (" +
          this.singleItemData.country2.city +
          ")"
        );
      } else if (this.singleItemData.refKey === "Embassy") {
        if (this.singleItemData.onlineVisa) {
          return " E-visa for " + this.singleItemData.countryKey;
        } else {
          return (
            " Embassy for " +
            this.singleItemData.countryKey +
            " in " +
            this.singleItemData.country_located +
            " (" +
            this.singleItemData.city +
            ")"
          );
        }
      } else {
        return this.singleItemData.title;
      }
    },
  },
};
</script>

<style></style>
