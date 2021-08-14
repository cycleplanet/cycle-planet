<template>
  <q-layout view="hHh Lpr lff" container class="shadow-2 rounded-borders">
    <q-header class="text-black">
      <mobile-header>Edit profile</mobile-header>
    </q-header>

    <q-page-container class="no-padding">
      <div class="bg-white" style="margin-bottom: 50px;">
        <q-item class="bg-secondary text-white cp-h2">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>

          <q-item-section>About</q-item-section>
        </q-item>

        <edit-about :userData.sync="userData" />

        <q-item class="bg-secondary text-white cp-h2 q-mt-md">
          <q-item-section avatar>
            <q-icon name="bed" />
          </q-item-section>

          <q-item-section>Hosting</q-item-section>
        </q-item>
        <edit-hosting :userData.sync="userData" />

        <q-item class="bg-secondary text-white cp-h2 q-mt-md">
          <q-item-section avatar>
            <q-icon name="share" />
          </q-item-section>

          <q-item-section>Social profiles</q-item-section>
        </q-item>
        <edit-social :userData.sync="userData" />

        <q-item class="bg-secondary text-white cp-h2 q-mt-md">
          <q-item-section avatar>
            <q-icon name="fingerprint" />
          </q-item-section>

          <q-item-section>Account details</q-item-section>
        </q-item>
        <edit-account :userData.sync="userData" />
      </div>
    </q-page-container>

    <q-footer class="bg-white">
      <q-separator></q-separator>
      <q-toolbar bordered>
        <q-space />
        <q-btn :style="buttonStyle" label="Save" @click="editProfileSubmit" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  // props:['userId'],

  data() {
    return {};
  },

  components: {
    "edit-about": require("components/Profile/EditTabs/About.vue").default,
    "edit-social": require("components/Profile/EditTabs/Social.vue").default,
    "edit-hosting": require("components/Profile/EditTabs/Hosting.vue").default,
    "edit-account": require("components/Profile/EditTabs/Account.vue").default,
  },
  computed: {
    userId() {
      return this.$route.params.otherUserId;
    },
    userData() {
      return this.users[this.userId];
    },
  },
  methods: {
    editProfileSubmit() {
      this.updateItemAction({
        data: this.userData,
        path: "Users/" + this.userId,
      });
      this.$emit("close");
    },
  },
};
</script>

<style></style>
