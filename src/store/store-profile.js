import Vue from "vue";
import { uid, Notify } from "quasar";
import { firebase } from "boot/config";
import { showErrorMessage } from "src/functions/function-show-error-message";

const state = {
  userDataState: {},
};

const mutations = {
  addUserData(state, payload) {
    Vue.set(state.userDataState, payload.userId, payload.userDetails);
  },
};

const actions = {
  getUserDetails({ commit }, userId) {
    firebase.db.ref("Users/" + userId).once("value", (snapshot) => {
      let userId = snapshot.key;
      let userDetails = snapshot.val();
      commit("addUserData", { userId, userDetails });
    });
    firebase.db.ref("Users/" + userId).on("child_changed", (snapshot) => {
      let userId = snapshot.key;
      let userDetails = snapshot.val();
      commit("addUserData", { userId, userDetails });
    });
  },
  addFeedback({}, payload) {
    // let newKey = payload.data.date_created
    if (payload.from === "me") {
      firebase.db
        .ref(
          "Users/" + payload.receiver + "/hosting/requests/" + payload.timestamp
        )
        .update({ feedback: payload.feedback, experience: payload.experience });
      firebase.db
        .ref(
          "Users/" +
            payload.sender +
            "/hosting/requests/" +
            payload.timestamp +
            "/wroteFeedback"
        )
        .set(true);
    } else {
      firebase.db
        .ref(
          "Users/" + payload.sender + "/hosting/requests/" + payload.timestamp
        )
        .update({ feedback: payload.feedback, experience: payload.experience });
      firebase.db
        .ref(
          "Users/" +
            payload.receiver +
            "/hosting/requests/" +
            payload.timestamp +
            "/wroteFeedback"
        )
        .set(true);
    }
    Notify.create("Feedback send!");
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
