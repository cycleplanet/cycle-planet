<template>
  <div>
    <q-footer
      class="cp-footer bg-secondary"
      v-if="
        isWebApp &&
        !$route.fullPath.includes('/map') &&
        !$route.fullPath.includes('/chat/')
      "
      style="padding-top: 30px;"
    >
      <div class="text-center text-h6">
        More Cycle Planet? Check out these channels
      </div>
      <div
        class="text-center constrain q-gutter-x-lg"
        style="padding-top: 30px; padding-bottom: 30px;"
      >
        <a
          href="https://github.com/cycleplanet/cycle-planet"
          target="_blank"
          class="iconlink"
        >
          <q-icon name="fab fa-github" size="lg" />
        </a>
        <a
          href="https://join.slack.com/t/cycle-planet/shared_invite/zt-shfov7n9-c608GlSNiGPCbRTb8D5nQA"
          target="_blank"
          class="iconlink"
        >
          <q-icon name="fab fa-slack" size="lg" />
        </a>
        <a
          href="https://www.instagram.com/cycle.planet"
          target="_blank"
          class="iconlink"
        >
          <q-icon name="fab fa-instagram" size="lg" />
        </a>
        <a
          href="https://www.facebook.com/Cycle-Planet-100672311813208"
          target="_blank"
          class="iconlink"
        >
          <q-icon name="fab fa-facebook" size="lg" />
        </a>
        <a
          href="https://opencollective.com/cycle-planet"
          target="_blank"
          class="iconlink"
        >
          <q-img src="social_icons/opencollective.svg" style="width: 30px;" />
        </a>
      </div>

      <div class="text-center">
        <div class="text-h6">Proudly sponsored by</div>
        <a href="https://www.ortlieb.com/en_us/" target="_blank">
          <q-img src="sponsors/ortlieb.png" style="width: 150px;"></q-img>
        </a>
      </div>

      <q-separator color="black" class="q-my-sm" />
      <div class="constrain justify-center row" style="padding-bottom: 40px;">
        <q-list
          v-for="(section, sectionKey) in sections"
          :key="sectionKey"
          style="width: 25%;"
        >
          <div class="text-bold text-h6 q-mt-md">{{ sectionKey }}</div>
          <router-link
            v-for="(item, title) in section"
            class="quicklink"
            :to="item.to"
            :key="title"
          >
            {{ title }}
          </router-link>
        </q-list>
      </div>
      <div class="bg-grey-3" style="padding-bottom: 40px;">
        <div class="constrain text-center">
          <div class="q-pa-md text-black">
            Cycle Planet is a non-profit organization. This website is made by
            volunteers with love for the bicycle touring community.
          </div>
          <div class="row q-gutter-x-sm justify-center">
            <q-btn
              v-if="isWebApp"
              :style="buttonStyle"
              label="donate"
              to="/donate"
            />
            <q-btn
              :style="buttonStyle"
              label="feedback"
              @click="feedbackDialog = true"
            />
          </div>
        </div>
      </div>
    </q-footer>
    <q-footer class="layout" v-if="!$route.fullPath.includes('/chat/')">
      <q-tabs
        indicator-color="transparent"
        active-:style="buttonStyle"
        class="bg-white text-grey shadow-2"
        align="justify"
        :breakpoint="0"
      >
        <q-tab name="map" icon="map" @click="$router.push('/map')" />
        <q-tab v-if="loggedIn" icon="chat" @click="$router.push('/chat')">
          <q-badge
            color="red"
            v-if="Object.keys(unreadchatlistnew).length"
            floating
            >{{ Object.keys(unreadchatlistnew).length }}</q-badge
          >
        </q-tab>
        <q-tab
          v-if="loggedIn ? teamMember : false"
          icon="star"
          @click="$router.push('/admin')"
        >
          <q-badge
            color="red"
            v-if="Object.keys(userReports).length"
            floating
            >{{ Object.keys(userReports).length }}</q-badge
          >
          <q-badge
            color="amber"
            style="margin-top: 20px;"
            v-if="Object.keys(userFeedback).length"
            floating
            >{{ Object.keys(userFeedback).length }}</q-badge
          >
        </q-tab>
      </q-tabs>
    </q-footer>

    <q-dialog v-model="feedbackDialog">
      <feedback-dialog @close="feedbackDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import mixinHosting from "src/mixins/mixin-hosting.js";

import meta from "src/utils/meta.js";

export default {
  mixins: [mixinGeneral, mixinHosting],
  data() {
    return {
      feedbackDialog: false,
      sections: {
        Main: {
          Home: { to: "/" },
          Countries: { to: "/countries" },
        },
        Useful: {
          "Get inspired": { to: "/get-inspired" },
          Resources: { to: "/resources" },
        },
        About: {
          "House Rules": { to: "/houserules" },
          Team: { to: "/team" },
          "Our story": { to: "/our-story" },
          FAQ: { to: "/faq" },
        },
        Legal: {
          "Privacy Policy": { to: "/privacy-policy" },
          "Terms of use": { to: "/terms-of-use" },
          "Cookie policy": { to: "/cookie-policy" },
          Contact: { to: "/contact" },
        },
      },
    };
  },
  components: {
    "feedback-dialog": require("components/Shared/FeedbackDialog.vue").default,
  },

  computed: {
    ...mapState("admin", ["userFeedback", "userReports"]),
  },
};
</script>

<style>

.quicklink {
  color: #000;
  text-decoration: underline;
  display: block;
  margin: 10px 0;
}
@media screen and (min-width: 768px) {
  .q-footer.layout {
    display: none;
  }
}
.iconlink {
  text-decoration: none;
  color: black;
}
</style>
