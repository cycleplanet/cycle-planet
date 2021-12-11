<template>
  <div>
    <q-card
      class="no-padding"
      :class="isWebApp ? 'q-card-list' : ''"
      v-show="!showAddMarker"
    >
      <q-list bordered>
        <modal-header>Add a new marker</modal-header>

        <div v-for="(item, key) in markerlist" :key="key" clickable>
          <q-item
            v-ripple
            v-if="!item.hideInList"
            :class="item.markertint"
            class="q-pa-none cursor-pointer"
            @click.native="addMarker(key)"
          >
            <q-item-section
              class="content-center q-pa-none"
              :class="item.markercolor"
              avatar
            >
              <q-icon class="" :color="item.iconcolor" :name="item.icon" />
            </q-item-section>
            <q-item-section class="q-ml-sm">{{ item.title }}</q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-card>

    <q-dialog :maximized="!isWebApp" v-model="showAddMarker">
      <add-marker @close="showAddMarker = false" :newMarkerCoordinates="newMarkerCoordinates" 
      :newMarkerZoom="newMarkerZoom"
      :refKey="clickedRef" />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="addEmbassyItemDialog">
      <add-marker-embassy
        @close="addEmbassyItemDialog = false"
        :newMarkerCoordinates="newMarkerCoordinates"
        :newMarkerZoom="newMarkerZoom"
        :refKey="clickedRef"
      />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="addBorderItemDialog">
      <add-marker-border
        @close="addBorderItemDialog = false"
        :newMarkerCoordinates="newMarkerCoordinates"
        :newMarkerZoom="newMarkerZoom"
        :refKey="clickedRef"
      />
    </q-dialog>

    <!-- <q-dialog v-model="addSeeDoItemDialog" >

    			<add-marker-seedo

    			@close="addSeeDoItemDialog = false"

    			:refKey="clickedRef"



    			/>

    		</q-dialog> -->
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
// import { mapState, mapActions, mapGetters } from 'vuex'
import { uid } from "quasar";
import Vue from "vue";
import { Geoapify } from "app/firebase-functions/shared/src/geoapify";
import { geoapify } from "../../../boot/config.js";

export default {
  mixins: [mixinGeneral],
  props:["newMarkerCoordinates","newMarkerZoom"],
  components: {
    "add-marker": require("components/Map/Modals/AddMarker.vue").default,
    "add-marker-embassy": require("components/Map/Modals/AddMarkerEmbassy.vue")
      .default,
    "add-marker-border": require("components/Map/Modals/AddMarkerBorder.vue")
      .default,
  },
  data() {
    return {
      showAddLocation: false,
      showAddMarker: false,
      addEmbassyItemDialog: false,
      addBorderItemDialog: false,
      addSeeDoItemDialog: false,
      clickedRef: "",
      description: {},
      step: 1,
    };
  },
  computed: {
    markerOptions() {
      let options = {};
      let markers = Object.keys(this.markerlist);

      markers.forEach((element) => {
        if (
          element === "Touring" ||
          element === "Available for hosting" ||
          element === "Not available for hosting" ||
          element === "Border_item" ||
          element === "Embassy"
        ) {
        } else {
          options[element] = this.markerlist[element].title;
        }
      });
      return options;
    },
  },
  mounted(){
    console.log('mounted addmarkerlist ', this.newMarkerCoordinates)
  },

  methods: {
    formatText() {
      let string1 = this.description;
      let string2 = string1.replaceAll("<div>", "");
      let string3 = string2.replaceAll("</div>", "");
      let string4 = string3.split("#");
      string4.forEach((element) => {
        this.addRowMethod(element);
      });
      this.step = 2;
    },
    addMarker(id) {
      this.clickedRef = id;
      if (id === "Embassy") {
        this.addEmbassyItemDialog = true;
      } else if (id === "Border_item") {
        this.addBorderItemDialog = true;
      }
      // else if(id==='SeeDo'){this.addSeeDoItemDialog=true}
      else {
        this.showAddMarker = true;
      }
    },

    addRowMethod(element) {
      let valuePart = element.split("; ");

      if (Object.keys(valuePart).length === 4) {
        let markerId = uid();

        new Geoapify(geoapify.apiKey)
          .reverseGeocode(valuePart[2], valuePart[3])
          .then((address) => {
            let markerData = {
              refKey: "",
              countryKey: address.country,
              itemKey: markerId,
              coordinates: {
                lat: valuePart[2],
                lng: valuePart[3],
              },
              title: valuePart[0],
              description: valuePart[1],
              country: address.country,
              date_created: this.timeStamp,
              user_created: this.myUserId,
            };
          })
          .catch((err) => {});
      }
    },
  },
};
</script>
<style>
.q-card-list {
  width: 300px;
}
</style>
