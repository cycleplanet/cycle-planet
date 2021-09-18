<template>
  <div class="q-ma-sm">
    <div
      v-if="
        Object.keys(countryData).length &&
        countryData.name === countryKey &&
        pageReady &&
        checkCountry &&
        checkMarkersLoaded
      "
    >
      <div v-if="countryData.settings">
        <q-banner
          inline-actions
          class="text-white bg-red"
          v-if="countryData.settings.dangerous"
        >
          <template v-slot:avatar>
            <q-icon name="warning" size="md" />
          </template>
          <div class="text-subtitle1">
            DANGER: Do not travel to {{ countryKey }}. Check out the
            <span
              class="underline cursor-pointer"
              @click="openUrl('https://www.gov.uk/foreign-travel-advice')"
              >U.K. travel advice</span
            >
            for the latest info.
          </div>
        </q-banner>
      </div>
      <q-page v-if="countryData">
        <div v-if="countryData.zoom">
          <div class="row items-center">
            <q-avatar
              rounded
              style="width: auto;"
              :size="isWebApp ? 'lg' : 'md'"
            >
              <img :src="flagUrlFor(getCountryDataByName(countryKey).iso2)" />
            </q-avatar>
            <p class="q-mt-md q-ml-sm" :class="isWebApp ? 'text-h4' : 'cp-h2'">
              {{ countryKey }}
            </p>
            <q-space></q-space>
            <q-btn
              flat
              round
              icon="share"
              size="15px"
              @click.native="shareDialog = true"
            />
            <q-btn
              v-if="loggedIn ? admin : false"
              flat
              round
              icon="settings"
              size="15px"
              @click.native="countrySettingsDialog = true"
            />
          </div>

          <div v-if="countryData && mapsettings">
            <div v-if="countryData.zoom">
              <l-map
                :options="
                  screenwidthbig
                    ? {
                        scrollWheelZoom: true,
                        preferCanvas: true,
                        zoomSnap: 0.25,
                        wheelPxPerZoomLevel: 50,
                      }
                    : !isWebApp
                    ? ''
                    : {
                        scrollWheelZoom: false,
                        dragging: false,
                        tap: false,
                        preferCanvas: true,
                      }
                "
                :style="screenwidthbig ? 'height: 650px' : 'height: 350px'"
                :zoom="screenwidthbig ? zoom + 1 : zoom"
                :center="countryData.location"
              >
                <l-tile-layer
                  :url="mapsettings.url"
                  :attribution="mapsettings.attribution"
                ></l-tile-layer>
                <map-marker :countryKey="countryKey" />

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
          </div>
        </div>
        <div class="flex justify-center q-mt-md">
          <download-gpx
            v-if="markersArray"
            :markersArray="Object.keys(markersArray)"
          />
        </div>

        <div
          v-for="(refData, refKey, index) in refsextra"
          :key="index"
          v-if="countryData"
        >
          <div
            style="min-height: 100px; margin-top: 35px;"
            v-if="!(refKey === 'Embassy' && isSchengenCountry)"
          >
            <div v-if="refData.type === 'single'">
              <single-item
                :refKey="refKey"
                :countryKey="countryKey"
                :data="countryData[refKey]"
              />
            </div>

            <div v-if="refData.type === 'summarylist'">
              <summary-item
                :refKey="refKey"
                :countryKey="countryKey"
                :data="countryData"
              />
            </div>

            <div v-if="refData.type === 'postlist'">
              <post-item :refKey="refKey" :countryKey="countryKey" />
            </div>

            <div v-if="refData.type === 'tilelist'">
              <tile-item :refKey="refKey" :countryKey="countryKey" />
            </div>
          </div>
        </div>

        <q-dialog :maximized="!isWebApp" v-model="countrySettingsDialog">
          <edit-country-settings
            :countryKey="countryKey"
            @close="countrySettingsDialog = false"
          />
        </q-dialog>

        <q-dialog v-model="shareDialog">
          <share-dialog :slug="'country/' + countryKey" :title="countryKey" />
        </q-dialog>
      </q-page>
    </div>
    <div v-else>
      <loading-page />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import meta from "src/utils/meta.js";
import {
  LMap,
  LTileLayer,
  LControl,
  LMarker,
  LIcon,
  LPopup,
  LFeatureGroup,
} from "vue2-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { latLng, Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
export default {
  props: ["countryKey"],
  meta,
  mixins: [mixinGeneral],
  components: {
    LMap,
    LTileLayer,
    LControl,
    LMarker,
    LIcon,
    LPopup,
    "single-item": require("components/Country/SingleItem.vue").default,
    "summary-item": require("components/Country/SummaryItem.vue").default,
    "tile-item": require("components/Country/TileItem.vue").default,
    "post-item": require("components/Country/PostItem.vue").default,
    "map-marker": require("components/Shared/MapMarker.vue").default,
    "edit-country-settings": require("components/Country/Modals/EditCountrySettings.vue")
      .default,
    "share-dialog": require("components/Shared/ShareDialog.vue").default,
    "download-gpx": require("components/Shared/Modals/DownloadGpx.vue").default,
  },

  data() {
    return {
      loading: true,
      pageReady: false,
      zoom: 6,
      shareDialog: false,

      countrySettingsDialog: false,
      title: this.$route.params.countryKey,
      loadedLandmarkers: false,
      // metaTags: {
      // 	// description: this.$route.params.countryKey,
      // 	' | Cycle Planet',
      // 	// url: 'https://cycleplanet.org/country/'+this.$route.params.countryKey,
      // 	// image: 'absolute url to share image'
      // }
    };
  },

  computed: {
    ...mapState("country", ["singleItemData", "countryData"]),
    markersArray() {
      let allMarkerKeys = Object.keys(this.landMarkers);
      let array = {};
      allMarkerKeys.forEach((element) => {
        if (this.landMarkers[element].countryKey === this.countryKey) {
          array[element] = element;
        }
      });
      console.log("markersArray 1", array);
      return array;
    },
    checkMarkersLoaded() {
      if (!this.loadedLandmarkers) {
        this.loadedLandmarkers = false;
        this.refreshData();
        return false;
      } else {
        return true;
      }
    },

    checkCountry() {
      if (this.countryData) {
        if (this.countryKey === this.countryData.name) {
          return true;
        } else {
          this.pageReady = false;
          this.refreshData();
          this.pageReady = true;
          return true;
        }
      }
    },
    isSchengenCountry() {
      if (this.countryData) {
        if (this.countryData.schengen) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },

  methods: {
    ...mapActions("country", ["destroyData", "firebaseGetCountryDataNew"]),
    ...mapActions("markers", ["destroyMapData", "loadPoiWithinCountry"]),

    refreshData() {
      this.destroyMapData().then(() => {});
      this.destroyData().then(() => {
        this.firebaseGetCountryDataNew(this.countryKey);
        this.zoom = this.countryData.zoom;
      });
    },
  },

  mounted() {
    if (this.countryKey) {
      this.refreshData();
      this.pageReady = true;
      this.zoom = this.countryData.zoom;
      this.loadPoiWithinCountry(this.getCountryDataByName(this.countryKey).iso2);
    }
    if (!this.loadedPosts) {
      this.getPosts();
    }
    if (this.countryData) {
      this.zoom = this.countryData.zoom;
    }
  },
  destroyed() {
    //call a method when page is left
    this.pageReady = false;
    this.destroyMapData();
  },
  meta() {
    return {
      // sets document title
      title: this.title,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: (title) => `${title} | Cycle Planet`,
      // meta tags
      meta: {
        description: { name: "description", content: "Page 1" },
        keywords: {
          name: "keywords",
          content: `${this.title}, bicycle, bike, cycle, cycling, touring, visa, border, safe, information`,
        },
        equiv: {
          "http-equiv": "Content-Type",
          content: "text/html; charset=UTF-8",
        },
        // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
        ogTitle: {
          name: "og:title",
          // optional; similar to titleTemplate, but allows templating with other meta properties
          template(ogTitle) {
            return `${ogTitle}`;
          },
        },
      },
      // CSS tags
      link: {
        material: {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
      },
      // JS tags
      script: {
        ldJson: {
          type: "application/ld+json",
          innerHTML: `{ "@context": "http://schema.org" }`,
        },
      },
      // <html> attributes
      htmlAttr: {
        "xmlns:cc": "http://creativecommons.org/ns#", // generates <html xmlns:cc="http://creativecommons.org/ns#">,
        empty: undefined, // generates <html empty>
      },
      // <body> attributes
      bodyAttr: {
        "action-scope": "xyz", // generates <body action-scope="xyz">
        empty: undefined, // generates <body empty>
      },
      // <noscript> tags
      noscript: {
        default: "This is content for browsers with no JS (or disabled JS)",
      },
    };
  },
};
</script>
<style>
.q-card {
  padding: 8px;
  margin-bottom: 16px;
}
img {
  width: 100%;
}
</style>
