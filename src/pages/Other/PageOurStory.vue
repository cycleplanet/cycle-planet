<template>
  <div>
    <div class="q-pa-sm">
      <q-item-label header class="text-black cp-h2">
        <div class="q-mr-md">q{{ title }}</div>
        <q-separator class="q-mb-sm" />

        <q-btn
          v-if="loggedIn ? admin : false"
          label="edit"
          :style="buttonStyle"
          @click="editPage = true"
        />
      </q-item-label>
      <q-item>
        <q-item-section v-html="getPages[title].section1"> </q-item-section>
      </q-item>
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
      title: "Our story",
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
