<template>
  <div>
    <div
      :class="
        feedback.experience === 'Good'
          ? 'bg-green-2'
          : feedback.experience === 'Neutral'
          ? 'bg-orange-2'
          : 'bg-red-2'
      "
    >
      <q-item>
        <q-item-section
          class="cursor-pointer"
          avatar
          @click="clickuser(otherUserIdFeedback)"
        >
          <q-avatar size="md">
            <img :src="users[otherUserIdFeedback].imageurl" />
          </q-avatar>
        </q-item-section>
        <q-item-section class="text-bold">
          <q-item-label
            class="underline-hover cursor-pointer"
            @click="clickuser(otherUserIdFeedback)"
            >{{ users[otherUserIdFeedback].fullname }}</q-item-label
          >
          <q-item-label caption>{{ feedback.dateProposal }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>
            <q-btn
              flat
              v-if="otherUserIdFeedback === myUserId"
              round
              dense
              icon="edit"
              @click="
                editFeedbackdialog = true;
                editfeedback = feedback.feedback;
              "
            />
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          {{ feedback.feedback }}
        </q-item-section>
      </q-item>
    </div>
    <q-separator color="black" />
    <q-dialog v-model="editFeedbackdialog">
      <q-card v-if="editfeedback" style="width: 90%; max-width: 600px;">
        <modal-header>Edit feedback</modal-header>
        <div class="q-pa-sm">
          <div>
            <q-input
              dense
              v-model="editfeedback"
              filled
              label="Description"
              type="textarea"
              name="message"
            />
            <!-- <q-input>{{editfeedback}}</q-input>    -->
          </div>
          <div class="row q-mt-sm">
            <q-space></q-space>
            <q-btn
              label="save"
              :style="buttonStyle"
              @click="saveEditFeedback()"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  props: ["feedback"],
  mixins: [mixinGeneral],
  data() {
    return {
      editFeedbackdialog: false,
      editfeedback: "",
    };
  },

  computed: {
    niceDate: function () {
      let date_created = this.feedback.datePr;
      let timeStamp = Date.now();

      let show_date = date.formatDate(date_created, "MMMM YYYY");
      return show_date;
    },
    otherUserIdFeedback() {
      if (this.feedback.from === "me") {
        return this.feedback.receiver;
      } else {
        return this.feedback.sender;
      }
    },
  },
  methods: {
    saveEditFeedback() {
      let otheruser = "";

      if (this.feedback.receiver === this.myUserId) {
        otheruser = this.feedback.sender;
      } else {
        otheruser = this.feedback.receiver;
      }
      this.updateItemAction({
        path:
          "Users/" + otheruser + "/hosting/requests/" + this.feedback.timestamp,
        data: {
          feedback: this.editfeedback,
        },
      });
      this.editFeedbackdialog = false;
    },
  },
};
</script>

<style></style>
