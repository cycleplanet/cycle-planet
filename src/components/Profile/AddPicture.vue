<template>
  <div>
    <q-card class="no-padding" style="width: 100%; min-height: 300px;">
      <modal-header>Add image</modal-header>
      <div class="q-ma-sm">
        <q-banner class="bg-green-2 text-green-10">
          <div>
            To keep our services free of costs, we try to limit the data in our
            database. Therefore, the maximum size of your picture should be
            below 200 kB.
          </div>
        </q-banner>

        <div class="q-mt-md">
          <input type="file" @change="previewImage" accept="image/*" />
          <q-icon
            v-if="sizedata"
            :name="sizedata < 201 ? 'check_circle' : 'highlight_off'"
            :class="sizedata < 201 ? 'text-green' : 'text-red'"
          />
        </div>

        <img v-if="url" :src="url" style="width: 100%; max-width: 200px;" />
        <div
          v-if="sizedata"
          :class="sizedata < 201 ? 'text-green' : 'text-red'"
        >
          {{
            sizedata < 201 ? "" : "The picture is too large: " + sizedata + "kB"
          }}
        </div>

        <div v-if="uploadValue">
          <p>
            Progress: {{ uploadValue.toFixed() + "%" }}
            <progress id="progress" :value="uploadValue" max="100"></progress>
          </p>
        </div>

        <div v-if="imageData != null && sizedata < 201">
          <br />
          <button @click="onUpload">Upload</button>
        </div>
      </div>
    </q-card>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
// import firebase from "firebase";
import { firebase } from "boot/config";

export default {
  name: "Upload",
  mixins: [mixinGeneral],
  props: ["type"],

  data() {
    return {
      imageData: null,
      picture: null,
      uploadValue: 0,
      sizedata: 0,
      test: "",
      url: null,
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
    readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          this.test = e.target.result;
        };

        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
    },

    previewImage(event) {
      const file = event.target.files[0];
      this.url = URL.createObjectURL(file);
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event.target.files[0];
      this.sizedata = event.target.files[0].size / 1000;
      let resizeFactor = this.sizeData / 200000;
      if (resizeFactor > 1) {
      }
    },

    onUpload() {
      this.picture = null;
      let pathStorage = "users/" + this.myUserId + "/" + this.imageData.name;
      const storageRef = firebase
        .storage()
        .ref(pathStorage)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {},
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.picture = url;
            this.$emit("close");
          });
        }
      );
    },
  },
};
</script>
<style scoped="">
img.preview {
  width: 200px;
}
</style>
