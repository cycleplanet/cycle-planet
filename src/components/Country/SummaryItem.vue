<template>
  <div v-if="countryKey && data && refKey">
    <div class="q-mb-md">
      <q-item class="no-padding">
        <q-item-section class="cp-h2">{{
          refsextra[refKey].title
        }}</q-item-section>
        <q-item-section side top>
          <div>
            <q-btn
              :style="buttonStyle"
              round
              icon="edit"
              size="sm"
              @click.native="loggedIn ? editItemMethod() : showLoginDialog()"
            />
            <q-btn
              flat
              @click.native="loggedIn ? editItemMethod() : showLoginDialog()"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>

      <div v-if="data">
        <div class="text-caption text-grey row">
          Last edited by
          <username-no-avatar
            clickable
            class="q-mx-xs"
            :userId="data.user_edited"
          />
          on <date-created class="q-ml-xs" :dateprop="data.date_edited" />
        </div>
      </div>
      <q-separator />
    </div>

    <div class="row">
      <q-list v-if="refKey === 'QuickFacts'" class="q-gutter-y-sm cp-p">
        <div>
          <div class="text-bold">Region</div>
          <div>{{ data.quickFacts.region }}</div>
        </div>

        <div>
          <div class="text-bold">Subregion</div>
          <div>{{ data.quickFacts.subregion }}</div>
        </div>

        <div>
          <div class="text-bold">Neighbour countries</div>
          <div class="row">
            <div v-for="(country, index) in data.borders_new" :key="index">
              <countrychip-large :countryKey="index" />
            </div>
          </div>
        </div>

        <div>
          <div class="text-bold">Capital</div>
          <div>{{ data.quickFacts.capital }}</div>
        </div>

        <div>
          <div class="text-bold">Currency</div>
          <div>
            {{ data.quickFacts.currencies.name }} ({{
              data.quickFacts.currencies.code
            }}
            {{ data.quickFacts.currencies.symbol }})
          </div>
        </div>
        <div>
          <div class="text-bold">WhatsApp groups</div>
          <div class="row">
            <div
              v-for="WAgroup in continentAdapter[data.quickFacts.subregion]
                .whatsappgroups"
              :key="WAgroup"
            >
              <whatsapp-button :WAgroup="whatsappgroups[WAgroup]" />
            </div>
          </div>
        </div>

        <div
          dense
          v-for="(listitem, key) in refsextra[refKey].items"
          :key="key"
          class="no-padding"
        >
          <div
            class="text-bold cp-p"
            :class="
              data[refKey]
                ? data[refKey][key]
                  ? ''
                  : 'text-grey'
                : 'text-grey'
            "
          >
            {{ listitem.title }}
          </div>
          <div class="cp-p" v-if="data" v-html-safe="data[refKey][key]"></div>
        </div>
      </q-list>
      <q-list v-else class="full-width">
        <q-item
          dense
          v-for="(listitem, key) in refsextra[refKey].items"
          :key="key"
          class="no-padding"
        >
          <q-item-section>
            <p
              class="text-bold cp-p"
              :class="
                data[refKey]
                  ? data[refKey][key]
                    ? ''
                    : 'text-grey'
                  : 'text-grey'
              "
            >
              {{ listitem.title }}
            </p>
            <p v-if="data[refKey]" class="cp-p" v-html-safe="data[refKey][key]"></p>
          </q-item-section>
        </q-item>
      </q-list>
      <p v-if="refKey === 'Sleeping'" class="text-bold cp-p q-mt-sm">
        Cycle Planet hosts
      </p>
      <div
        style="height: 350px; width: 100%;"
        v-if="refKey === 'Sleeping' && countryData"
      >
        <l-map
          :options="
            screenwidthbig
              ? { scrollWheelZoom: false }
              : { scrollWheelZoom: false, dragging: false, tap: false }
          "
          v-if="refKey === 'Sleeping'"
          style="height: 350px;"
          :zoom="zoom"
          :center="countryData.location"
        >
          <l-tile-layer
            :url="mapsettings.url"
            :attribution="mapsettings.attribution"
          ></l-tile-layer>

          <div
            v-for="(userData, userKey) in usersWithMapLocation"
            :key="userKey"
            class="q-mt-md"
          >
            <l-marker
              v-if="userData.hosting.status === 'Available for hosting'"
              :lat-lng="userData.coordinates"
            >
              <l-icon
                :icon-url="markerlist['Available for hosting'].iconurl"
                :icon-size="dynamicSize"
                :icon-anchor="dynamicAnchor"
              ></l-icon>
              <l-popup
                :options="{ offset: [0, -40] }"
                style="min-width: 150px;"
              >
                <user-popup :data="userData" />
              </l-popup>
            </l-marker>
          </div>
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

    <q-dialog :maximized="!isWebApp" v-model="editItem">
      <edit-list-item
        :countryKey="countryKey"
        :refKey="refKey"
        :data="data[refKey]"
        @close="editItem = false"
      />
    </q-dialog>
  </div>
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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { latLng, Icon } from "leaflet";
import Vue from 'vue';
import VueSecureHTML from 'vue-html-secure';

Vue.use(VueSecureHTML);

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  mixins: [mixinGeneral],

  props: ["countryKey", "refKey", "data"],

  components: {
    LMap,
    LTileLayer,
    LControl,
    LMarker,
    LIcon,
    LPopup,
    "edit-list-item": require("components/Country/Modals/EditListItem.vue")
      .default,
    "user-popup": require("components/Map/Modals/Popup/UserPopup.vue").default,
    "whatsapp-button": require("components/Shared/Modals/WhatsAppButton.vue")
      .default,
  },

  data() {
    return {
      editItem: false,
      zoom: 3,
    };
  },

  computed: {
    ...mapState("country", ["countryData"]),
    ...mapState("auth", ["usersWithMapLocation"]),
    ...mapState("countries", ["continentAdapter", "whatsappgroups"]),

    quickFacts() {
      return this.data.quickFacts;
    },
  },

  methods: {
    editItemMethod() {
      this.editItem = true;
    },
  },
  mounted() {
    this.zoom = this.countryData.zoom;
  },
};
</script>

<style></style>
