<template>
  <div>
    <template>
      <v-map
        ref="mymap"
        @ready="setMapOnReady()"
        @update:zoom="zoomLevelChanged()"
        :options="mapOptions"
        :zoom="zoomLevel"
        :min-zoom="mapsettings.minZoom"
        :center="mapsettings.center"
        :max-bounds="mapsettings.bounds"
        style="height: 100vh;"
      >
        <v-tilelayer
          :url="mapsettings.url"
          :attribution="mapsettings.attribution"
        ></v-tilelayer>

        <div
          v-for="(marker, markerKey) in markerCounts"
          :key="markerKey"
          v-if="zoomLevel < clusterBreak"
        >
          <div v-if="showMarkersFor === 'poi'">
            <v-marker
              v-if="marker.location && marker.poi"
              :lat-lng="[marker.location.lat, marker.location.lng]"
              @click="clickCountryMarkerCount(markerKey)"
            >
              <l-icon v-if="marker.poi" style="margin: 1px;">
                <q-btn
                  size="sm"
                  rounded
                  transparent
                  outline
                  style="font-size: 15px;"
                  color="black"
                  class="bg-amber"
                  :label="marker.poi + ' '"
                />
              </l-icon>
            </v-marker>
          </div>
          <div v-if="showMarkersFor === 'hosts'">
            <v-marker
              v-if="marker.location && marker.hosts"
              :lat-lng="[marker.location.lat, marker.location.lng]"
              @click="clickCountryMarkerCount(markerKey)"
            >
              <l-icon v-if="marker.hosts" style="margin: 1px;">
                <q-btn
                  size="sm"
                  rounded
                  transparent
                  outline
                  style="font-size: 15px;"
                  color="white"
                  class="bg-teal"
                  :label="marker.hosts + ' '"
                />
              </l-icon>
            </v-marker>
          </div>
        </div>
        <div
          v-if="
            loggedIn &&
            zoomLevel >= clusterBreak &&
            showMarkersFor === 'hosts' &&
            clickedUserId2
          "
        >
          <l-circle
            v-if="users[clickedUserId2].coordinates_hide"
            :lat-lng="
              users[clickedUserId2].coordinates_approx
                ? users[clickedUserId2].coordinates_approx
                : [
                    users[clickedUserId2].coordinates.lat +
                      Math.random() * 0.01,
                    users[clickedUserId2].coordinates.lng +
                      Math.random() * 0.01,
                  ]
            "
            :radius="1100"
          />
        </div>
        <v-marker-cluster
          v-if="zoomLevel >= clusterBreak"
          :options="clusterOptions"
          @clusterclick="click()"
          @ready="true"
        >
          <div v-for="(marker, markerKey) in landMarkers" :key="markerKey">
            <v-marker
              :lat-lng="
                showMarkersFor === 'poi'
                  ? [marker.coordinates.lat, marker.coordinates.lng]
                  : [0, 720]
              "
              v-if="markerlist[marker.refKey].active"
            >
              <l-icon
                :icon-url="markerlist[marker.refKey].iconurl"
                :icon-size="dynamicSize"
                :icon-anchor="dynamicAnchor"
              ></l-icon>
              <mapmarker-popup
                :singleItemData="marker"
                @markerClick="clickedMarkerMethod(markerKey)"
              />
            </v-marker>
          </div>
          <div
            v-if="showMarkersFor === 'hosts'"
            v-for="(userData, userKey) in usersWithMapLocation"
            :key="userKey"
          >
            <div
              v-if="
                usermarkeroptions.pets.active &&
                userData.hosting.status !== 'Touring'
                  ? userData.hosting.pets_allowed
                  : true
              "
            >
              <v-marker
                v-if="markerlist[userData.hosting.status].active"
                :lat-lng="
                  !userData.coordinates_hide && loggedIn
                    ? [userData.coordinates.lat, userData.coordinates.lng]
                    : userData.coordinates_approx
                    ? userData.coordinates_approx
                    : [
                        userData.coordinates.lat + randomLat,
                        userData.coordinates.lng + randomLng,
                      ]
                "
                @click="clickusermarker(userKey)"
              >
                <l-icon
                  :icon-url="markerlist[userData.hosting.status].iconurl"
                  :icon-size="dynamicSize"
                  :icon-anchor="dynamicAnchor"
                ></l-icon>
                <v-popup
                  :options="{ offset: [0, -40] }"
                  style="min-width: 150px;"
                >
                  <user-popup
                    :data="userData"
                    :image="isload"
                    @viewUserProfile="clickedUserMethod(userKey)"
                  />
                </v-popup>
              </v-marker>
            </div>
          </div>
        </v-marker-cluster>

        <div v-for="(country, cc, index) in countriesFiltered" :key="index">
          <v-marker
            v-if="country && markerCounts[cc]"
            :lat-lng="
              showMarkersFor === 'countries'
                ? [markerCounts[cc].location.lat, markerCounts[cc].location.lng]
                : [
                    markerCounts[cc].location.lat,
                    markerCounts[cc].location.lng + 720,
                  ]
            "
          >
            <l-icon>
              <q-chip
                style="margin-left: -10px; margin-top: -10px;"
                size="md"
                clickable
                outline
                class="text-subtitle1"
              >
                <q-avatar
                  rounded
                  style="width: auto;"
                  class=""
                  clickable
                  @click="clickedcountry(country.fullName)"
                >
                  <img
                    style="border: 1px solid black; margin-left: -1px;"
                    :src="flagUrlFor(cc)"
                  />
                </q-avatar>
              </q-chip>
            </l-icon>
            <v-popup style="min-width: 150px;">
              <div
                class="no-padding"
                dense
                :to="'/country/' + country.fullName"
              >
                <div class="text-bold">
                  <div class="text-h6">{{ country.fullName }}</div>
                  <div
                    class="underline-hover cursor-pointer"
                    @click="$router.push('/country/' + country.fullName)"
                  >
                    View more
                  </div>
                </div>
              </div>
            </v-popup>
          </v-marker>
        </div>

        <div>
          <l-control position="topleft" class="q-ma-md">
            <q-btn
              icon="add"
              dense
              class="row bg-white q-pa-xs"
              size="sm"
              @click="map.zoomIn()"
            />
            <q-btn
              icon="remove"
              dense
              class="row bg-white q-pa-xs q-mt-sm"
              size="sm"
              @click="map.zoomOut()"
            />
          </l-control>

          <l-control position="topright" class="column items-end">
            <div
              class="q-pa-md"
              style="
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
              "
            >
              <q-option-group
                :options="radio_options"
                type="radio"
                v-model="showMarkersFor"
              />
              <!-- <div>Zoom: {{zoom}}</div> -->
              <!-- <div>Lat: {{localcenter.lat}}</div> -->
            </div>

            <marker-filter v-if="showMarkersFor === 'poi'" class="col" />
            <user-filter v-if="showMarkersFor === 'hosts'" class="col" />
            <search-countries v-if="showMarkersFor === 'countries'" />
          </l-control>

          <l-control position="bottomleft">
            <q-banner
              v-if="showMarkersFor === 'hosts' && !loggedIn"
              class="bg-red-3 text-black"
            >
              Locations of users are not precise. You need to login to see
              accurate locations
            </q-banner>
            <q-btn
              rounded
              class="q-my-sm row"
              :size="isWebApp ? 'md' : 'sm'"
              icon="add"
              :style="buttonStyle"
              @click="loggedIn ? (showAddNewMarker = true) : showLoginDialog()"
              >add marker</q-btn
            >

            <getlocation-button />
          </l-control>
        </div>
        -->
      </v-map>
    </template>

    <q-dialog
      :maximized="!isWebApp"
      class="no-padding"
      v-model="showAddNewMarker"
    >
      <add-marker-list @close="showAddNewMarker = false" />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="itemDialog">
      <item-dialog
        v-if="itemDetails"
        :singleItemData="itemDetails"
        @close="itemDialog = false"
      />
    </q-dialog>

    <q-dialog v-model="userdialog" v-if="clickedUserId">
      <user-page-short
        :userData="users[clickedUserId]"
        style="width: 100%; max-width: 600px;"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import {
  LMap,
  LTileLayer,
  LControl,
  LMarker,
  LIcon,
  LPopup,
  LCircle,
} from "vue2-leaflet";
import Vue2LeafletMarkercluster from "src/clustermarkers/Vue2LeafletMarkercluster";
import { getCountryData } from "app/firebase-functions/shared/src/country-constants.js";

const DEFAULT_ZOOM_LEVEL = 3;
const DEFAULT_CLUSTER_BREAK = 6.5;

export default {
  mixins: [mixinGeneral],

  components: {
    "v-map": LMap,
    "v-tilelayer": LTileLayer,
    "v-marker": LMarker,
    "v-popup": LPopup,
    "v-marker-cluster": Vue2LeafletMarkercluster,
    LControl,
    LIcon,
    LCircle,

    "search-countries": require("src/components/Shared/Modals/SearchCountries.vue")
      .default,
    "mapmarker-popup": require("components/Shared/MapMarkerPopUp.vue").default,
    "add-marker-list": require("components/Map/Modals/AddMarkerList.vue")
      .default,
    "user-popup": require("components/Map/Modals/Popup/UserPopup.vue").default,
    "marker-filter": require("components/Shared/FilterMarkers.vue").default,
    "user-filter": require("components/Shared/FilterUsers.vue").default,
    "getlocation-button": require("components/Shared/GetLocationButton.vue")
      .default,
    "user-page-short": require("components/Profile/UserPageShort.vue").default,
    "item-dialog": require("components/Marker/ItemDialog.vue").default,
  },

  data() {
    return {
      map: null,
      clusterBreak: 6.5,
      showAddNewMarker: false,
      clusterOptions: {},
      userdialog: false,
      itemDialog: false,
      clickedUserId: "",
      clickedUserId2: "",
      itemDetails: {},
      isload: false,
      showMarkersFor: "hosts",
      localcenter: {
        lat: 0,
        lng: 0,
      },
      randomLat: 0.05,
      randomLng: 0.05,

      radio_options: [
        { label: "Points of Interest", value: "poi", color: "red" },
        { label: "Hosts", value: "hosts", color: "red" },
        { label: "Country Wiki", value: "countries", color: "red" },
      ],
    };
  },
  computed: {
    ...mapState("auth", ["usersWithMapLocation"]),
    ...mapGetters("countries", ["countriesAll"]),

    mapOptions() {
      if (this.screenwidthbig) {
        return {
          scrollWheelZoom: true,
          preferCanvas: true,
          zoomSnap: 0.25,
          wheelPxPerZoomLevel: 50,
        };
      } else {
        return {
          scrollWheelZoom: false,
          dragging: false,
          tap: false,
          preferCanvas: true,
        };
      }
    },

    zoomLevel() {
      if (this.map) {
        return this.map.getZoom();
      } else return DEFAULT_ZOOM_LEVEL;
    },
  },

  methods: {
    click: (e) => console.log("clusterclick", e),
    ready: (e) => console.log("ready", e),

    modalShown() {
      setTimeout(() => {
        this.$refs.mymap.mapObject.invalidateSize();
      }, 100);
    },

    clickedUserMethod(userKey) {
      if (this.isWebApp) {
        let routeData = this.$router.resolve("/user/" + userKey);
        window.open(routeData.href, "_blank");
      } else {
        this.clickedUserId = userKey;
        this.userdialog = true;
      }
    },

    clickedMarkerMethod(itemKey) {
      this.itemDialog = true;
      this.itemDetails = {};
      this.itemDetails = this.landMarkers[itemKey];
    },

    clickusermarker(userKey) {
      this.clickedUserId2 = userKey;
    },

    setMapOnReady() {
      this.map = this.$refs.mymap.mapObject;
    },

    // when a user zooms out beyond clusterBreak, let's reset clusterBreak to
    // default so zooming in won't start a slow load of all markers until the
    // default cluster break is hit.
    // Otherwise, clicking the marker count of a large country like Russia or
    // Canada would render the whole clusterBreak mechanism useless until a full
    // page reload
    zoomLevelChanged() {
      const newZoomLevel = this.map.getZoom();
      if (
        newZoomLevel < this.clusterBreak ||
        newZoomLevel === this.mapsettings.minZoom
      )
        this.clusterBreak = DEFAULT_CLUSTER_BREAK;
    },

    async clickCountryMarkerCount(cc) {
      this.map.fitBounds(getCountryData(cc).boundingBox);
      const newZoomLevel = this.map.getZoom();
      this.clusterBreak = Math.min(this.map.getZoom(), this.clusterBreak);
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.clusterOptions = { disableClusteringAtZoom: 11 };
    });
    this.randomLat = Math.random() * 0.02 - 0.01;
    this.randomLng = Math.random() * 0.02 - 0.01;
  },
};
</script>

<style></style>
