import Vue from "vue";
import { LocalStorage, Loading } from "quasar";
import { firebase } from "boot/config";
import { showErrorMessage } from "src/functions/function-show-error-message";
import { uid, Notify, date } from "quasar";

const state = {
  settings: {
    showLocation: false,
    sendNotifications: false,
  },
};

const mutations = {
  setShowLocation(state, value) {
    state.settings.showLocation = value;
  },
  setSendNotifications(state, value) {
    state.settings.sendNotifications = value;
  },

  setSettings(state, settings) {
    Object.assign(state.settings, settings);
  },
};

const actions = {
  setShowLocation({ commit, dispatch }, value) {
    commit("setShowLocation", value);
    dispatch("saveSettings");
  },
  setSendNotifications({ commit, dispatch }, value) {
    commit("setSendNotifications", value);
    dispatch("saveSettings");
  },

  saveSettings({ state }) {
    LocalStorage.set("settings", state.settings);
    let userId = firebaseAuth.currentUser.uid;

    firebase.db.ref("Users/" + userId).update({
      settings: state.settings,
    });
  },
  getSettings({ commit }) {
    let userId = firebase.auth.currentUser.uid;

    let settings = LocalStorage.getItem("settings");
    if (settings) {
      commit("setSettings", settings);
    }
  },
};

const getters = {
  settings: (state) => {
    return state.settings;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
