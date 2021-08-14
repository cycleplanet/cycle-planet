<template>
  <div>
    <div>
      <p class="text-h6">Description of my home</p>
      <p class="">
        <b>Description: </b
        >{{ userData.hosting ? userData.hosting.description : "" }}
      </p>
      <p class="">
        <b>Max guest: </b>
        {{ userData.hosting ? userData.hosting.max_guests : "" }}
      </p>
      <p class="">
        <b>Store bike inside: </b>
        {{
          userData.hosting
            ? userData.hosting.bike_inside
              ? " Yes"
              : " No"
            : ""
        }}
      </p>
      <p class="">
        <b>Pets allowed: </b>
        {{
          userData.hosting
            ? userData.hosting.pets_allowed
              ? " Yes"
              : " No"
            : ""
        }}
      </p>
      <q-separator />
    </div>
    <div>
      <div class="text-h6 q-my-md">My hosting experience</div>
      <hosting-stats class="q-my-md" :data="userData" />
      <q-separator />
    </div>

    <p class="text-h6 q-my-md">What others say ({{ feedbackReceived }})</p>

    <q-list v-if="userData.hosting" class="">
      <div
        v-for="(requestData, requestKey) in userData.hosting.requests"
        :key="requestKey"
      >
        <div v-if="requestData.feedback">
          <feedback-hosting :feedback="requestData" />
        </div>
      </div>
    </q-list>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
export default {
  props: ["userId", "userData"],

  mixins: [mixinGeneral],

  components: {
    "feedback-hosting": require("components/Profile/Feedback.vue").default,
    "hosting-stats": require("components/Shared/Modals/HostingStats.vue")
      .default,
  },

  computed: {
    // userId: function () {
    // 	return this.$route.params.otherUserId
    // },

    // userData: function () {
    // 	return this.users[this.userId]
    // },
    myProfile: function () {
      if (this.userId === this.myUserId) {
        return true;
      } else {
        return false;
      }
    },
    feedbackReceived() {
      let x = 0;
      if (this.userData.hosting) {
        if (this.userData.hosting.requests) {
          let totalRequests = Object.keys(this.userData.hosting.requests);
          totalRequests.forEach((element) => {
            if (this.userData.hosting.requests[element].feedback) {
              x++;
            }
          });
        }
      }
      return x;
    },
  },
};
</script>

<style></style>
