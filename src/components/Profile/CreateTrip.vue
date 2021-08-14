<template>
  <q-card class="no-padding" style="width: 90%; max-width: 400px;">
    <modal-header>Add new trip</modal-header>
    <div class="q-pa-md q-gutter-y-sm">
      <q-input
        label="title*"
        filled
        v-model="newTrip.title"
        :rules="[(val) => !!val || 'Field is required']"
      />

      <q-input
        filled
        label="summary*"
        v-model="newTrip.summary"
        type="textarea"
        :rules="[(val) => !!val || 'Field is required']"
      />

      <q-select
        outlined
        filled
        v-model="newTrip.countries"
        :options="countryKeys"
        label="Start country"
        class="q-mb-md bg-white"
        :rules="[(val) => !!val || 'Field is required']"
      />

      <div>Start date*</div>
      <modal-due-date :dueDate.sync="newTrip.dueDate" />

      <div class="row">
        <q-space></q-space>
        <q-btn :style="buttonStyle" label="save" @click="saveNewTripAction" />
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
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
    "modal-due-date": require("components/Shared/Modals/ModalDueDate.vue")
      .default,
  },
  methods: {
    saveNewTripAction() {
      this.setItemAction({
        path: "Users/" + this.myUserId + "/trips/" + this.timeStamp,
        data: {
          timeStamp: this.timeStamp,
          title: this.newTrip.title,
          summary: this.newTrip.summary,
          startdate: this.newTrip.dueDate,
          enddate: "",
          countries: {
            0: this.newTrip.countries,
          },
        },
      });
      this.$router.push("/trip/" + this.myUserId + "/" + this.timeStamp);

      this.newTrip = "";
      this.$emit("close");
    },
  },
};
</script>

<style></style>
