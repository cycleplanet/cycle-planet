<template>
  <div>
    <p class="text-h6">About me</p>
    <div v-if="userData.bio">{{ userData.bio }}</div>
    <q-separator class="q-my-lg" />

    <p class="text-h6">Interests</p>
    <p>{{ userData.interests }}</p>
    <q-separator class="q-my-lg" />
    <div class="">
      {{ getImages }}
      <div class="text-h6">Photos</div>
      <q-virtual-scroll virtual-scroll-horizontal :items="[0]">
        <div class="row no-wrap q-gutter-xs">
          <div class="bg-grey-3" v-if="myProfile">
            <q-btn
              style="margin: 50px;"
              outline
              round
              icon="add"
              @click="addPictureDialog = true"
            />
          </div>
          <div v-for="(userImage, index) in imageTest" :key="index">
            <q-img
              @click="showPictureMethod(index)"
              style="width: 150px; height: 150px;"
              :src="userImage"
              class="cursor-pointer"
            />
          </div>
        </div>
      </q-virtual-scroll>
      <!-- <div class="row q-gutter-xs">
					<div v-for="(userImage, index) in imageTest" :key="index" >
						<q-img @click="showPictureMethod(index)" style="width:112px;height:112px" :src="userImage" class="cursor-pointer"/>
					</div>
				</div> -->
    </div>
    <q-separator class="q-my-lg" />
    <p class="text-h6">Countries cycled</p>
    <div class="row no-margin">
      <div
        v-for="(country, countryKey) in userData.countries_cycled_new"
        class="no-margin"
        :key="countryKey"
      >
        <modal-countrychip :countryKey="country" class="no-margin" />
      </div>
    </div>
    <q-separator class="q-my-lg" />

    <p class="text-h6 q-mt-md">Gear</p>
    <q-card-section class="q-pt-none no-margin no-padding">
      <q-list dense>
        <div
          v-for="(gear, gearKey) in userData.gear_list_new"
          :key="gearKey"
          class="q-mt-md"
        >
          <b>{{ gearKey }}</b>
          <div v-for="(item, itemKey) in gear" :key="itemKey">
            <div v-if="Object.keys(item).length === 1">
              <q-item dense>
                <q-item-section>
                  <q-item-label
                    >{{ itemKey }}: {{ Object.values(item)[0] }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </div>
            <div v-if="Object.keys(item).length > 1">
              <div class="q-ml-md">{{ itemKey }}:</div>
              <q-item
                dense
                v-for="(childitem, childitemKey) in item"
                :key="childitemKey"
              >
                <q-item-section class="q-ml-md">
                  <q-item-label>{{ childitem }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-list>
    </q-card-section>
    <q-separator class="q-my-lg" />
    <div v-if="admin" class="bg-blue-3">
      <div>loadedPosts:{{ loadedPosts }}</div>
    </div>
    <div class="row">
      <div class="text-h6">Routes</div>
      <q-space></q-space>
      <q-btn
        round
        size="sm"
        v-if="myProfile"
        :style="buttonStyle"
        icon="add"
        @click.native="AddPostMethod('Route')"
      />
    </div>
    <div class="q-mt-md">
      <q-virtual-scroll :items="[0]" virtual-scroll-horizontal>
        <div class="row no-wrap">
          <div
            v-for="(postItemData, postItemKey, index) in routePostsSorted"
            :key="index"
            class="row no-wrap"
          >
            <div v-if="postItemData.user_created === userId">
              <post-card :postItemData="postItemData" />
            </div>
          </div>
        </div>
      </q-virtual-scroll>
    </div>
    <q-separator class="q-my-lg" />

    <div class="row">
      <div class="text-h6">Blog posts</div>
      <q-space></q-space>
      <q-btn
        round
        size="sm"
        v-if="myProfile"
        :style="buttonStyle"
        icon="add"
        @click.native="AddPostMethod('Blog')"
      />
    </div>

    <div class="q-mt-md" v-if="Object.keys(blogPostsSorted).length > 0">
      <q-virtual-scroll :items="[0]" virtual-scroll-horizontal>
        <div class="row no-wrap">
          <div
            v-for="(postItemData, postItemKey, index) in blogPostsSorted"
            :key="index"
            class="row no-wrap"
          >
            <div v-if="postItemData.user_created === userId">
              <post-card :postItemData="postItemData" />
            </div>
          </div>
        </div>
      </q-virtual-scroll>
    </div>
    <q-separator class="q-my-lg" />

    <div class="row">
      <div class="text-h6">Video posts</div>
      <q-space></q-space>
      <q-btn
        round
        size="sm"
        v-if="myProfile"
        :style="buttonStyle"
        icon="add"
        @click.native="AddPostMethod('Video')"
      />
    </div>

    <div class="q-mt-md" v-if="Object.keys(videoPostsSorted).length > 0">
      <q-virtual-scroll :items="[0]" virtual-scroll-horizontal>
        <div class="row no-wrap">
          <div
            v-for="(postItemData, postItemKey, index) in videoPostsSorted"
            :key="index"
            class="row no-wrap"
          >
            <div v-if="postItemData.user_created === userId">
              <post-card :postItemData="postItemData" />
            </div>
          </div>
        </div>
      </q-virtual-scroll>
    </div>

    <q-dialog :maximized="!isWebApp" v-model="addRoutePostItemDialog">
      <add-routepost @close="addRoutePostItemDialog = false" />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="addBlogPostItemDialog">
      <add-blogpost
        @close="addBlogPostItemDialog = false"
        :refKey="'Blog'"
        :countryKey="''"
      />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="addVideoPostItemDialog">
      <add-videopost
        @close="addVideoPostItemDialog = false"
        :refKey="'Video'"
        :countryKey="''"
      />
    </q-dialog>

    <q-dialog v-model="showPictureDialog" class="absolute-center">
      <q-card style="width: 100%; height: auto;" class="absolute-center">
        <div class="absolute-left" v-if="myProfile">
          <q-chip
            label="profile picture"
            v-if="imageTest[showPicture] === userData.imageurl"
            class="bg-amber"
          />
          <q-chip
            label="background picture"
            v-if="imageTest[showPicture] === userData.backgroundimageurl"
            class="bg-amber"
          />
        </div>
        <div class="absolute-left q-ml-lg">
          <q-btn
            v-if="showPicture > 0"
            flat
            dense
            icon="chevron_left"
            class="bg-white absolute-center"
            @click="showPicture--"
          />
        </div>
        <div class="absolute-right q-ma-sm">
          <q-btn
            flat
            dense
            icon="close"
            class="bg-white"
            @click="
              showPictureDialog = false;
              showPicture = '';
            "
          />
          <q-btn
            flat
            dense
            v-if="showPicture + 1 < Object.keys(imageTest).length"
            class="bg-white absolute-center"
            icon="navigate_next"
            @click="showPicture++"
          />
          <q-btn
            v-if="myProfile"
            flat
            dense
            icon="delete"
            class="bg-red text-white absolute-bottom"
            @click="deleteUserPicture()"
          />
        </div>
        <img :src="imageTest[showPicture]" style="height: 100%; width: 100%;" />
      </q-card>
    </q-dialog>

    <q-dialog :maximized="isWebApp ? false : true" v-model="addPictureDialog">
      <add-picture @close="addPictureDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
// import { firebase as firebaseConfig } from "boot/config";
import { firebase } from "boot/config";

// import firebase from "firebase/app";
import { date } from "quasar";
import Vue from "vue";
import Embed from "v-video-embed";

export default {
  mixins: [mixinGeneral],
  props: ["userData"],
  data() {
    return {
      addRoutePostItemDialog: false,
      addBlogPostItemDialog: false,
      addVideoPostItemDialog: false,
      blogMostPopularChip: true,
      blogNewestChip: false,
      videoMostPopularChip: true,
      videoNewestChip: false,
      imageTest: [],
      showPictureDialog: false,
      showPicture: "",
      addPictureDialog: false,
    };
  },
  components: {
    "add-routepost": require("components/Post/Dialogs/AddRoute.vue").default,
    "add-blogpost": require("components/Post/Dialogs/AddBlog.vue").default,
    "add-videopost": require("components/Post/Dialogs/AddVideo.vue").default,
    "post-card": require("components/Post/PostCard.vue").default,
    "add-picture": require("components/Profile/AddPicture.vue").default,
  },

  computed: {
    userId: function () {
      return this.userData.userId;
    },

    // userData: function () {
    // 	return this.users[this.userId]
    // },
    myProfile() {
      if (this.userId === this.myUserId) {
        return true;
      } else {
        return false;
      }
    },
    getImages() {
      var storageRef = firebase.storage.ref("/users/" + this.userId);
      storageRef
        .listAll()
        .then((result) => {
          result.items.forEach((imageRef) => {
            this.testmethod(imageRef);
          });
        })
        .catch((error) => {});
    },
  },
  methods: {
    ...mapActions("post", ["destroyData"]),
    deleteUserPicture() {
      let url = this.imageTest[this.showPicture];
      let url1 = url.split("%2F");
      let url2 = url1[2].split("?alt");
      let docName = url2[0];
      firebase.storage
        .ref("/users/" + this.userId)
        .child(docName)
        .delete()
        .then(() => {
          this.$delete(this.imageTest, this.showPicture);
          this.showPictureDialog = false;
        })
        .catch((error) => {});
    },

    AddPostMethod(ref) {
      if (ref === "Blog") {
        this.addBlogPostItemDialog = true;
      } else if (ref === "Video") {
        this.addVideoPostItemDialog = true;
      } else if (ref === "Route") {
        this.addRoutePostItemDialog = true;
      }
    },
    clickBlogChip(value) {
      if (value === "popular") {
        this.blogMostPopularChip = true;
        this.blogNewestChip = false;
      } else {
        this.blogMostPopularChip = false;
        this.blogNewestChip = true;
      }
    },
    clickVideoChip(value) {
      if (value === "popular") {
        this.videoMostPopularChip = true;
        this.videoNewestChip = false;
      } else {
        this.videoMostPopularChip = false;
        this.videoNewestChip = true;
      }
    },
    testmethod(imageRef) {
      this.imageTest = [];
      imageRef
        .getDownloadURL()
        .then((url) => {
          this.imageTest.push(url);
          // TODO: Display the image on the UI
        })
        .catch((error) => {
          // Handle any errors
        });
    },
    showPictureMethod(index) {
      this.showPictureDialog = true;
      this.showPicture = index;
    },
  },

  destroyed() {
    //call a method when page is left
    this.destroyData();
  },
  created() {},
};
</script>

<style></style>
