<template>
  <div
    @click="clickuser"
    clickable
    class="cursor-pointer row items-center"
    v-if="users"
  >
    <q-avatar size="sm" class="q-mx-sm">
      <img :src="users[userIdChecked].imageurl" />
    </q-avatar>
    <div class="underline-hover">{{ users[userIdChecked].fullname }}</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  props: ["userId"],
  computed: {
    ...mapGetters("auth", ["users"]),
    userIdChecked() {
      if (this.users[this.userId]) {
        return this.userId;
      } else {
        return "RYFRjpH3DfdWPpRfG9MIFBSPzH33";
      }
    },
  },
  methods: {
    clickuser() {
      this.$router.push("/user/" + this.userId);
    },
  },
};
</script>

<style></style>
