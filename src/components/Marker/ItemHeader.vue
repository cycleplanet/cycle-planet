<template>
  <div v-if="singleItemData">
    <div class="q-pa-sm q-gutter-sm row flex items-center">
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
        @click="editMethod"
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
        :style="buttonStyle"
        rounded
        icon="share"
        label="Share"
        @click="shareItem()"
      />
      <q-btn
        v-if="
          loggedIn
            ? roleEditor || singleItemData.user_created === myUserId
            : false
        "
        color="red"
        rounded
        icon="delete"
        label="Delete"
        @click="deleteItemMethod"
      />
      <like-item :singleItemData="landMarkers[itemKey]" />
    </div>

    <div class="row text-overline q-ml-md">
      <div>{{ markerlist[refKey].title }} • created by</div>
      <div><modal-username2 :userId="singleItemData.user_created" /></div>
      <div class="q-mx-sm">on</div>
      <div><nice-date2 :dateprop="singleItemData.date_created" /></div>
      <div
        v-if="
          singleItemData.user_edited &&
          singleItemData.user_edited !== singleItemData.user_created
        "
        class="row"
      >
        • last edited by
        <modal-username2 class="q-mr-sm" :userId="singleItemData.user_edited" />
        on
        <nice-date2 class="q-mx-sm" :dateprop="singleItemData.date_edited" />
      </div>
    </div>
    <div class="q-ma-sm">
      <q-banner
        v-if="refKey === 'Wildcamping'"
        rounded
        class="bg-orange-2 text-orange-10"
      >
        <div class="q-mb-sm">
          <q-icon name="warning" />In some countries it's not allowed to camp in
          the wild, and it would be against our house rules to violate local
          laws. However, as wild camping is part of the biketouring experience,
          we rather educate people how to do it right, instead of discouraging
          it. So when you do wild camp, make sure to:
        </div>
        <div>
          - ALWAYS clean up your trash, and even try to pick up other trash.
        </div>
        <div>
          - If someone asks you to leave, we'd like to close this marker. Please
          report.
        </div>
        <div></div>
      </q-banner>
    </div>

    <q-dialog :maximized="!isWebApp" v-model="editEmbassyItemDialog">
      <edit-marker-embassy
        @close="editEmbassyItemDialog = false"
        :singleItemData="singleItemData"
      />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="editOtherItemDialog">
      <edit-marker
        @close="editOtherItemDialog = false"
        :singleItemData="singleItemData"
      />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="editBorderItemDialog">
      <edit-marker-border
        @close="editBorderItemDialog = false"
        :singleItemData="singleItemData"
      />
    </q-dialog>

    <q-dialog v-model="shareDialog">
      <share-dialog :slug="'item/' + itemKey" :title="singleItemData.title" />
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],
  props: ["singleItemData"],

  data() {
    return {
      editEmbassyItemDialog: false,
      editBorderItemDialog: false,
      editOtherItemDialog: false,
      shareDialog: false,
      itemData: {},
    };
  },
  components: {
    "edit-marker-embassy": require("components/Map/Modals/EditMarkerEmbassy.vue")
      .default,
    "edit-marker-border": require("components/Map/Modals/EditMarkerBorder.vue")
      .default,
    "edit-marker": require("components/Map/Modals/EditMarker.vue").default,
    "like-item": require("components/Shared/Modals/LikeMarker.vue").default,
    "share-dialog": require("components/Shared/ShareDialog.vue").default,
  },

  computed: {
    refKey() {
      return this.singleItemData.refKey;
    },
    itemKey() {
      return this.singleItemData.itemKey;
    },
    countryKey() {
      if (this.singleItemData.countryKey) {
        return this.singleItemData.countryKey;
      }
    },
  },

  methods: {
    shareItem() {
      this.shareDialog = true;
    },
    editMethod() {
      if (this.refKey === "Embassy") {
        this.editEmbassyItemDialog = true;
      } else if (this.refKey === "Border_item") {
        this.editBorderItemDialog = true;
      } else {
        this.editOtherItemDialog = true;
      }
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
          this.setItemAction({
            path: "Reports/" + this.timeStamp,
            data: {
              issue: data,
              markerId: this.itemKey,
              date: this.timeStamp,
              user: this.myUserId,
            },
          });
        });
    },
    deleteItemMethod() {
      this.$q
        .dialog({
          title: "Delete",
          message: "Are you sure you want to delete this item?",
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.deleteItemActionFs({
            collection: "Markers",
            doc: this.itemKey,
          });
          this.$router.push("/map");
        });
    },
  },
};
</script>

<style></style>
