<template>
  <div>
    <q-card-section>
      <map-single-item :singleItemData="singleItemData" :draggable="false" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <p class="text-bold cp-h2">Most recent experiences</p>
      <div v-if="singleItemData.comments" class="q-pl-none">
        <div
          v-for="(comment, commentId, index) in singleItemData.comments"
          :key="index"
        >
          <div class="row flex items-center q-mt-sm">
            <modal-username2 :userId="comment.user" class="text-bold" />
            <div class="q-ml-sm">{{ comment.comment }}</div>
          </div>
          <div class="row">
            <nice-date2
              style="font-size: 10px;"
              class="text-grey q-ma-sm"
              :dateprop="comment.date"
            />
            <q-space></q-space>
            <q-icon
              name="more_vert"
              color="grey"
              size="xs"
              v-if="loggedIn ? roleEditor || comment.user === myUserId : false"
            >
              <q-menu>
                <q-list style="min-width: 100px;">
                  <q-item clickable v-close-popup>
                    <q-item-section
                      @click="
                        editCommentDialog = true;
                        editCommentString = comment;
                      "
                      >Edit</q-item-section
                    >
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section @click="deleteCommentMethod(comment.date)"
                      >Delete</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </div>

          <q-separator />
        </div>
      </div>
      <div v-else>
        <p class="text-italic">Be the first to comment on this item.</p>
      </div>
    </q-card-section>

    <q-card-actions>
      <comment-marker v-if="loggedIn" :itemKey="itemKey" />
    </q-card-actions>

    <q-dialog v-model="editCommentDialog">
      <q-card>
        <modal-header>Edit comment</modal-header>
        <div class="q-pa-sm">
          <q-input
            filled
            autogrow
            label="edit comment"
            v-model="editCommentString.comment"
          />
          <div class="row">
            <q-space></q-space>
            <q-btn
              :style="buttonStyle"
              size="sm"
              class="q-mt-sm"
              @click="editCommentMethod(editCommentString)"
              >Sumbit</q-btn
            >
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";
// import firebase from "firebase/app";
// import { firebase as firebaseConfig } from "boot/config";
import { firebase } from "boot/config";

export default {
  mixins: [mixinGeneral],
  props: ["singleItemData"],
  data() {
    return {
      editCommentDialog: false,
      editCommentString: {},
    };
  },

  computed: {
    refKey() {
      return this.singleItemData.refKey;
    },
    itemKey() {
      return this.singleItemData.itemKey;
    },
    countryKey() {
      return this.singleItemData.countryKey;
    },

    itemUserCreated: function () {
      return this.singleItemData.user_created;
    },
  },
  components: {
    "comment-marker": require("components/Shared/Modals/CommentMarker.vue")
      .default,
    "map-single-item": require("components/Shared/MapSingleItem.vue").default,
  },

  methods: {
    editCommentMethod(comment) {
      this.singleItemData.comments[comment.date] = comment;
      firebase.fs
        .collection("Markers")
        .doc(this.itemKey)
        .update({ comments: this.singleItemData.comments });

      this.editCommentDialog = false;
      this.editCommentString = {};
    },
    deleteCommentMethod(commentId) {
      firebase.fs
        .collection("Markers")
        .doc(this.itemKey)
        .set(
          {
            comments: {
              [commentId]: firebase.fs.FieldValue.delete(),
            },
          },
          { merge: true }
        );
    },
  },
};
</script>

<style></style>
