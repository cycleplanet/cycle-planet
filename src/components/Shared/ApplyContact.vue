<template>
  <q-card style="min-width: 350px;">
    <modal-header>Apply to become a contact person for a country</modal-header>

    <q-card-section>
      <div class="">
        To enroll for the role of contact person, we would like to hear your
        motivation.
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select
        outlined
        v-model="country"
        use-input
        input-debounce="0"
        label="Select country*"
        :options="countryKeys"
        behavior="menu"
        filled
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input type="textarea" filled label="Motivation" v-model="motivation" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        type="textarea"
        filled
        label="Do you have bike touring experience, and where?"
        v-model="experience"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn
        flat
        label="Send application"
        class="bg-secondary text-white"
        @click="applyForEditor"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      motivation: "",
      experience: "",
      country: "",
    };
  },

  methods: {
    applyForEditor() {
      this.setItemAction({
        path: "Application/" + this.timeStamp,
        data: {
          country: this.country,
          motivation: this.motivation,
          experience: this.experience,
          date: this.timeStamp,
          user: this.myUserId,
          role: "contact person",
        },
      });
      this.motivation = "";
      this.experience = "";
      this.$emit("close");
    },
  },
};
</script>

<style></style>
