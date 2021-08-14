<template>
  <transition
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut absolute-top"
  >
    <q-card class="no-padding" style="width: 100%;">
      <q-form @submit="generateImage">
        <modal-header>Edit background image</modal-header>
        <q-card-section>
          <div class="cp-h2">Select image</div>
          <div v-if="type === 'background'">
            <croppa
              v-model="myCroppa"
              style="border: 1px solid black; width: 100%; height: 56%;"
              :canvas-color="'white'"
            >
              <canvas class="full-width" />
            </croppa>
          </div>
          <div v-else>
            <croppa
              v-model="myCroppa"
              style="border: 1px solid black;"
              :canvas-color="'white'"
              :width="180"
              :height="180"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-ml-sm" v-if="myCroppa">
          <q-btn label="Submit" color="secondary" type="submit" />
        </q-card-actions>

        <div></div>
      </q-form>
    </q-card>
  </transition>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

// import mixinGeneral from 'src/mixins/mixin-other-user-details.js'
import "vue-croppa/dist/vue-croppa.css";
import Vue from "vue";
import Croppa from "vue-croppa";
import firebase from "firebase";
import { uid, Notify } from "quasar";
import { date } from "quasar";

// const storage = firebase.storage()
// export const storageProfilePhotoRef = firebase.storage().ref('profilePhoto')

Vue.use(Croppa);

export default {
  mixins: [mixinGeneral],

  data() {
    return {
      selectedFile: "",

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
      updates: {},
      downloadURL: "",
    };
  },
  computed: {},

  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    onUpload() {},

    generateImage() {
      let url = this.myCroppa.generateDataUrl();
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
        .ref("users/" + this.myUserId)
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
              this.onSubmitBackgroundImage();
            });
          }
        );
      });
    },
    onSubmitBackgroundImage() {
      this.updateItemAction({
        data: { imageurl: this.downloadURL },
        path: "Users/" + this.myUserId,
      });

      this.$emit("close");
    },
  },
};
</script>

<style></style>
