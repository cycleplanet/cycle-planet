<template>
  <div>
    <q-item
      class="q-pa-none"
      clickable
      v-ripple
      @click="$emit('viewUserProfile')"
    >
      <q-item-section class="text-bold text-h6">
        <q-item-label>{{ data.fullname }}</q-item-label>
        <q-item-label
          v-if="loggedIn"
          caption
          :class="
            data.hosting.status === 'Not available for hosting'
              ? 'text-red'
              : 'text-green'
          "
          >{{ data.hosting.status }}</q-item-label
        >
        <q-item-label
          caption
          class="row"
          v-if="data.hosting.status === 'Touring'"
          >Last updated:
          <nice-date class="q-ml-xs" :dateprop="data.coordinates_updated"
        /></q-item-label>
        <q-item-label
          caption
          class="row"
          v-if="loggedIn && data.hosting.status !== 'Touring'"
          >Last logged in:
          <nice-date class="q-ml-xs" :dateprop="data.online_date"
        /></q-item-label>
      </q-item-section>
    </q-item>
    <div v-if="admin" class="bg-blue-3">userId: {{ data.userId }}</div>

    <!-- <hosting-stats :data="data"/> -->
    <q-item v-if="loggedIn" class="q-pa-none q-my-sm">
      <q-item-section>
        <q-item-label lines="3" v-html-safe="data.bio"></q-item-label>

        <q-item-label class="row">
          <q-chip
            outline
            :color="data.coordinates_hide ? 'red' : 'green'"
            :text-color="data.coordinates_hide ? 'text-red' : 'text-green'"
            :icon="data.coordinates_hide ? 'gps_off' : 'location_searching'"
            >{{
              data.coordinates_hide
                ? "Approximate location"
                : "Accurate location"
            }}</q-chip
          >
          <q-chip
            v-if="data.hosting.status !== 'Touring'"
            outline
            :color="data.phonenumber ? 'green' : 'red'"
            :text-color="data.phonenumber ? 'text-green' : 'text-red'"
            :icon="
              data.phonenumber ? 'eva-phone-outline' : 'eva-phone-off-outline'
            "
            >{{ data.phonenumber ? "Available" : "Not available" }}</q-chip
          >

          <q-chip
            v-if="data.hosting.status !== 'Touring'"
            outline
            :color="data.hosting.pets_allowed ? 'green' : 'red'"
            :text-color="data.hosting.pets_allowed ? 'text-green' : 'text-red'"
            icon="pets"
            >{{
              data.hosting.pets_allowed ? "Pets allowed" : "Pets not allowed"
            }}</q-chip
          >
          <q-chip
            v-if="data.hosting.status !== 'Touring'"
            outline
            icon="family_restroom"
            >Max guests: {{ data.hosting.max_guests }}</q-chip
          >
        </q-item-label>

        <q-item-label v-if="myUserId !== data.userId && loggedIn">
          <q-btn
            class="q-ml-sm"
            size="sm"
            @click="$emit('viewUserProfile')"
            :style="buttonStyle"
            >View profile</q-btn
          >
        </q-item-label>
      </q-item-section>
    </q-item>
    <div v-if="!loggedIn">
      You need to login to see more information. Location of this user is not
      accurate!
    </div>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import Vue from 'vue';
import VueSecureHTML from 'vue-html-secure';

Vue.use(VueSecureHTML);

export default {
  mixins: [mixinGeneral],
  props: ["data"],
  data() {
    return {};
  },
  components: {
    "hosting-stats": require("components/Shared/Modals/HostingStats.vue")
      .default,
  },
};
</script>
