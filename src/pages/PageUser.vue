<template>
  <div>
    <user-page :userData="loggedInUser" />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("auth", ["loggedInUser"]),

    userId() {
      return this.$route.params.otherUserId;
    },
  },

  components: {
    "user-page": require("components/Profile/UserPage.vue").default,
  },
};
</script>

<style></style>
