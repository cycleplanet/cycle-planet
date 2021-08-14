<template>
  <q-card class="no-padding" v-if="postItemData" style="width: 80%;">
    <modal-header>Edit post</modal-header>
    <div class="q-pa-sm">
      <q-select
        class="q-mb-md"
        filled
        v-model="countriesSelected"
        multiple
        :options="countryKeys"
        use-chips
        stack-label
        label="Select countries"
        behavior="menu"
      />
      <q-input
        outlined
        filled
        v-model="editDetails.title"
        label="Title *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        outlined
        type="textarea"
        filled
        v-model="editDetails.description"
        label="Description*"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <div class="row">
        <q-space></q-space>
        <q-btn :style="buttonStyle" @click="saveEditPost">Save</q-btn>
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  props: ["postItemData"],
  mixins: [mixinGeneral],
  data() {
    return {
      editDetails: {},
      countriesSelected: [],
    };
  },

  computed: {
    countries() {
      let countries = Object.keys(this.postItemData.countries);
      countries.forEach((element) => {
        this.countriesSelected.push(element);
      });
    },
  },

  methods: {
    saveEditPost() {
      let countriessorted = {};
      this.countriesSelected.forEach((element) => {
        countriessorted[element] = true;
      });

      this.updateItemAction({
        path: "Posts/" + this.postItemData.postKey,
        data: {
          countries: countriessorted,
          title: this.editDetails.title,
          description: this.editDetails.description,
        },
      });
      this.$emit("close");
    },
  },

  mounted() {
    this.editDetails = Object.assign({}, this.postItemData);
    this.countries;
  },
};
</script>

<style></style>
