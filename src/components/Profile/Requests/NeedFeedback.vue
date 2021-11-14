<template>
  <div>
    <q-card class="q-my-sm">
      <q-item>
        <q-item-section avatar>
          <q-avatar size="md">
            <img
              :src="
                loggedInUser.hosting.requests[requestkey].from === 'me'
                  ? users[loggedInUser.hosting.requests[requestkey].receiver]
                      .imageurl
                  : users[loggedInUser.hosting.requests[requestkey].sender]
                      .imageurl
              "
            />
          </q-avatar>
        </q-item-section>
        <q-item-section class="text-bold">
          <q-item-label>
            <username-no-avatar
              :userId="
                loggedInUser.hosting.requests[requestkey].from === 'me'
                  ? loggedInUser.hosting.requests[requestkey].receiver
                  : loggedInUser.hosting.requests[requestkey].sender
              "
            />
          </q-item-label>
          <q-item-label caption>{{
            loggedInUser.hosting.requests[requestkey].dateProposal
          }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            :style="buttonStyle"
            style="max-width: 100px;"
            @click="
              addFeedbackMethod(loggedInUser.hosting.requests[requestkey])
            "
            >feedback</q-btn
          >
        </q-item-section>
      </q-item>
    </q-card>
    <q-dialog v-model="addFeedbackDialog">
      <add-feedback
        :feedbackData="feedbackData"
        @close="addFeedbackDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["requestkey"],
  data() {
    return {
      addFeedbackDialog: false,
      feedbackData: {},
    };
  },
  components: {
    "add-feedback": require("components/Profile/AddFeedback.vue").default,
  },
  methods: {
    addFeedbackMethod(requestData) {
      this.feedbackData = requestData;
      this.addFeedbackDialog = true;
    },
  },
};
</script>

<style></style>
