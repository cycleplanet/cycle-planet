<template>
  <q-card
    class="no-padding"
    style="max-width: 90%; width: 400px; height: auto;"
  >
    <form @submit.prevent="saveCountrySettings()">
      <modal-header>Edit {{ countryKey }} settings</modal-header>
      <q-list bordered padding>
        <q-item tag="label">
          <q-item-section>
            <q-item-label>Island?</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="countryData.settings.island" val="battery" />
          </q-item-section>
        </q-item>

        <q-item tag="label">
          <q-item-section>
            <q-item-label>Open borders?</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle
              v-model="countryData.settings.openBorders"
              val="battery"
            />
          </q-item-section>
        </q-item>

        <q-item tag="label">
          <q-item-section>
            <q-item-label>Too dangerous?</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="countryData.settings.dangerous" val="battery" />
          </q-item-section>
        </q-item>

        <q-item tag="label">
          <q-item-section>
            <q-item-label>Visa free?</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="countryData.settings.visaFree" val="battery" />
          </q-item-section>
        </q-item>

        <q-item tag="label">
          <q-item-section>
            <q-item-label>Map zoom level</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-input v-model="countryData.zoom" val="battery" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-actions align="right" class="text-bg-secondary">
        <q-btn :style="buttonStyle" label="Save" type="submit" />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],

  props: ["countryKey"],

  data() {
    return {};
  },

  computed: {
    ...mapState("country", ["countryData"]),
  },

  methods: {
    saveCountrySettings() {
      this.updateItemAction({
        path: "Country_data/" + this.countryKey,
        data: this.countryData,
      });

      this.$emit("close");
    },
  },
};
</script>

<style></style>
