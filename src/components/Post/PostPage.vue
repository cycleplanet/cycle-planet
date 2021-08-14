<template>
  <div v-if="postItemData">
    <div v-if="admin" class="bg-blue-3">postKey: {{ postKey }}</div>
    <post-header :postItemData="postItemData" />
    <post-container :postItemData="postItemData" />
    <post-footer :postItemData="postItemData" />
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  props: ["postItemData"],
  mixins: [mixinGeneral],

  computed: {
    postKey() {
      return this.postItemData.postKey;
    },
  },

  components: {
    "post-header": require("components/Post/Page/PageHeader.vue").default,
    "post-container": require("components/Post/Page/PageContainer.vue").default,
    "post-footer": require("components/Post/Page/PageFooter.vue").default,
  },
};
</script>

<style></style>
