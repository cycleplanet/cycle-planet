<template>
  <div>
    <q-card
      :style="screenwidthbig ? 'width: 350px' : 'width: 240px'"
      class="q-mr-md bg-grey-1 no-padding"
    >
      <card-header :postItemData="postItemData" />

      <div v-if="postItemData.refKey === 'Video'">
        <video-embed
          :class="screenwidthbig ? 'big' : 'small'"
          :src="postItemData.link"
          sandbox="allow-popups allow-scripts"
        />
      </div>
      <div v-if="postItemData.refKey === 'Blog'">
        <q-img
          class="full-width"
          :src="postItemData.image_url"
          :ratio="16 / 9"
          @click="openUrl(postItemData.link)"
        />
      </div>
      <div v-if="postItemData.refKey === 'Route'">
        <gpx-track :postItemData="postItemData" style="height: 250px;" />
      </div>

      <card-footer :postItemData="postItemData" />
    </q-card>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  props: ["postItemData"],
  mixins: [mixinGeneral],

  data() {
    return {};
  },
  components: {
    "card-header": require("components/Post/Card/CardHeader.vue").default,
    "card-footer": require("components/Post/Card/CardFooter.vue").default,
    "gpx-track": require("components/Post/GpxTrack.vue").default,
  },
};
</script>
<style>
.blog-title {
  text-decoration: none;
  color: white;

  font-weight: 600;
  text-shadow: rgba(black, 0.4) 0 20px 20px;
}
.big > .embed-responsive-item {
  width: 350px;
  height: 200px;
}
.small > .embed-responsive-item {
  width: 240px;
  height: 137px;
}
</style>
