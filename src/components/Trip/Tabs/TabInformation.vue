<template>
  <div>
    <div v-if="!tripDetails.countries">
      <div v-if="myProfile">
        <q-select
          outlined
          filled
          v-model="newTrip.countries"
          :options="countryKeys"
          label="Select your start country"
          class="q-mb-md bg-white"
        />
        <q-btn
          v-if="newTrip.countries"
          :style="buttonStyle"
          label="add"
          @click="clickedcountryMethod(newTrip.countries)"
        />
      </div>
      <div v-if="!myProfile">
        The user has no countries selected yet
      </div>
    </div>

    <div v-if="tripDetails.countries">
      <div>
        <div class="cp-h2 q-my-sm" v-if="!tripFuture">Passed countries</div>
        <div v-if="!getStoryCountryKeys">
          <div v-if="myProfile">
            Only the countries in which you created a Story will be shown here.
          </div>
          <div v-else>
            {{ users[userId].fullname }} has not passed any country yet.
          </div>
        </div>
        <div v-else>
          <div
            v-for="(boolean, countryKey) in getStoryCountryKeys"
            :key="countryKey"
          >
            <modal-countrychip :countryKey="countryKey" />
          </div>
        </div>
      </div>

      <q-separator v-if="!tripFuture && !tripFinished" class="q-my-md" />

      <div v-if="tripDetails.countries && !tripFinished">
        <div class="cp-h2 q-my-sm">
          {{ myProfile ? "Your" : users[userId].fullname + "`s" }} current route
        </div>
        <div class="row">
          <div
            v-for="(country, countryKey) in mySelectedCountriesComputed"
            :key="countryKey"
          >
            <modal-countrychip3
              :countryKey="country"
              :index="countryKey"
              @delete="deletecountry(countryKey)"
              :last="
                Object.keys(mySelectedCountriesComputed).length ===
                countryKey + 1
                  ? true
                  : false
              "
              :myProfile="myProfile"
            />
          </div>
        </div>
      </div>

      <div v-if="myProfile && tripDetails.countries && !tripFinished">
        <q-separator class="q-my-md" />
        <div class="cp-h2 q-my-sm">
          Where do you wanna go after
          {{
            tripDetails.countries[
              Object.keys(tripDetails.countries).length - 1
            ]
          }}?
        </div>
        <div>
          <div
            class="row"
            v-if="
              allCountryData[
                tripDetails.countries[
                  Object.keys(tripDetails.countries).length - 1
                ]
              ].borders_new
            "
          >
            <div
              v-for="(countryBorder, indexBorder) in allCountryData[
                tripDetails.countries[
                  Object.keys(tripDetails.countries).length - 1
                ]
              ].borders_new"
              :key="indexBorder"
            >
              <div :style="screenwidthbig ? 'padding:2px' : 'padding:1px'">
                <q-chip
                  :size="screenwidthbig ? '15px' : '12px'"
                  clickable
                  outline
                  class="text-subtitle1"
                >
                  <q-avatar
                    rounded
                    style="width: auto;"
                    class=""
                    clickable
                    @click="clickedcountryMethod(indexBorder)"
                  >
                    <img
                      style="border: 1px solid black; margin-left: -1px;"
                      :src="flagUrlFor(indexBorder)"
                    />
                  </q-avatar>
                  <div clickable @click="clickedcountryMethod(indexBorder)">
                    {{ indexBorder }}
                  </div>
                </q-chip>
              </div>
            </div>
          </div>
          <div v-else>
            It seems
            {{
              tripDetails.countries[
                Object.keys(tripDetails.countries).length - 1
              ]
            }}
            has no land borders.
          </div>
        </div>
        <div
          class="text-blue-10 underline q-py-sm cursor-pointer"
          @click="selectCountryDialog = true"
        >
          Select another country
        </div>
      </div>
    </div>

    <q-dialog v-model="selectCountryDialog">
      <q-card class="no-padding" style="width: 40%; max-width: 400px;">
        <modal-header>Select country</modal-header>
        <div class="q-pa-md">
          <q-select
            outlined
            v-model="countrySelected"
            :options="countryKeys"
            label="Select country"
            class="q-mb-md bg-white"
          />
          <q-btn
            label="select"
            :style="buttonStyle"
            v-if="countrySelected"
            @click="selectCountry"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import mixinTrip from "src/mixins/mixin-trip.js";

export default {
  mixins: [mixinGeneral, mixinTrip],

  data() {
    return {
      newTrip: {},
      selectCountryDialog: false,
      countrySelected: "",
    };
  },

  methods: {
    selectCountry() {
      this.clickedcountryMethod(this.countrySelected);
      this.countrySelected = "";
      this.selectCountryDialog = false;
    },
  },
};
</script>

<style></style>
