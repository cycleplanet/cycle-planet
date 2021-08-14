<template>
  <q-layout view="Lhh lpR fff" container class="bg-white">
    <q-header class="bg-amber text-black">
      <modal-header>Post details</modal-header>
    </q-header>
    <q-page-container class="q-pa-sm" v-if="postItemData">
      <div class="row q-mt-sm flex items-center">
        <div>Created by</div>
        <div><modal-username2 :userId="postItemData.user_created" /></div>
        <div class="q-mx-sm">on</div>
        <div><nice-date2 :dateprop="postItemData.date_created" /></div>
      </div>
      <div class="text-h6">{{ postItemData.title }}</div>
      <div>
        {{
          postItemData.description
            ? postItemData.description
            : "There is no desciption."
        }}
      </div>
      <div class="row q-gutter-x-sm q-mt-sm">
        <div
          v-for="(country, countryKey, index) in postItemData.countries"
          :key="index"
        >
          <modal-countrychip2 :countryKey="countryKey" />
        </div>
      </div>

      <q-separator></q-separator>
      <div class="text-h6">Comments</div>
      <div v-if="postItemData.comments">
        <div
          v-for="(comment, commentKey) in postItemData.comments"
          :key="commentKey"
          class="q-mt-sm"
        >
          <div class="row">
            <div class="col-2">
              <q-avatar
                size="md"
                class="cursor-pointer q-mt-xs"
                @click="clickuser(comment.user)"
              >
                <img :src="users[comment.user].imageurl" />
              </q-avatar>
            </div>
            <div class="col">
              <div>
                <b
                  class="q-mr-sm cursor-pointer"
                  @click="clickuser(comment.user)"
                  >{{ users[comment.user].fullname }}</b
                >{{ comment.comment }}
              </div>
              <nice-date2 :dateprop="comment.date" />
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
    <q-footer class="bg-white q-pa-sm text-black">
      <comment
        v-if="loggedIn"
        class="full-width"
        :path="'Posts/' + postItemData.postKey"
      />
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  props: ["postItemData"],
  mixins: [mixinGeneral],

  components: {
    comment: require("components/Shared/Modals/Comment.vue").default,
    "like-post": require("components/Post/Modals/LikePost.vue").default,
  },
  methods: {
    opengpxurl(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style></style>
