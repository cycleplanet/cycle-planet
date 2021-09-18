<template>
  <q-card class="no-padding" style="width: 100%;">
    <modal-header>Add Visa Marker</modal-header>
    <q-form @submit.prevent="submitMarker()" ref="myForm">
      <q-card-section class="q-gutter-sm">
        <modal-banner />
        <q-toggle v-model="payload.onlineVisa" label="Online visa?" />
        <div v-if="payload.onlineVisa">
          <q-input filled v-model="payload.website" label="Website" />
        </div>
        <div v-else class="q-gutter-sm">
          <div class="q-gutter-y-md">
            <q-banner
              inline-actions
              rounded
              key="banner"
              class="bg-green-2 text-green-10"
            >
              <template v-slot:avatar>
                <q-icon name="star" size="sm" />
              </template>
              PRO TIP: You can click on the map to get the coordinates.
              {{
                isWebApp
                  ? "You can also drag the marker to a position to change the coordinates."
                  : "In the desktop version you can drag the marker to the right position."
              }}
            </q-banner>
            <l-map
              @click="clickCoordinates"
              :options="
                screenwidthbig
                  ? { scrollWheelZoom: false }
                  : { scrollWheelZoom: false, dragging: false, tap: false }
              "
              style="height: 250px;"
              :zoom="zoom"
              :center="payload.coordinates"
              key="map"
              :max-bounds="mapsettings.bounds"
            >
              <l-tile-layer
                :url="mapsettings.url"
                :attribution="mapsettings.attribution"
              ></l-tile-layer>
              <l-marker
                v-if="payload.coordinates.lat && payload.coordinates.lng"
                :lat-lng.sync="payload.coordinates"
                :draggable="true"
              >
                <l-icon
                  :icon-size="dynamicSize"
                  :icon-anchor="dynamicAnchor"
                  :icon-url="markerlist[refKey].iconurl"
                >
                </l-icon>
              </l-marker>
              <l-control position="topleft" class="q-ma-md">
                <q-btn
                  icon="add"
                  dense
                  class="row bg-white q-pa-xs"
                  size="sm"
                  @click="zoom++"
                />
                <q-btn
                  icon="remove"
                  dense
                  class="row bg-white q-pa-xs q-mt-sm"
                  size="sm"
                  @click="zoom--"
                />
              </l-control>
            </l-map>
          </div>
          <modal-location :payload.sync="payload" />

          {{ currentLocation }}
          <q-select
            filled
            :options="countryKeys"
            v-model="payload.country_located"
            label="In which country do you apply for this visa?"
            behavior="menu"
            :rules="[(val) => !!val || 'Field is required']"
          />
          <q-input
            filled
            v-model="payload.city"
            label="City"
            :rules="[(val) => (val && val.length > 0) || 'Field is required']"
          />
        </div>
        <q-select
          filled
          v-if="!countryKey"
          :options="countryKeys"
          v-model="payload.country"
          label="For which country is this visa?"
          behavior="menu"
          :rules="[(val) => !!val || 'Field is required']"
        />
        <q-select
          disable
          filled
          v-if="countryKey"
          :options="countryKeys"
          v-model="countryKey"
          label="For which country is this visa?"
          behavior="menu"
          :rules="[(val) => !!val || 'Field is required']"
        />
      </q-card-section>

      <q-card-section>
        <q-list bordered>
          <q-item class="text-bold">
            <q-item-section>
              <div class="row">
                Type
                <q-icon name="help" class="q-pa-xs text-grey">
                  <q-tooltip
                    content-class="bg-purple"
                    content-style="font-size: 16px"
                  >
                    What kind of visa is it? For example: this can be a tourist
                    visa with single entry, or a bussines visa.
                  </q-tooltip>
                </q-icon>
              </div>
            </q-item-section>
            <q-item-section
              ><div class="row">
                Length
                <q-icon name="help" class="q-pa-xs text-grey">
                  <q-tooltip
                    content-class="bg-purple"
                    content-style="font-size: 16px"
                  >
                    Specify for how long this type is valid, in days or months.
                  </q-tooltip>
                </q-icon>
              </div></q-item-section
            >
            <q-item-section
              ><div class="row">
                Costs
                <q-icon name="help" class="q-pa-xs text-grey">
                  <q-tooltip
                    content-class="bg-purple"
                    content-style="font-size: 16px"
                  >
                    Specify the cost of this type of visa, in the currency that
                    you need to use.
                  </q-tooltip>
                </q-icon>
              </div></q-item-section
            >
          </q-item>
          <q-separator />

          <div v-for="visa in payload.visas" :key="visa">
            <q-item clickable v-ripple>
              <q-item-section>{{ visa.title }}</q-item-section>
              <q-item-section>{{ visa.leng }}</q-item-section>
              <q-item-section>{{ visa.costs }}</q-item-section>
            </q-item>
            <q-separator />
          </div>
          <q-item v-if="addVisa" class="no-padding">
            <q-form
              @submit.prevent="submitVisa()"
              class="q-gutter-sm full-width"
            >
              <q-input filled v-model="visas.title" label="Type" />
              <q-input filled v-model="visas.leng" label="Length" />
              <q-input filled v-model="visas.costs" label="Costs" />
            </q-form>
          </q-item>
          <q-item>
            <q-item-section
              ><q-btn
                dense
                label="Add"
                icon="add"
                v-if="!addVisa"
                :style="buttonStyle"
                @click="addVisaMethod"
            /></q-item-section>
            <q-item-section
              ><q-btn
                dense
                label="Submit"
                v-if="addVisa"
                :style="buttonStyle"
                @click="submitVisa"
            /></q-item-section>
            <q-item-section
              ><q-btn
                dense
                label="Cancel"
                v-if="addVisa"
                class="text-secondary"
                outline
                @click="addVisa = false"
            /></q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <modal-description :description.sync="payload.description" />
        <div v-if="warningDescription" class="text-red">
          The description is too short!
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn label="Save" :style="buttonStyle" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapActions, mapState, mapGetters } from "vuex";
import { date, uid, Notify } from "quasar";
import {
  LMap,
  LTileLayer,
  LControl,
  LMarker,
  LIcon,
  LPopup,
  LFeatureGroup,
} from "vue2-leaflet";
import { Geoapify } from "app/firebase-functions/shared/src/geoapify";
import { geoapify } from "../../../boot/config.js";
import { getCountryData } from "app/firebase-functions/shared/src/country-constants.js";
const geofire = require('geofire-common')

export default {
  props: ["refKey", "countryKey"],
  mixins: [mixinGeneral],
  components: {
    LMap,
    LTileLayer,
    LControl,
    LMarker,
    LIcon,
    LPopup,
    LFeatureGroup,
  },
  data() {
    return {
      geocoder: new Geoapify(geoapify.apiKey),
      zoom: 1,
      warningDescription: false,
      addVisa: false,
      getCountryData:getCountryData,
      visas: [],
      payload: {
        visas: [],
        coordinates: { lat: null, lng: null },
        onlineVisa: false,
      },
    };
  },
  computed: {
    mapUpdated() {
      if (
        this.payload.coordinates.lat === this.marker.position.lat &&
        this.payload.coordinates.lng === this.marker.position.lng
      ) {
        return true;
      } else {
        return false;
      }
    },
    currentLocation() {
      console.log("currentLocation 1", this.payload);
      if (this.payload.coordinates.lat) {
        this.geocoder
          .reverseGeocodeToCountryCode(
            this.payload.coordinates.lat,
            this.payload.coordinates.lng
          )
          .then((cc) => {
            this.payload.country = getCountryData(cc).fullName;
          })
          .catch((err) => {
            console.log("currentLocation 3", err);
          });
      }
    },
  },
  methods: {
    clickCoordinates(event) {
      this.payload.coordinates = event.latlng;
    },

    submitVisa() {
      this.payload.visas.push({
        title: this.visas.title,
        leng: this.visas.leng,
        costs: this.visas.costs,
      });
      this.visas.title = "";
      this.visas.leng = "";
      this.visas.costs = "";
      this.addVisa = false;
    },

    submitMarker() {
      if (Object.keys(this.payload.description).length > 50) {
        if (this.countryKey) {
          this.payload.country = this.countryKey;
        } else {
          this.payload.country = this.payload.country;
        }
        if (this.payload.onlineVisa) {
          this.payload.coordinates = this.markerCounts[
            this.getCountryDataByName(this.payload.country).iso2
          ].location;
        }
        let markerId = uid();

        this.updateItemAction({
          path: "Users/" + this.myUserId + "/points/markers_added",
          data: {
            [this.timeStamp]: markerId,
          },
        });
        this.addPoints(10);
        Notify.create("Thanks for your contribution. You`ve earned 10 points!");

        const lat = Number(this.payload.coordinates.lat)
        const lng = Number(this.payload.coordinates.lng)

        this.setItemActionFs({
          collection: "Markers",
          doc: markerId,
          data: {
            itemKey: markerId,
            refKey: this.refKey,
            countryKey: this.payload.country,
            country_located: this.payload.country_located,
            // visas:this.payload.visas,
            refKey: this.refKey,
            description: this.payload.description,
            date_created: this.timeStamp,
            user_created: this.myUserId,
            onlineVisa: this.payload.onlineVisa,
            geohash:geofire.geohashForLocation([lat, lng]),
            coordinates: {
              lat: this.payload.coordinates.lat,
              lng: this.payload.coordinates.lng,
            },
          },
        })
          .then((response) => {
            this.$emit("close");
          })
          .catch((err) => {});
      } else {
        this.warningDescription = true;
      }
    },
    addVisaMethod() {
      this.addVisa = true;
    },
  },
};
</script>
