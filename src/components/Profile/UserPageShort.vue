<template>
  <div class="constrain bg-white" v-if="userData">
    <modal-header>User profile</modal-header>

    <div class="q-pa-md text-center">
      <q-avatar style="margin-top: 10px;" size="140px" class="">
        <img :src="userData.imageurl" style="border: 2px solid white;" />
      </q-avatar>
      <div>
        <div class="text-h4 no-margin">{{ userData.fullname }}</div>

        <q-chip
          outline
          :color="
            userData.hosting.status === 'Touring'
              ? 'primary'
              : userData.hosting.status === 'Available for hosting'
              ? 'red'
              : 'grey'
          "
        >
          <q-avatar>
            <img :src="markerlist[userData.hosting.status].iconurl" />
          </q-avatar>
          {{ userData.hosting.status }}
        </q-chip>
      </div>

      <q-btn
        class="q-my-md"
        :style="buttonStyle"
        v-if="loggedIn && userData.userId !== myUserId"
        label="Send host request"
        @click="hostRequestDialog = true"
      />
    </div>

    <div class="q-mt-xs q-pa-md" v-if="loggedIn">
      <short-tab :userId="userId" :userData="userData" />
      <hosting-tab :userId="userId" :userData="userData" />
    </div>
    <div
      class="justify-center flex q-my-lg"
      style="padding-bottom: 50px;"
      v-if="!loggedIn"
    >
      You need to login to see more information
    </div>

    <q-dialog v-model="hostRequestDialog" :maximized="!isWebApp">
      <host-request :otherUserId="userId" @close="hostRequestDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["userData"],
  data() {
    return {
      hostRequestDialog: false,
    };
  },

  components: {
    "short-tab": require("components/Profile/Tabs/ShortTab.vue").default,

    "hosting-tab": require("components/Profile/Tabs/HostingTab.vue").default,
    "host-request": require("components/Chat/HostRequestDialog.vue").default,
  },

  computed: {
    userId() {
      return this.userData.userId;
    },
  },
};
</script>
<style></style>
