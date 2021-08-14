<template>
  <div>
    <div v-if="screenwidthbig" class="row">
      <div class="col-4">
        <div :class="flexlist ? 'chatlistflex' : 'chatlistsolid'">
          <chat-list />
        </div>
      </div>
      <div class="col-8">
        <single-chat ref="pageChat" />
      </div>
    </div>
    <div v-else>
      <single-chat ref="pageChat" />
    </div>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      activeUserId: "",
    };
  },
  components: {
    "single-chat": require("components/Chat/Chat.vue").default,
    "chat-list": require("src/pages/PageChatlist.vue").default,
  },
  computed: {
    ...mapGetters("chat", ["unreadchatlistnew", "userMessagesSortedByDate"]),

    scrollToBottom() {
      let pageChat = this.$refs.pageChat.$el;
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight);
      }, 20);
    },

    flexlist() {
      let screenWidth = screen.width;
      if (screenWidth < 975) {
        return true;
      } else {
        return false;
      }
    },

    checkLoggedIn() {},
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
  mounted() {
    this.activeUserId = this.$route.params.otherUserId;
    if (!this.loggedIn) {
      this.showLoginDialog();
    }
  },
};
</script>

<style>
.chatlistflex {
  position: fixed;
  width: 33%;
}
.chatlistsolid {
  position: fixed;
  width: 325px;
}
</style>
