<template>
  <div>
    <map-all
      :style="
        isWebApp
          ? 'height:' + (screenInnerHeight - 85) + 'px'
          : 'height:' + (screenInnerHeight - 135) + 'px'
      "
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import mixinGeneralNew from "src/mixins/mixin-general.js";
import FCM from "cordova-plugin-fcm-with-dependecy-updated";

export default {
  mixins: [mixinGeneralNew],
  data() {
    return {
      editProfileForm: false,
      loginRequest: false,
    };
  },
  components: {
    "map-all": require("components/Map/Map.vue").default,
  },

  methods: {
    ...mapActions("auth", ["firebaseUpdateToken"]),

    async getTokenData() {
      let notficationPermission = await FCM.requestPushPermission();
      if (notficationPermission) {
        if (this.loggedIn) {
          const fcmToken = await FCM.getToken();
          this.updateUserToken(fcmToken, this.myUserId);
        }
      } else {
        let permission = getPermission();
        if (permission) {
          if (this.loggedIn) {
            const fcmToken = await FCM.getToken();
            this.updateUserToken(fcmToken, this.myUserId);
          }
        }
      }
    },
    async getPermission() {
      let permission = await FCM.requestPushPermission();
      return permission;
    },
    updateUserToken(fcmToken, userid) {
      this.firebaseUpdateToken({
        userId: userid,
        updates: {
          token: fcmToken,
        },
      });
    },
    clickLogin() {
      this.$router.push("/auth");
    },
  },
  created() {},
  mounted() {
    document.addEventListener(
      "deviceready",
      () => {
        this.getTokenData();
      },
      false
    );
  },
};
</script>
