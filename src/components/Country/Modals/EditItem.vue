<template>
  <q-card
    class="no-padding"
    style="max-width: 90%; width: 500px; height: auto;"
  >
    <form @submit.prevent="saveEditFormMethod()">
      <modal-header>Edit {{ refsextra[refKey].title }}</modal-header>

      <q-card-section class="q-gutter-y-md">
        <q-banner rounded class="bg-orange-2 text-orange-10"
          >All logged in users can edit this information, but please make sure
          to follow our
          <span class="underline cursor-pointer" @click="clickGuidelines()"
            >guidelines</span
          >.</q-banner
        >
        <q-banner rounded class="bg-green-2 text-green-10"
          ><b>What to write in this section?</b><br />{{
            refsextra[refKey].description
          }}</q-banner
        >
        <q-editor
          v-if="refKey === 'Visa'"
          v-model="inputListItem.body"
          :rules="[(val) => !!val || 'Field is required']"
          :dense="$q.screen.lt.md"
          :toolbar="[
            ['bold', 'italic', 'underline'],
            ['link'],
            ['unordered', 'ordered'],
            ['viewsource'],
          ]"
        >
        </q-editor>
        <q-editor
          v-if="refKey !== 'Visa'"
          @paste.native="(evt) => pasteCapture(evt)"
          ref="editor_ref"
          v-model="inputListItem.body"
          :rules="[(val) => !!val || 'Field is required']"
          :dense="$q.screen.lt.md"
          :toolbar="[
            ['bold', 'italic', 'underline'],
            ['link'],
            ['unordered', 'ordered'],
            ['viewsource'],
          ]"
        >
        </q-editor>
        <!-- <q-input filled autogrow v-model="inputBody" label="Description" type="textarea" /> -->
      </q-card-section>

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

  props: ["refKey", "countryKey", "data"],

  data() {
    return {
      inputListItem: {},
      translateOption: false,
    };
  },

  computed: {
    ...mapState("country", ["countryData"]),
  },

  methods: {
    ...mapActions("country", ["destroyData"]),

    saveEditFormMethod() {
      this.inputListItem.date_edited = this.timeStamp;
      if (this.translateOption) {
        this.inputListItem.user_edited = "01dRgHcnFiTSprDGCEB4Jxq7iDH3";
      } else {
        this.inputListItem.user_edited = this.myUserId;
      }
      // this.inputListItem.body=this.inputBody
      this.updateItemAction({
        path: "Country_data/" + this.countryKey + "/" + this.refKey,
        data: this.inputListItem,
      });

      this.$emit("close");
    },
  },

  mounted() {
    if (this.data) {
      this.inputListItem = Object.assign({}, this.data);
    } else {
      this.inputListItem = {
        body: "",
      };
    }
  },
};
</script>

<style></style>
