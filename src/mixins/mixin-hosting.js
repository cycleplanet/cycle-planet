import Vue from "vue";
// import { mapState, mapActions, mapGetters } from 'vuex'
// import { date, uid, Notify } from 'quasar'
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  data() {
    return {};
  },
  computed: {
    requestsReceived() {
      if (this.loggedInUser) {
        if (this.loggedInUser.hosting.requests) {
          let totalRequests = Object.keys(this.loggedInUser.hosting.requests);
          let requestKeys = {};
          totalRequests.forEach((element) => {
            let days = this.daysToGo(
              this.loggedInUser.hosting.requests[element].dateProposal
            );
            if (
              this.loggedInUser.hosting.requests[element].from === "them" &&
              days > -1
            ) {
              requestKeys[element] = true;
            }
          });
          return requestKeys;
        } else {
          return false;
        }
      }
    },
    requestsSend() {
      if (this.loggedInUser) {
        if (this.loggedInUser.hosting.requests) {
          let totalRequests = Object.keys(this.loggedInUser.hosting.requests);
          let requestKeys = {};
          totalRequests.forEach((element) => {
            let days = this.daysToGo(
              this.loggedInUser.hosting.requests[element].dateProposal
            );
            if (
              this.loggedInUser.hosting.requests[element].from === "me" &&
              days > -1
            ) {
              requestKeys[element] = true;
            }
          });
          return requestKeys;
        } else {
          return false;
        }
      }
    },
    requestsNeedFeedback() {
      if (this.loggedInUser) {
        if (this.loggedInUser.hosting.requests) {
          let totalRequests = Object.keys(this.loggedInUser.hosting.requests);
          let requestKeys = {};
          totalRequests.forEach((element) => {
            let days = this.daysToGo(
              this.loggedInUser.hosting.requests[element].dateProposal
            );
            if (
              this.loggedInUser.hosting.requests[element].status ===
                "accepted" &&
              days < 0 &&
              !this.loggedInUser.hosting.requests[element].wroteFeedback
            ) {
              requestKeys[element] = true;
            }
          });
          return requestKeys;
        } else {
          return false;
        }
      }
    },
    notifyRequest() {
      if (
        this.loggedInUser &&
        this.loggedInUser.hosting &&
        this.loggedInUser.hosting.requests
      ) {
        let requestKeys = {};

        Object.keys(this.requestsReceived).forEach((element) => {
          if (
            this.loggedInUser.hosting.requests[element].status === "unanswered"
          ) {
            requestKeys[element] = true;
          }
        });
        Object.keys(this.requestsNeedFeedback).forEach((element) => {
          requestKeys[element] = true;
        });
        return requestKeys;
      } else {
        return false;
      }
    },
  },
};
