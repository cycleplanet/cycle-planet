<template>
  <div>
    <q-card>
      <post-page :postItemData="postData[postKey]" />
    </q-card>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapActions } from "vuex";

export default {
  mixins: [mixinGeneral],
  computed: {
    postKey() {
      return this.$route.params.postKey;
    },
  },
  components: {
    "post-page": require("components/Post/PostPage.vue").default,
  },
  methods: {
    ...mapActions("post", ["getSinglePosts"]),
  },
  created() {
    this.getSinglePosts(this.postKey);
  },
};
</script>

<style></style>
