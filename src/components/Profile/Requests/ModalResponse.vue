<template>
  <div>
    <div
      v-if="
        (requestData.receiver === loggedInUser.id &&
          requestData.status === 'unanswered') ||
        editResponse
      "
      class="row"
    >
      <q-item-section>
        <q-input
          class="bg-white"
          color="teal"
          autogrow
          filled
          v-model="response"
          type="text"
          label="Response"
          lazy-rules
        />
      </q-item-section>
      <q-item-section side>
        <q-btn
          round
          color="green"
          icon="done"
          @click="
            answer = 'accept';
            response ? answerRequest() : (noResponse = true);
          "
        />
      </q-item-section>
      <q-item-section side>
        <q-btn
          round
          color="red"
          type="submitaccept"
          icon="clear"
          @click="
            answer = 'refuse';
            response ? answerRequest() : (noResponse = true);
          "
        />
      </q-item-section>
    </div>
    <div
      class="row"
      v-if="
        loggedInUser.hosting.requests[requestkey].receiver === loggedInUser.id &&
        loggedInUser.hosting.requests[requestkey].status !== 'unanswered' &&
        showEdit
      "
    >
      <q-space />
      <q-btn flat round dense icon="edit" @click="editResponse = true" />
    </div>

    <q-dialog v-model="noResponse">
      <q-card class="q-pa-md">
        <div>
          Are you sure you want to {{ answer }} without writing a response?
        </div>
        <div class="row q-mt-md">
          <q-space></q-space>
          <q-btn flat color="teal" @click="noResponse = false">cancel</q-btn>
          <q-btn
            :style="buttonStyle"
            @click="
              answerRequest();
              noResponse = false;
            "
            >send</q-btn
          >
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],
  props: ["requestkey", "showEdit"],
  data() {
    return {
      response: "",
      noResponse: false,
      answer: "",
      requestData: {},
      // editRequestDialog:false,
      // editDate:'',
      editResponse: false,
    };
  },
  computed: {},
  methods: {
    ...mapActions("chat", ["firebaseAnswerRequest", "firebaseSendMessage"]),

    answerRequest() {
      console.log("X answerRequest 1", this.requestData);
      console.log("X answerRequest 2", this.answer);
      this.requestData.response = this.response;
      if (this.answer === "accept") {
        this.requestData.status = "accepted";
      } else {
        this.requestData.status = "refused";
      }
      console.log("answerRequest 3", this.requestData);

      this.firebaseAnswerRequest(this.requestData);

      this.firebaseSendMessage({
        message: {
          read: true,
          text: this.response,
          from: "me",
        },
        otherUserId: this.requestData.sender,
        senderName: this.loggedInUser.fullname,
      });
      this.editResponse = false;
    },
  },
  mounted() {
    if (this.loggedInUser.hosting.requests[this.requestkey]) {
      this.requestData = Object.assign(
        {},
        this.loggedInUser.hosting.requests[this.requestkey]
      );
    }
  },
};
</script>

<style></style>
