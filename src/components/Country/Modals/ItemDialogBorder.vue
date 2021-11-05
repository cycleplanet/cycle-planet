<template>
  <q-card class="no-padding" style="width: 100%;">
    <modal-header>Details</modal-header>
    <div class="q-pa-sm q-gutter-sm">
      <q-btn
        :style="buttonStyle"
        rounded
        icon="map"
        label="Open in map"
        @click="
          isWebApp
            ? openUrl(
                'https://www.openstreetmap.org/#map=19/' +
                  singleItemData.coordinates.lat +
                  '/' +
                  singleItemData.coordinates.lng
              )
            : openMapUrl(
                singleItemData.coordinates.lat,
                singleItemData.coordinates.lng
              )
        "
      />
      <q-btn
        v-if="loggedIn"
        :style="buttonStyle"
        rounded
        icon="edit"
        label="edit"
        @click="edit"
      />
      <q-btn
        v-if="loggedIn"
        :style="buttonStyle"
        rounded
        icon="flag"
        label="Report"
        @click="report"
      />
      <q-btn
        v-if="loggedIn ? teamMember : false"
        color="red"
        rounded
        icon="delete"
        label="Delete"
        @click="deleteItemAction"
      />
      <!-- <q-btn :style="buttonStyle" rounded icon="share" label="Share"  @click="shareItem()"/> -->
    </div>
    <div class="row text-overline q-ml-md">
      <div>created by</div>
      <div><username-avatar :userId="singleItemData.user_created" /></div>
      <div class="q-mx-sm">on</div>
      <div><date-created :dateprop="singleItemData.date_created" /></div>
      <div v-if="singleItemData.user_edited" class="row">
        • last edited by
        <username-avatar class="q-mr-sm" :userId="singleItemData.user_edited" />
        on
        <date-created class="q-mx-sm" :dateprop="singleItemData.date_edited" />
      </div>
    </div>

    <div>
      <q-card-section>
        <div>
          <p class="text-bold cp-h2">General</p>
          <p class="text-subtitle1">
            Border crossing from
            <b>
              {{ singleItemData.country1.country }} ({{
                singleItemData.country1.city
              }}) </b
            >to<b>
              {{ singleItemData.country2.country }} ({{
                singleItemData.country2.city
              }})</b
            >
          </p>
          <div class="row text-subtitle1">
            <p class="q-mr-md">
              <b>Latitude:</b> {{ singleItemData.coordinates.lat }}
            </p>
            <p><b>Longitude:</b> {{ singleItemData.coordinates.lng }}</p>
          </div>
          <p class="text-bold text-subtitle1">Description</p>
          <p class="text-subtitle1" v-html-safe="singleItemData.description"></p>
        </div>
      </q-card-section>
      <q-card-section>
        <map-single-item :singleItemData="singleItemData" />
      </q-card-section>
    </div>

    <q-card-section class="q-pt-none">
      <p class="text-bold cp-h2">Most recent experiences</p>
      <div v-if="singleItemData.comments" class="q-pl-none">
        <div
          v-for="(comment, commentId, index) in singleItemData.comments"
          :key="index"
          class="row"
        >
          <username-avatar :userId="comment.user" class="text-bold" />
          <q-item-label class="q-ma-sm">{{ comment.comment }}</q-item-label>
          <q-separator></q-separator>
        </div>
      </div>
      <!-- <p>hello</p> -->
    </q-card-section>

    <q-card-actions>
      <comment-marker v-if="loggedIn" :itemKey="singleItemData.itemKey" />
    </q-card-actions>

    <q-dialog v-model="editBorderItemDialog">
      <edit-marker-border
        @close="editBorderItemDialog = false"
        :singleItemData="singleItemData"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";
import { date } from "quasar";
import Vue from 'vue';
import VueSecureHTML from 'vue-html-secure';

Vue.use(VueSecureHTML);

export default {
  props: ["singleItemData"],
  mixins: [mixinGeneral],

  data() {
    return {
      commentPath: "",
      editListItemDialog: false,
      editBorderItemDialog: false,
    };
  },

  components: {
    "comment-marker": require("components/Shared/Modals/CommentMarker.vue")
      .default,
    "map-single-item": require("components/Shared/MapSingleItem.vue").default,
    "edit-marker-border": require("components/Map/Modals/EditMarkerBorder.vue")
      .default,
  },
  computed: {},
  methods: {
    edit() {
      this.editBorderItemDialog = true;
    },
    report() {
      this.$q
        .dialog({
          title: "Report",
          message: "Why do you want to report this item?",
          prompt: {
            model: "",
            isValid: (val) => val.length > 2, // << here is the magic
            type: "text", // optional
          },
          ok: {
            push: true,
            label: "report",
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.reportPost({
            data: {
              issue: data,
              listItem: this.singleItemData.listItemIndex,
              id: "Border_item",
              date: this.timeStamp,
              user: this.myUserId,
            },
          });
        });
    },
    deleteItemAction() {
      this.$q
        .dialog({
          title: "Delete",
          message: "Are you sure you want to delete this item?",

          ok: {
            push: true,
            label: "delete",
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.deleteItemActionFs({
            collection: "Markers",
            doc: this.itemKey,
          });
        });
    },
  },
};
</script>

<style></style>
