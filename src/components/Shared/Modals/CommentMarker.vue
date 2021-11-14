<template>
  <q-list class="full-width">
    <q-item dense class="no-padding no-margin bg-grey-4" v-if="loggedInUser">
      <q-item-section avatar dense>
        <q-avatar v-if="!newComment" size="34px">
          <img :src="loggedInUser.imageurl" />
        </q-avatar>
        <q-btn
          dense
          @click="comment()"
          flat
          round
          icon="send"
          size="md"
          v-if="newComment"
        />
      </q-item-section>
      <!-- <q-item-section dense side class="no-padding no-margin" v-if="newComment">
            <q-btn dense @click="comment()" flat round icon="send" size="md"/>
        </q-item-section> -->

      <q-item-section>
        <q-input
          dense
          class="no-padding no-margin"
          :placeholder="'Comment as ' + loggedInUser.fullname"
          v-model="newComment"
          autogrow
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import { firebase } from "boot/config";

export default {
  mixins: [mixinGeneral],
  props: ["itemKey"],

  data() {
    return {
      newComment: "",
    };
  },

  computed: {
    itemData() {
      return this.landMarkers[this.itemKey];
    },
  },
  methods: {
    comment() {
      if (this.loggedIn) {
        let commentData = {
          comment: this.newComment,
          date: this.timeStamp,
          user: this.loggedInUser.id,
        };
        if (this.itemData.comments) {
          this.itemData.comments[this.timeStamp] = commentData;
        } else {
          this.itemData.comments = {
            [this.timeStamp]: commentData,
          };
        }
        firebase.fs
          .collection("Markers")
          .doc(this.itemKey)
          .update({ comments: this.itemData.comments });
      } else {
        this.showLoginDialog();
      }
      // this.setItemAction({
      //     path:this.path+'/comments/'+this.timeStamp,
      //     data:{
      //         comment:this.newComment,
      //         date:this.timeStamp,
      //         user:this.loggedInUser
      //     }
      // })
      this.newComment = "";
    },
  },
};
</script>

<style></style>
