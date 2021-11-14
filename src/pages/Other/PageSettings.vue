<template>
  <div>
    <div class="q-pa-sm">
      <q-item-label header class="text-black cp-h2">Settings</q-item-label>
      <q-separator class="q-mb-sm" />

      <q-item tag="label">
        <q-item-section>
          <q-item-label>Show my location on the map</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            color="blue"
            v-model="showLocation"
            val="battery"
            @click="editProfileSubmit"
          />
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
export default {
  mixins: [mixinGeneral],
  data() {
    return {};
  },
  computed: {
    // ...mapGetters('auth', ['settings']),

    showLocation: {
      get() {
        return this.loggedInUser.settings.showLocation;
      },
      set(value) {
        this.setShowLocation(value);
      },
    },
    sendNotifications: {
      get() {
        return this.loggedInUser.settings.sendNotifications;
      },
      set(value) {
        this.setSendNotifications(value);
      },
    },
  },
  methods: {
    ...mapActions("settings", ["setShowLocation", "setSendNotifications"]),
    editProfileSubmit() {
      this.updateItemAction({
        data: this.settings,
        path: "Users/" + this.myUserId,
      });
      this.$emit("close");
    },
  },
};
</script>

<style></style>
