<template>
  <q-card class="no-padding" style="width: 100%;">
    <modal-header>Add video post</modal-header>
    <q-card-section class="q-gutter-y-xs">
      <q-banner rounded class="bg-orange-2 text-orange-10"
        >All logged in users can add their own video posts, but please make sure
        to follow our
        <span class="underline cursor-pointer" @click="clickGuidelines()"
          >guidelines</span
        >.
      </q-banner>

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
        type="url"
        filled
        v-model="link"
        label="Link*"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        outlined
        filled
        v-model="title"
        label="Video title *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        outlined
        filled
        v-model="description"
        label="Description description*"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
    </q-card-section>
    <q-card-section>
      <video-embed
        :src="link"
        sandbox="allow-popups allow-scripts"
      ></video-embed>
    </q-card-section>

    <q-card-actions align="right" class="q-ml-sm">
      <q-btn @click="onSubmit" label="Submit" :style="buttonStyle" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import { uid, Notify } from "quasar";

import Vue from "vue";
import Embed from "v-video-embed";

Vue.use(Embed);

export default {
  mixins: [mixinGeneral],

  data() {
    return {
      countriesSelected: [],
      link: "",
      title: "",
      description: "",
    };
  },

  computed: {},

  components: {},

  methods: {
    // ...mapActions('post', ['newBlogPost']),

    onSubmit() {
      let countriessorted = {};
      this.countriesSelected.forEach((element) => {
        countriessorted[element] = true;
      });
      let postuid = uid();

      this.setItemAction({
        path: "PostsVideo/" + postuid,
        data: {
          refKey: "Video",
          countries: countriessorted,
          date_created: this.timeStamp,
          postKey: postuid,
          title: this.title,
          description: this.description,
          user_created: this.myUserId,
          link: this.link,
        },
      });
      // this.newBlogPost(this.payload)
      this.$emit("close");
    },
  },
};
</script>

<style></style>
