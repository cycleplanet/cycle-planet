<template>
  <div>
    <q-card style="height: 100%;" class="no-padding">
      <modal-header>{{ title }}</modal-header>
      <map-marker2 :markersArray="markersArray" style="height: 500px;" />
      <div class="flex justify-center q-my-md">
        <download-gpx v-if="markersArray" :markersArray="markersArray" />
      </div>
      <q-list
        bordered
        class="rounded-borders"
        v-if="Object.keys(landMarkers).length && markersArray"
      >
        <div v-for="itemKey in markersArray" :key="itemKey">
          <q-expansion-item
            v-if="landMarkers[itemKey]"
            expand-separator
            :class="markerlist[landMarkers[itemKey].refKey].markertint"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="markerlist[landMarkers[itemKey].refKey].iconurl" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <marker-title
                  class="text-bold"
                  :singleItemData="landMarkers[itemKey]"
                />
                <div class="row items-center">
                  <div>{{ markerlist[landMarkers[itemKey].refKey].title }}</div>
                  <div
                    class="q-mx-sm"
                    v-if="landMarkers[itemKey].refKey !== 'Border_item'"
                  >
                    •
                  </div>
                  <countrychip-small
                    v-if="landMarkers[itemKey].refKey !== 'Border_item'"
                    :countryKey="landMarkers[itemKey].countryKey"
                  />
                </div>
              </q-item-section>
              <q-item-section
                avatar
                v-if="landMarkers[itemKey].user_created === myUserId"
              >
                <q-avatar
                  :icon="
                    landMarkers[itemKey].status === 'approved'
                      ? 'check_circle'
                      : landMarkers[itemKey].status === 'disapproved'
                      ? 'remove_circle_outline'
                      : 'pending'
                  "
                  :class="
                    landMarkers[itemKey].status === 'approved'
                      ? 'text-green-10'
                      : landMarkers[itemKey].status === 'disapproved'
                      ? 'text-red-10'
                      : 'text-orange-10'
                  "
                >
                  <q-tooltip class="bg-primary">
                    <div>
                      {{
                        "Checked " +
                        (landMarkers[itemKey].checked_by
                          ? Object.keys(landMarkers[itemKey].checked_by).length
                          : 0) +
                        " times out of 3"
                      }}
                    </div>
                    <div>
                      <div class="text-h6 q-mb-sm">Logbook</div>
                      <div class="q-my-md">
                        <date-created
                          class="text-bold"
                          :dateprop="landMarkers[itemKey].date_created"
                        />
                        <div class="row">
                          <modal-username
                            class="q-mr-sm"
                            :userId="landMarkers[itemKey].user_created"
                          />
                          created this item
                        </div>
                      </div>
                      <div
                        v-if="landMarkers[itemKey].date_edited"
                        class="q-my-md"
                      >
                        <date-created
                          class="text-bold"
                          :dateprop="landMarkers[itemKey].date_edited"
                        />
                        <div class="row">
                          <modal-username
                            class="q-mr-sm"
                            :userId="landMarkers[itemKey].user_edited"
                          />
                          edited this item
                        </div>
                      </div>
                      <div v-if="landMarkers[itemKey].logbook">
                        <div
                          v-for="(log, logKey) in landMarkers[itemKey].logbook"
                          :key="logKey"
                          class="q-my-md"
                        >
                          <date-created class="text-bold" :dateprop="logKey" />
                          <div class="row">
                            <modal-username
                              class="q-mr-sm"
                              :userId="log.user"
                            />{{ log.description }}
                          </div>
                          <div v-if="log.checks" class="row flex items-center">
                            <b>⤷ Reason:</b>
                            <div
                              v-for="(chip, chipKey) in log.checks"
                              :key="chipKey"
                            >
                              <q-chip :label="chip" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-tooltip>
                </q-avatar>
              </q-item-section>
              <q-item-section side>
                <like-item
                  class="text-black"
                  :singleItemData="landMarkers[itemKey]"
                />
              </q-item-section>
            </template>
            <div class="bg-white text-black q-pa-sm">
              <div>
                <b>Status: </b
                >{{
                  landMarkers[itemKey].status
                    ? landMarkers[itemKey].status
                    : "Pending (but visible)"
                }}
              </div>

              <div
                v-if="landMarkers[itemKey].countryKey"
                class="row items-center"
              >
                <b>Country:</b>
                <countrychip-small
                  :countryKey="landMarkers[itemKey].countryKey"
                  class="q-ml-sm"
                />
              </div>
              <div>
                <b>Description:</b>
                <div v-html-safe="landMarkers[itemKey].description"></div>
              </div>
              <q-btn
                :style="buttonStyle"
                @click="openItem(landMarkers[itemKey])"
                >See more</q-btn
              >
            </div>
          </q-expansion-item>
        </div>
      </q-list>
      <div
        v-if="!markersArray"
        class="items-center justify-center flex q-mt-lg"
      >
        There are no markers to display
      </div>
    </q-card>

    <q-dialog :maximized="!isWebApp" v-model="itemDialog">
      <item-dialog
        v-if="itemDetails"
        :singleItemData="itemDetails"
        @close="itemDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapActions } from 'vuex';
import Vue from 'vue';
import VueSecureHTML from 'vue-html-secure';

Vue.use(VueSecureHTML);

export default {
  mixins: [mixinGeneral],
  props: ["markersArray", "title"],

  data() {
    return {
      itemDialog: false,
      itemDetails: {},
    };
  },

  components: {
    "item-dialog": require("components/Marker/ItemDialog.vue").default,
    "like-item": require("components/Shared/Modals/LikeMarker.vue").default,
    "map-marker2": require("src/components/Shared/POIList.vue").default,
    "download-gpx": require("components/Shared/Modals/DownloadGpx.vue").default,
  },

  methods: {
    openItem(listItem) {
      this.itemDetails = listItem;
      this.itemDialog = true;
    },
    ...mapActions("markers", ["loadPoiByIds"])
  },

  async created() {
    await this.loadPoiByIds(this.markersArray)
  }
};
</script>

<style></style>
