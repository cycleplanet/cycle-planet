<template>
  <div>
    <q-card
      class="no-padding"
      :class="isWebApp ? 'q-card-list' : ''"
      v-show="!showAddMarker"
    >
      <q-list bordered>
        <modal-header>Add a new marker</modal-header>
        <!-- <div class="row justify-center q-pa-md bg-amber-2">
    			 <q-btn
                  rounded
                  icon="eva-navigation-2-outline"
                  class="q-ma-xs"
    			  :style="buttonStyle"
                  @click="loggedIn?getLocation():showLoginDialog()"
                  >{{loggedIn?(myUserDetails.coordinates?'update my location':'add my location'):'add my location'}}</q-btn>
    			</div> -->

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
      <div
        v-if="
          isWebApp && (myUserId === 'xKwHkNyps6h5esaIrzUwjsMsXX82' || admin)
        "
        @click="bulkDialogMethod"
        class="cursor-pointer q-pa-md text-blue justify-center flex"
      >
        Add bulk
      </div>
    </q-card>

    <q-dialog v-model="bulkDialog">
      <q-card style="min-width: 90%; max-width: 700px;">
        <modal-header>Add bulk markers</modal-header>
        <div class="q-pa-sm">
          <q-btn label="reset" @click="resetBulk" :style="buttonStyle" />
          <q-stepper v-model="step" ref="stepper" color="secondary" animated>
            <q-step :name="1" title="Import data" :done="step > 1">
              <div class="q-my-md text-bold">How to add bulk markers:</div>
              <div class="">
                - Enter 4 values per row separated with a semi column and space
                (; ) and closed with a hashtag (#) without spaces
              </div>
              <div>
                - You can't add border crossings and embassies with the bulk
                upload
              </div>
              <div>
                - If something goes wrong, please reset the page and try again
              </div>
              <div>
                - This is the very first version of Bulk upload (thanks to
                Pedro!), so things might brake. Contact Bas if something went
                wrong.
              </div>

              <div class="q-my-sm text-h6">Example:</div>
              <div class="text-h6">
                Title; description; latitude; longitude#
              </div>
              <div class="bg-grey-4 q-pa-sm text-h6">
                <div>
                  Taj Mahal; A majestic place in India; 27.17384; 78.04313#
                </div>
                <div>
                  Santiago de Compostella; A majestic place in Spain;
                  42.8804219; -8.5458608#
                </div>
              </div>

              <modal-description
                :description.sync="description"
                class="q-mt-md"
              />

              <div class="row q-my-md">
                <q-space />
                <q-btn
                  label="format"
                  :style="buttonStyle"
                  class="justify-end"
                  @click="formatText()"
                />
              </div>
            </q-step>

            <q-step
              :name="2"
              title="Check data"
              icon="create_new_folder"
              :done="step > 2"
            >
              <q-btn
                v-if="
                  Object.keys(bulkMarkers).length > 0
                    ? bulkMarkers[
                        Object.keys(bulkMarkers)[
                          Object.keys(bulkMarkers).length - 1
                        ]
                      ].refKey
                    : false
                "
                label="submit"
                :style="buttonStyle"
                @click="submitBulkMarkers"
                class="q-my-md"
              />
              <div
                v-if="
                  Object.keys(bulkMarkers).length > 0
                    ? !bulkMarkers[
                        Object.keys(bulkMarkers)[
                          Object.keys(bulkMarkers).length - 1
                        ]
                      ].refKey
                    : false
                "
                class="text-red"
              >
                Please fill in all categories first, then you can submit the
                markers.
              </div>

              <div class="row flex items-start text-bold">
                <div class="col-2">Category</div>
                <div class="col-1">Country</div>
                <div class="col-2">Title</div>
                <div class="col-5">Description</div>
                <div class="col-1">Latitude</div>
                <div class="col-1">Longitude</div>
              </div>

              <div
                class="row flex items-start q-my-md"
                v-for="(markerRow, markerRowId) in bulkMarkers"
                :key="markerRowId"
              >
                <q-select
                  outlined
                  :options="Object.keys(markerOptions)"
                  v-model="markerRow.refKey"
                  class="col-2"
                />
                <div class="col-1">
                  {{ markerRow.countryKey }}
                </div>

                <q-input
                  outlined
                  label="Title"
                  v-model="markerRow.title"
                  class="col-2"
                />
                <q-input
                  outlined
                  label="Description"
                  v-model="markerRow.description"
                  type="textarea"
                  class="col-5"
                />
                <q-input
                  outlined
                  label="Latitude"
                  v-model="markerRow.coordinates.lat"
                  class="col-1"
                />
                <q-input
                  outlined
                  label="Longitude"
                  v-model="markerRow.coordinates.lng"
                  class="col-1"
                />
              </div>
            </q-step>
          </q-stepper>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="showAddMarker">
      <add-marker @close="showAddMarker = false" :refKey="clickedRef" />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="addEmbassyItemDialog">
      <add-marker-embassy
        @close="addEmbassyItemDialog = false"
        :refKey="clickedRef"
      />
    </q-dialog>

    <q-dialog :maximized="!isWebApp" v-model="addBorderItemDialog">
      <add-marker-border
        @close="addBorderItemDialog = false"
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
import { Geoapify } from "app/firebase-functions/shared/src/geoapify";
import { geoapify } from "../../../boot/config.js";

export default {
  mixins: [mixinGeneral],
  components: {
    "add-marker": require("components/Map/Modals/AddMarker.vue").default,
    "add-marker-embassy": require("components/Map/Modals/AddMarkerEmbassy.vue")
      .default,
    "add-marker-border": require("components/Map/Modals/AddMarkerBorder.vue")
      .default,
  },
  data() {
    return {
      bulkDialog: false,
      showAddLocation: false,
      showAddMarker: false,
      addEmbassyItemDialog: false,
      addBorderItemDialog: false,
      addSeeDoItemDialog: false,
      clickedRef: "",
      bulkMarkers: {},
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

    bulkDialogMethod() {
      this.bulkDialog = true;
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
            this.bulkMarkers[markerId] = markerData;
          })
          .catch((err) => {});
      }
    },

    submitBulkMarkers() {
      let markers = Object.keys(this.bulkMarkers);
      markers.forEach((element) => {
        this.setItemActionFs({
          collection: "Markers",
          doc: element,
          data: this.bulkMarkers[element],
        });
      });
      this.bulkMarkers = {};
      this.step = 1;
      this.bulkDialog = false;
    },
    resetBulk() {
      this.bulkMarkers = {};
      this.step = 1;
    },
  },
};
</script>
<style>
.q-card-list {
  width: 300px;
}
</style>
