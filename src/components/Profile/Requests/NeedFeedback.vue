<template>
  <div>
    <q-card class="q-my-sm">
      <q-item>
        <q-item-section avatar>
          <q-avatar size="md">
            <img
              :src="
                myUserDetails.hosting.requests[requestkey].from === 'me'
                  ? users[myUserDetails.hosting.requests[requestkey].receiver]
                      .imageurl
                  : users[myUserDetails.hosting.requests[requestkey].sender]
                      .imageurl
              "
            />
          </q-avatar>
        </q-item-section>
        <q-item-section class="text-bold">
          <q-item-label>
            <username-no-avatar
              :userId="
                myUserDetails.hosting.requests[requestkey].from === 'me'
                  ? myUserDetails.hosting.requests[requestkey].receiver
                  : myUserDetails.hosting.requests[requestkey].sender
              "
            />
          </q-item-label>
          <q-item-label caption>{{
            myUserDetails.hosting.requests[requestkey].dateProposal
          }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            :style="buttonStyle"
            style="max-width: 100px;"
            @click="
              addFeedbackMethod(myUserDetails.hosting.requests[requestkey])
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
import { date } from "quasar";
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

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
