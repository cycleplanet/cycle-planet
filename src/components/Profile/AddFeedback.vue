<template>
  <q-card class="no-padding">
    <form @submit.prevent="sendMessage">
      <modal-header>Write feedback</modal-header>
      <!-- {{feedbackData}} -->
      <q-card-section class="">
        <div v-if="feedbackData.from === 'me'">
          You stayed at {{ users[feedbackData.receiver].fullname }} on
          {{ feedbackData.dateProposal }}. Please write some feedback about how
          you experienced your stay with
          {{ users[feedbackData.receiver].fullname }}, so others can know what
          to expect. This way, we build a reliable community.
        </div>
        <div v-if="feedbackData.from === 'them'">
          Thanks for hosting {{ users[feedbackData.sender].fullname }}. Please
          write some feedback about how you experienced having
          {{ users[feedbackData.sender].fullname }} as a guest, so others can
          know what to expect. This way, we build a reliable community.
        </div>
        <!-- {{myName}} -->
        <q-select
          outlined
          filled
          class="q-mt-md"
          style="width: 250px;"
          v-model="experience"
          use-input
          input-debounce="0"
          label="Experience*"
          :options="status"
          behavior="menu"
          lazy-rules
          name="status"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          dense
          v-model="newMessage"
          filled
          label="Description"
          type="textarea"
          name="message"
        />
        <div style="height: 1px;">
          <q-input
            style="width: 0px;"
            dense
            v-model="otherEmail"
            name="to_email"
          />
          <q-input
            style="width: 0px;"
            dense
            v-model="myEmail"
            name="from_email"
          />
          <q-input
            style="width: 0px;"
            dense
            v-model="myName"
            name="from_name"
          />
          <q-input
            style="width: 0px;"
            dense
            v-model="myEmail"
            name="reply_to"
          />
          <q-input
            style="width: 0px;"
            dense
            v-model="otherName"
            name="to_name"
          />
          <q-input
            style="width: 0px;"
            dense
            v-model="myProfile"
            name="from_user"
          />
          <q-input
            style="width: 0px;"
            dense
            v-model="otherProfile"
            name="to_user"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-bg-secondary">
        <q-btn :style="buttonStyle" label="Send" type="submit" />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

import emailjs from "emailjs-com";
import { emailjskey } from "src/boot/config.js";

export default {
  mixins: [mixinGeneral],

  props: ["feedbackData"],

  data() {
    return {
      newMessage: "",
      status: ["Good", "Neutral", "Bad"],
      role: ["Host", "Guest"],
      experience: "",
      payload: {},
    };
  },

  computed: {
    myEmail() {
      return this.loggedInUser.email;
    },
    myName() {
      return this.loggedInUser.fullname;
    },
    myProfile() {
      return "http://cycleplanet.org/user/" + this.myUserId;
    },
    otherEmail() {
      if (this.feedbackData.from === "me") {
        return this.users[this.feedbackData.receiver].email;
      } else {
        return this.users[this.feedbackData.sender].email;
      }
    },
    otherName() {
      if (this.feedbackData.from === "me") {
        return this.users[this.feedbackData.receiver].fullname;
      } else {
        return this.users[this.feedbackData.sender].fullname;
      }
    },
    otherProfile() {
      if (this.feedbackData.from === "me") {
        return "http://cycleplanet.org/user/" + this.feedbackData.receiver;
      } else {
        return "http://cycleplanet.org/user/" + this.feedbackData.sender;
      }
    },
  },

  methods: {
    ...mapActions("profile", ["addFeedback"]),

    onSubmit() {
      this.feedbackData.experience = this.experience;
      this.feedbackData.feedback = this.newMessage;
      this.addFeedback(this.feedbackData);
      this.$emit("close");
    },

    sendMessage(e) {
      this.sendEmail(e);
      this.onSubmit();
      this.$emit("close");
    },

    sendEmail(e) {
      try {
        emailjs.sendForm(
          emailjskey.servicekey,
          emailjskey.templatekey_feedback,
          e.target,
          emailjskey.userkey
        );
      } catch (error) {}
    },
  },
};
</script>

<style></style>
