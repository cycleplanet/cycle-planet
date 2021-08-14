<template>
  <q-page class="bg-grey-3">
    <q-toolbar
      class="bg-secondary"
      :class="
        screenwidthbig ? (flexlist ? 'flexwidth' : 'solidwidth') : 'mobilewidth'
      "
    >
      <q-btn
        icon="arrow_back"
        flat
        dense
        clickable
        v-go-back.single
        v-if="!screenwidthbig"
      />
      <div @click="clickuser(userId)" class="row items-center">
        <q-avatar v-if="myUserDetails">
          <img :src="users[userId].imageurl" />
        </q-avatar>
        <q-toolbar-title>{{ users[userId].fullname }}</q-toolbar-title>
      </div>
      <q-space></q-space>
      <q-btn flat round icon="more_vert">
        <q-menu anchor="top right" self="top left">
          <q-item clickable v-if="checkIfRequestWasSendRecently === 0">
            <q-item-section @click="hostRequestMethod"
              >Send host request</q-item-section
            >
          </q-item>
          <q-item clickable v-if="users[userId].coordinates">
            <q-item-section
              @click="
                isWebApp
                  ? openUrl(
                      'https://www.openstreetmap.org/#map=19/' +
                        users[userId].coordinates.lat +
                        '/' +
                        users[userId].coordinates.lng
                    )
                  : openMapUrl(
                      users[userId].coordinates.lat,
                      users[userId].coordinates.lng
                    )
              "
              >Get location</q-item-section
            >
          </q-item>
          <q-item clickable v-if="users[userId].phonenumber">
            <q-item-section @click="clickPhonenumber">{{
              users[userId].phonenumber
            }}</q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <q-toolbar
      class="bg-white bottom0"
      :class="
        screenwidthbig ? (flexlist ? 'flexwidth' : 'solidwidth') : 'mobilewidth'
      "
    >
      <q-form class="full-width">
        <q-input
          v-if="isWebApp"
          v-model="newMessage"
          bg-color="white"
          ref="newMessage"
          outlined
          autogrow
          rounded
          label="Message"
          dense
        >
          <template v-slot:after>
            <q-btn
              flat
              round
              dense
              @click="sendMessage"
              type="submit"
              icon="send"
            />
          </template>
        </q-input>
        <q-input
          v-if="!isWebApp"
          v-model="newMessage"
          bg-color="white"
          ref="newMessage"
          outlined
          autogrow
          rounded
          label="Message"
          dense
        >
          <template v-slot:after>
            <q-btn
              flat
              round
              dense
              @click="sendMessage"
              type="submit"
              icon="send"
            />
          </template>
        </q-input>
      </q-form>
    </q-toolbar>

    <div class="q-pa-sm" style="padding-bottom: 50px;">
      <q-page-container ref="pageChat">
        <div v-if="messages">
          <div v-for="(message, key) in messages" :key="key" class="q-message">
            <single-message :messageItem="message" :key="key" />
          </div>
        </div>
        <div
          v-else
          class="justify-center flex"
          @click="hostRequestDialog = true"
        >
          <q-btn :style="buttonStyle">Send host request</q-btn>
        </div>
      </q-page-container>
    </div>

    <q-dialog v-model="hostRequestDialog" :maximized="!isWebApp">
      <host-request :otherUserId="userId" @close="hostRequestDialog = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";
import { uid, Notify } from "quasar";
import FCM from "cordova-plugin-fcm-with-dependecy-updated";

export default {
  mixins: [mixinGeneral],
  // props:['userId','messages'],
  data() {
    return {
      newMessage: "",
      showMessages: false,
      hostRequestDialog: false,
    };
  },
  components: {
    "host-request": require("components/Chat/HostRequestDialog.vue").default,
    "single-message": require("components/Chat/SingleMessage.vue").default,
  },
  computed: {
    ...mapGetters("chat", ["unreadchatlistnew", "userMessagesSortedByDate"]),

    userId() {
      return this.$route.params.otherUserId;
    },
    messages() {
      return this.userMessagesSortedByDate[this.userId];
    },
    flexlist() {
      let screenWidth = screen.width;
      if (screenWidth < 975) {
        return true;
      } else {
        return false;
      }
    },
    checkIfRequestWasSendRecently() {
      let x = 0;
      if (this.users[this.myUserId].hosting.requests) {
        let myRequests = Object.keys(
          this.users[this.myUserId].hosting.requests
        );
        myRequests.forEach((element) => {
          if (
            this.users[this.myUserId].hosting.requests[element].receiver ===
            this.userId
          ) {
            x = 10;
          }
        });
      }

      return x;
    },
  },

  methods: {
    ...mapActions("chat", [
      "firebaseGetMessages",
      "firebaseReadMessages",
      "firebaseStopGettingMessages",
      "firebaseSendMessage",
    ]),
    sendMessage() {
      this.firebaseSendMessage({
        message: {
          read: true,
          text: this.newMessage,
          from: "me",
        },
        otherUserId: this.userId,
        senderName: this.myUserDetails.fullname,
      });

      this.clearMessage();
    },
    clickPhonenumber() {
      this.openUrl(
        "https://api.whatsapp.com/send?phone=" +
          this.users[this.userId].phonenumber
      );
    },
    clearMessage() {
      this.newMessage = "";
      this.$refs.newMessage.focus();
    },
    scrollToBottom() {
      let pageChat = this.$refs.pageChat.$el;

      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight);
      }, 20);
    },
    hostRequestMethod() {
      this.hostRequestDialog = true;
    },
  },

  watch: {
    // the watch is triggered after each message
    messages: function (val) {
      if (Object.keys(val).length) {
        this.scrollToBottom();
        setTimeout(() => {
          this.showMessages = true;
        }, 200);
      }
    },
  },
  created() {},
  async mounted() {
    this.firebaseGetMessages(this.$route.params.otherUserId);
    this.firebaseReadMessages(this.$route.params.otherUserId);
    this.scrollToBottom();
  },

  destroyed() {
    this.firebaseStopGettingMessages();
  },
};
</script>

<style>
.flexwidth {
  position: fixed;
  width: 66.7%;
  z-index: 1;
}
.solidwidth {
  position: fixed;
  width: 650px;
  z-index: 1;
}
.mobilewidth {
  position: fixed;
  width: 100%;
  z-index: 1;
}
.bottom0 {
  bottom: 0px;
}
</style>
