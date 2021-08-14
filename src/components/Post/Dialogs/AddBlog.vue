<template>
  <transition
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut absolute-top"
  >
    <q-card class="no-padding" style="width: 100%;">
      <q-form @submit="generateImage">
        <modal-header>Add blog post</modal-header>
        <q-card-section class="q-gutter-y-sm">
          <q-banner rounded class="bg-orange-2 text-orange-10"
            >All logged in users can add their own blog posts, but please make
            sure to follow our
            <span class="underline cursor-pointer" @click="clickGuidelines()"
              >guidelines</span
            >.
          </q-banner>
          <q-select
            outlined
            v-model="countryKey"
            use-input
            input-debounce="0"
            label="Select related country*"
            :options="countryKeys"
            behavior="menu"
            filled
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            outlined
            filled
            v-model="blogInput.title"
            label="Blog title *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            outlined
            filled
            v-model="blogInput.link"
            type="url"
            label="Blog link *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
        </q-card-section>
        <q-card-section>
          <div class="cp-h2">Select image</div>
          <croppa v-model="myCroppa"> </croppa>
        </q-card-section>
        <q-card-actions align="right" class="q-ml-sm">
          <q-btn label="Submit" :style="buttonStyle" type="submit" />
        </q-card-actions>

        <!-- <button @click="generateImage"> upload</button> -->
        <div>
          <!-- <q-btn label="Reset" type="reset" :style="buttonStyle" flat class="q-ml-sm" /> -->
        </div>
      </q-form>
    </q-card>
  </transition>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import "vue-croppa/dist/vue-croppa.css";
import Vue from "vue";
import Croppa from "vue-croppa";
import firebase from "firebase";
import { uid, Notify } from "quasar";

Vue.use(Croppa);

export default {
  props: ["refKey", "countryKey"],
  mixins: [mixinGeneral],

  data() {
    return {
      edit_tab: "edit_about",
      inputOtherUserDetails: {},
      blogInput: {},
      title: "",
      model: null,
      model2: null,
      shareOnCountryPage: true,
      tags: [],
      myCroppa: null,
      imgUrl: "",
      payload: {},
      downloadURL: "",
    };
  },

  computed: {},

  components: {},

  methods: {
    ...mapActions("post", ["newBlogPost"]),

    generateImage: function () {
      let url = this.myCroppa.generateDataUrl()("url :", url);
      if (!url) {
        alert("no image");
        return;
      }
      this.imgUrl = url;
      this.uploadResizedPhoto();
    },
    onFileTypeMismatch(file) {
      alert("jpg, gif, Please upload in png format. ");
    },

    onFileSizeExceed(file) {
      alert("Please upload the file with 2mb or less. ");
    },
    uploadResizedPhoto() {
      let newKey = uid();
      const photoImagesRef = firebase
        .storage()
        .ref("Posts_new/Blog")
        .child(newKey);
      this.myCroppa.generateBlob((blob) => {
        var upload = photoImagesRef.put(blob);
        upload.on(
          "state_changed",
          (snapshot) => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.downloadURL = downloadURL;
              this.onSubmit();
            });
          }
        );
      });
    },
    onSubmit() {
      this.payload.refKey = "Blog";
      this.payload.countryKey = this.countryKey;
      this.payload.data = {
        date_created: this.timeStamp,
        user_created: this.myUserId,
        title: this.blogInput.title,
        link: this.blogInput.link,
        image_url: this.downloadURL,
      };
      this.newBlogPost(this.payload);
      this.$emit("close");
    },
  },
};
</script>

<style></style>
