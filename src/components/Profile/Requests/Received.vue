<template>
  <div>
    <q-card class="q-my-md">
      <modal-sender :requestkey="requestkey" />

      <modal-receiver :requestkey="requestkey" />

      <div
        v-if="
          myUserDetails.hosting.requests[requestkey].status !== 'unanswered'
        "
        class="text-center q-py-md"
      >
        <div>You can continue this conversation in the chat</div>
        <q-btn
          :style="buttonStyle"
          :to="'/chat/' + myUserDetails.hosting.requests[requestkey].sender"
          >Chat</q-btn
        >
      </div>
    </q-card>
  </div>
</template>

<script>
import { date } from "quasar";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["requestkey"],
  data() {
    return {};
  },
  components: {
    "modal-sender": require("components/Profile/Requests/ModalSender.vue")
      .default,
    "modal-receiver": require("components/Profile/Requests/ModalReceiver.vue")
      .default,
  },
};
</script>

<style></style>
