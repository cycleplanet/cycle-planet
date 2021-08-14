<template>
  <div class="q-gutter-y-md">
    <div
      class="bg-grey-4 newcard relative-position cursor-pointer"
      @click="createTripDialog = true"
      v-if="myProfile && !userData.trips"
    >
      <div class="absolute-center">
        <div class="row" style="width: 250px;">
          <q-icon name="control_point" />
          <div class="q-mt-xs">Plan or record your next trip</div>
        </div>
      </div>
    </div>
    <div v-if="!myProfile && !userData.trips">
      <div class="q-mt-xs">{{ userData.fullname }} has no trips yet.</div>
    </div>

    <div v-if="userData.trips">
      <div
        v-for="(trip, tripKey) in userData.trips"
        :key="tripKey"
        class="no-padding"
      >
        <q-card
          class="cursor-pointer no-padding q-future-card-style"
          @click="clickedTrip(tripKey)"
        >
          <div></div>

          <div style="height: 100%;">
            <map-trip
              :userIdProp="userId"
              :tripKeyProp="tripKey"
              :showParts="false"
            />
          </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="createTripDialog">
      <create-trip-dialog @close="createTripDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import { date } from "quasar";

export default {
  props: ["userId", "userData"],
  mixins: [mixinGeneral],
  data() {
    return {
      addTripDialog: false,
      createTripDialog: false,
      tripData: {},
      newTrip: {},
      dueDate: "",
    };
  },
  components: {
    "map-trip": require("components/Trip/MapTrip.vue").default,
    "create-trip-dialog": require("components/Profile/CreateTrip.vue").default,
  },

  computed: {
    // userId: function () {
    //   		return this.$route.params.otherUserId
    // },
    myProfile: function () {
      if (this.userId === this.myUserId) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    clickedTrip(tripKey) {
      this.$router.push("/trip/" + this.userId + "/" + tripKey);
    },
  },
};
</script>

<style>
.q-card-style {
  max-width: 500px;
  height: 300px;
  background-size: cover;
}
.q-future-card-style {
  max-width: 500px;
  height: 300px;
}
.newcard {
  border: 1px dashed black;
  border-radius: 5px;
  max-width: 500px;
  height: 300px;
}
</style>
