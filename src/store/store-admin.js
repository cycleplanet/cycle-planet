import Vue from "vue";
import { firebase } from "boot/config";
import { uid, Notify, date } from "quasar";
import { showErrorMessage } from "src/functions/function-show-error-message";

const state = {
  adminData: {},
  userFeedback: {},
  userReports: {},
  userApplication: {},
};

const mutations = {
  getAdminMutation(state, payload) {
    Vue.set(state.adminData, payload.itemId, payload.itemDetails);
  },
  getFeedbackMutation(state, payload) {
    Vue.set(state.userFeedback, payload.itemId, payload.itemDetails);
  },
  getReportsMutation(state, payload) {
    Vue.set(state.userReports, payload.itemId, payload.itemDetails);
  },
  getApplicationMutation(state, payload) {
    Vue.set(state.userApplication, payload.itemId, payload.itemDetails);
  },
  deleteFeedback(state, id) {
    Vue.delete(state.userFeedback, id);
  },
  deleteReport(state, id) {
    Vue.delete(state.userReports, id);
  },
  deleteApplication(state, id) {
    Vue.delete(state.userApplication, id);
  },
};

const actions = {
  getAdminData({ commit }) {
    let feedbackRef = firebase.db.ref("Admin/");

    feedbackRef.on("child_added", (snapshot) => {
      let itemDetails = snapshot.val();
      let itemId = snapshot.key;
      commit("getAdminMutation", { itemId, itemDetails });
    });
    feedbackRef.on("child_changed", (snapshot) => {
      let itemDetails = snapshot.val();
      let itemId = snapshot.key;
      commit("getAdminMutation", { itemId, itemDetails });
    });
  },

  getFeedbackAction({ commit }) {
    let feedbackRef = firebase.db.ref("Feedback/");

    feedbackRef.on("child_added", (snapshot) => {
      let itemDetails = snapshot.val();
      let itemId = snapshot.key;
      commit("getFeedbackMutation", { itemId, itemDetails });
    });
    feedbackRef.on("child_changed", (snapshot) => {
      let itemDetails = snapshot.val();
      let itemId = snapshot.key;
      commit("getFeedbackMutation", { itemId, itemDetails });
    });
    feedbackRef.on("child_removed", (snapshot) => {
      let taskId = snapshot.key;
      commit("deleteFeedback", taskId);
    });
  },

  getReportsAction({ commit }) {
    let reportRef = firebase.db.ref("Reports/");

    reportRef.on("child_added", (snapshot) => {
      let itemDetails = snapshot.val();
      let itemId = snapshot.key;
      commit("getReportsMutation", { itemId, itemDetails });
    });
    reportRef.on("child_changed", (snapshot) => {
      let itemDetails = snapshot.val();
      let itemId = snapshot.key;
      commit("getReportsMutation", { itemId, itemDetails });
    });
    reportRef.on("child_removed", (snapshot) => {
      let taskId = snapshot.key;
      commit("deleteReport", taskId);
    });
  },

  getApplicationAction({ commit }) {
    let reportRef = firebase.db.ref("Application/");
    reportRef.on("child_added", (snapshot) => {
      let itemDetails = snapshot.val();
      let itemId = snapshot.key;
      commit("getApplicationMutation", { itemId, itemDetails });
    });
    reportRef.on("child_changed", (snapshot) => {
      let itemDetails = snapshot.val();
      let itemId = snapshot.key;
      commit("getApplicationMutation", { itemId, itemDetails });
    });
    reportRef.on("child_removed", (snapshot) => {
      let taskId = snapshot.key;
      commit("deleteApplication", taskId);
    });
  },
  sendMessageAction({}, payload) {
    let userId = firebase.auth.currentUser.uid;
    firebase.db
      .ref(
        "Chats/" +
          userId +
          "/" +
          payload.otherUserId +
          "/" +
          payload.message.timestamp
      )
      .set(payload.message);

    payload.message.from = "them";
    firebase.db
      .ref(
        "Chats/" +
          payload.otherUserId +
          "/" +
          userId +
          "/" +
          payload.message.timestamp
      )
      .set(payload.message);

    Notify.create("Message send");
  },
};

const getters = {
  userReportsSorted: (state) => {
    let userReportsSorted = {},
      keysOrdered = Object.keys(state.userReports);

    keysOrdered.sort((a, b) => {
      let AProp = state.userReports[a].date;
      let BProp = state.userReports[b].date;

      if (AProp > BProp) return 1;
      else if (AProp < BProp) return -1;
      else return 0;
    });

    keysOrdered.forEach((key) => {
      userReportsSorted[key] = state.userReports[key];
    });

    return userReportsSorted;
  },

  userApplicationSorted: (state) => {
    let userApplicationSorted = {},
      keysOrdered = Object.keys(state.userApplication);

    keysOrdered.sort((a, b) => {
      let AProp = state.userApplication[a].date;
      let BProp = state.userApplication[b].date;

      if (AProp > BProp) return 1;
      else if (AProp < BProp) return -1;
      else return 0;
    });

    keysOrdered.forEach((key) => {
      userApplicationSorted[key] = state.userApplication[key];
    });

    return userApplicationSorted;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
