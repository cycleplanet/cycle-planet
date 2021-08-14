<template>
  <q-card class="no-padding" style="width: 100%;">
    <modal-header>Edit Border Marker</modal-header>
    <q-form @submit.prevent.stop="submitMarker()" ref="myForm">
      <q-card-section class="q-gutter-y-md">
        <q-banner dense rounded class="bg-green-2 text-green-10" v-if="canEdit"
          >You can edit the <b>cities</b> and <b>coordinates</b> because you
          {{
            admin
              ? "are an admin."
              : roleEditor
              ? "are an editor."
              : data.user_created === myUserId
              ? "created this item."
              : ""
          }}</q-banner
        >

        <q-banner
          inline-actions
          rounded
          class="bg-orange text-white"
          v-if="!canEdit"
          >To edit country/title/coordinates you need to be an
          <span class="underline cursor-pointer" @click="applyEditor = true"
            >editor</span
          ></q-banner
        >

        <div v-if="canEdit" class="q-gutter-md">
          <div class="text-bold">From:</div>
          <q-select
            label="Country"
            disabled
            v-model="data.country1.country"
            filled
          />
          <q-input label="City" v-model="data.country1.city" filled />
          <div class="text-bold">To:</div>
          <q-select
            label="Country"
            disabled
            v-model="data.country2.country"
            filled
          />
          <q-input label="City" v-model="data.country2.city" filled />
          <div class="text-bold">Coordinates:</div>
          <q-input label="Latitude" v-model="marker.position.lat" filled />
          <q-input label="Longitude" v-model="marker.position.lng" filled />
          <q-btn
            label="update map"
            @click="updateCoords()"
            :class="
              mapUpdated ? 'text-grey bg-white' : 'text-white bg-secondary'
            "
          />
          <q-banner
            inline-actions
            rounded
            class="bg-green-2 text-green-10"
            v-if="canEdit"
          >
            <template v-slot:avatar>
              <q-icon name="star" size="sm" />
            </template>
            PRO TIP:
            {{
              isWebApp
                ? "You can also drag the marker to a position to change the coordinates."
                : "In the desktop version you can drag the marker to the right position."
            }}
          </q-banner>
        </div>
        <div v-else>
          <p>
            <b>From:</b> {{ data.country1.country }} ({{ data.country1.city }})
          </p>
          <p>
            <b>To:</b> {{ data.country2.country }} ({{ data.country2.city }})
          </p>
          <p><b>Latitude:</b> {{ marker.position.lat }}</p>
          <p><b>Longitude:</b> {{ marker.position.lng }}</p>
        </div>

        <div>
          <l-map
            :options="
              screenwidthbig
                ? { scrollWheelZoom: false }
                : { scrollWheelZoom: false, dragging: false, tap: false }
            "
            style="height: 250px;"
            :zoom="11"
            :center="data.coordinates"
          >
            <l-tile-layer
              :url="mapsettings.url"
              :attribution="mapsettings.attribution"
            ></l-tile-layer>
            <l-marker
              :lat-lng.sync="marker.position"
              :draggable="canEdit ? true : false"
            >
              <l-icon
                :icon-size="dynamicSize"
                :icon-anchor="dynamicAnchor"
                :icon-url="markerlist[refKey].iconurl"
              >
              </l-icon>
            </l-marker>
          </l-map>
        </div>

        <div class="text-bold">Description:</div>
        <q-banner rounded class="bg-orange-2 text-orange-10"
          >All logged in users can edit the description, but please make sure to
          follow our
          <span class="underline cursor-pointer" @click="clickGuidelines()"
            >guidelines</span
          >.</q-banner
        >
        <q-editor
          @paste.native="(evt) => pasteCapture(evt)"
          ref="editor_ref"
          v-model="data.description"
          :dense="$q.screen.lt.md"
          :toolbar="[
            ['bold', 'italic', 'underline'],
            ['link'],
            ['unordered', 'ordered'],
            ['viewsource'],
          ]"
        >
        </q-editor>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" :style="buttonStyle" type="submit" />
      </q-card-actions>

      <q-dialog v-model="applyEditor">
        <apply-editor @close="applyEditor = false" />
      </q-dialog>
    </q-form>
  </q-card>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";
import {
  LMap,
  LTileLayer,
  LControl,
  LMarker,
  LIcon,
  LPopup,
  LFeatureGroup,
} from "vue2-leaflet";

export default {
  props: ["singleItemData"],
  mixins: [mixinGeneral],
  components: {
    LMap,
    LTileLayer,
    LControl,
    LMarker,
    LIcon,
    LPopup,
    LFeatureGroup,
    "apply-editor": require("components/Shared/ApplyEditor.vue").default,
  },
  data() {
    return {
      applyEditor: false,
      marker: {
        position: {
          lat: this.singleItemData.coordinates.lat,
          lng: this.singleItemData.coordinates.lng,
        },
      },
      data: {},
    };
  },
  computed: {
    refKey() {
      return this.singleItemData.refKey;
    },
    itemKey() {
      return this.singleItemData.itemKey;
    },

    canEdit() {
      if (
        this.admin ||
        this.roleEditor ||
        this.data.user_created === this.myUserId
      ) {
        return true;
      } else {
        return false;
      }
    },
    mapUpdated() {
      if (
        this.data.coordinates.lat === this.marker.position.lat &&
        this.data.coordinates.lng === this.marker.position.lng
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    updateCoords() {
      this.data.coordinates.lat = this.marker.position.lat;
      this.data.coordinates.lng = this.marker.position.lng;
      this.marker.position.lat = this.data.coordinates.lat;
      this.marker.position.lng = this.data.coordinates.lng;
    },
    submitMarker() {
      this.data.date_edited = this.timeStamp;
      this.data.user_edited = this.myUserId;
      this.data.coordinates.lat = this.marker.position.lat;
      this.data.coordinates.lng = this.marker.position.lng;
      this.updateItemActionFs({
        collection: "Markers",
        doc: this.itemKey,
        data: this.data,
      });
      this.$emit("close");
    },
  },
  mounted() {
    this.data = Object.assign({}, this.singleItemData);
  },
};
</script>
