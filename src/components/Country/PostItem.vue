<template>
  <div>
    <div>
      <q-item class="no-padding">
        <q-item-section class="cp-h2">{{
          refsextra[refKey].title
        }}</q-item-section>
        <q-item-section side top>
          <div>
            <q-btn
              :style="buttonStyle"
              round
              icon="add"
              size="sm"
              @click.native="
                loggedIn ? AddPostMethod(refKey) : showLoginDialog()
              "
            />
            <q-btn
              flat
              @click.native="
                loggedIn ? AddPostMethod(refKey) : showLoginDialog()
              "
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
      <q-separator class="q-mb-sm" />
    </div>
    <div v-if="refKey === 'Blog' && blogPostsSorted">
      <q-virtual-scroll :items="[0]" virtual-scroll-horizontal>
        <div class="row no-wrap">
          <div
            v-for="(postItemData, postItemKey) in blogPostsSorted"
            :key="postItemKey"
          >
            <div v-if="postItemData.countries[countryKey]">
              <post-card :postItemData="postItemData" />
            </div>
          </div>
        </div>
      </q-virtual-scroll>
    </div>

    <div v-if="refKey === 'Video' && videoPostsSorted">
      <q-virtual-scroll :items="[0]" virtual-scroll-horizontal>
        <div class="row no-wrap">
          <div
            v-for="(postItemData, postItemKey) in videoPostsSorted"
            :key="postItemKey"
          >
            <div v-if="postItemData.countries[countryKey]">
              <post-card :postItemData="postItemData" />
            </div>
          </div>
        </div>
      </q-virtual-scroll>
    </div>

    <div v-if="refKey === 'Route'">
      <q-virtual-scroll :items="[0]" virtual-scroll-horizontal>
        <div class="row no-wrap">
          <div
            v-for="(postItemData, postItemKey) in routePostsSorted"
            :key="postItemKey"
          >
            <div v-if="postItemData.countries[countryKey]">
              <post-card :postItemData="postItemData" />
            </div>
          </div>
        </div>
      </q-virtual-scroll>
    </div>

    <q-dialog :maximized="!isWebApp" v-model="addBlogPostItemDialog">
      <add-blogpost
        @close="addBlogPostItemDialog = false"
        :refKey="refKey"
        :countryKey="countryKey"
      />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="addVideoPostItemDialog">
      <add-videopost
        @close="addVideoPostItemDialog = false"
        :refKey="refKey"
        :countryKey="countryKey"
      />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="addRoutePostItemDialog">
      <add-routepost @close="addRoutePostItemDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],

  props: ["countryKey", "refKey"],

  components: {
    "post-card": require("components/Post/PostCard.vue").default,

    "add-blogpost": require("components/Post/Dialogs/AddBlog.vue").default,
    "add-videopost": require("components/Post/Dialogs/AddVideo.vue").default,
    "add-routepost": require("components/Post/Dialogs/AddRoute.vue").default,
  },

  data() {
    return {
      editItem: false,

      addBlogPostItemDialog: false,
      addVideoPostItemDialog: false,
      addRoutePostItemDialog: false,

      blogMostPopularChip: true,
      blogNewestChip: false,

      videoMostPopularChip: true,
      videoNewestChip: false,
    };
  },

  computed: {
    ...mapState("country", ["countryData", "videoDataCountry"]),

    ...mapGetters("country", [
      "blogPostsSortedCountry",
      "blogPostsSortedByDateCountry",
      "videoPostsSortedCountry",
      "videoPostsSortedByDateCountry",
    ]),
  },

  methods: {
    editItemMethod() {
      this.editItem = true;
    },
    AddPostMethod(ref) {
      this.clickedRef = ref;
      if (ref === "Blog") {
        this.addBlogPostItemDialog = true;
      } else if (ref === "Video") {
        this.addVideoPostItemDialog = true;
      } else if (ref === "Route") {
        this.addRoutePostItemDialog = true;
      }
    },
  },
  mounted() {
    if (!this.loadedPosts) {
      this.getPosts();
    }
  },
};
</script>

<style></style>
