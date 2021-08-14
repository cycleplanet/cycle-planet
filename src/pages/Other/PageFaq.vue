<template>
  <div class="q-pa-sm">
    <div class="row">
      <div class="q-mr-md text-black cp-h2">
        Frequently Asked Questions (FAQ)
      </div>
      <q-btn
        v-if="loggedIn ? admin : false"
        label="edit"
        :style="buttonStyle"
        @click="editPage = true"
      />
    </div>
    <q-separator class="q-my-sm" />
    <div>
      <q-item-section v-html="getPages[title].section1" />
    </div>
    <q-dialog v-model="editPage" :maximized="maximizedToggle">
      <edit-page
        :title="title"
        :data="getPages[title]"
        @close="editPage = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      title: "faq",
      editPage: false,
      maximizedToggle: true,
    };
  },

  computed: {
    ...mapGetters("other", ["getPages"]),
  },
  methods: {},
  components: {
    "edit-page": require("components/Shared/EditPage.vue").default,
  },
};
</script>

<style></style>
