<template>
  <q-card class="no-padding">
    <modal-header>Share item</modal-header>
    <div class="q-pa-md">
      <a class="text-subtitle1 text-red" :href="url" target="_blank">{{
        url
      }}</a>
      <div class="row justify-center text-subtitle1 q-my-sm">
        <button
          label="copy"
          class="q-mr-sm"
          v-clipboard:copy="url"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >
          copy
        </button>
        or share on
      </div>
      <div class="row q-gutter-sm flex justify-center">
        <Facebook :scale="scale" :url="url" />
        <Twitter :scale="scale" :title="title2" :url="url" />
        <WhatsApp :scale="scale" :title="title2" :url="url" />
        <Email :scale="scale" :title="title2" :url="url" />
        <Reddit :scale="scale" :title="title2" :url="url" />
      </div>
    </div>
  </q-card>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import {
  Facebook,
  Twitter,
  WhatsApp,
  Email,
  Reddit,
} from "vue-socialmedia-share";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import { Notify } from "quasar";

Vue.use(VueClipboard);
export default {
  mixins: [mixinGeneral],
  props: ["slug", "title"],
  data() {
    return {
      scale: "3",
    };
  },
  components: {
    Facebook,
    Twitter,
    WhatsApp,
    Email,
    Reddit,
  },
  computed: {
    url() {
      return "https://cycleplanet.org/" + this.slug;
    },
    title2() {
      return "Cycle Planet - " + this.title;
    },
  },
  methods: {
    onCopy: function (e) {
      this.$q.notify({
        message:
          "You just copied the following text to the clipboard: " + e.text,
        color: "green",
      });
    },
    onError: function (e) {
      this.$q.notify({
        message: "Failed to copy the text to the clipboard",
        color: "red",
      });
    },
  },
};
</script>

<style></style>
