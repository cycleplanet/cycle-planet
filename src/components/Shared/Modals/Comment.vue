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
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["path"],

  data() {
    return {
      newComment: "",
    };
  },

  computed: {},
  methods: {
    comment() {
      this.setItemAction({
        path: this.path + "/comments/" + this.timeStamp,
        data: {
          comment: this.newComment,
          date: this.timeStamp,
          user: this.loggedInUser.id,
        },
      });
      this.newComment = "";
    },
  },
};
</script>

<style></style>
