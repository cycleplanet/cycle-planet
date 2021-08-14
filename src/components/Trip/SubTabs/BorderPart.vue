<template>
  <div>
    <div v-if="Object.keys(mySelectedCountriesComputed).length === 1">
      You need to select at least 2 countries to display a border crossing.
    </div>
    <div v-if="Object.keys(mySelectedCountriesComputed).length > 1">
      <div v-for="(country, index) in mySelectedCountriesComputed" :key="index">
        <div v-if="index > 0" class="q-my-md spacing">
          <div class="cp-h2 underline">
            {{ mySelectedCountriesComputed[index - 1] }} -
            {{ mySelectedCountriesComputed[index] }}
          </div>
          <div
            v-if="
              allCountryData[mySelectedCountriesComputed[index - 1]].schengen &&
              allCountryData[mySelectedCountriesComputed[index]].schengen
            "
          >
            Both countries are part of the Schengen Area, thus there are open
            borders.
          </div>
          <div
            v-if="
              !allCountryData[mySelectedCountriesComputed[index - 1]]
                .borders_new
                ? true
                : false
            "
          >
            {{ mySelectedCountriesComputed[index - 1] }} doesn't have
            landborders, so you need to enter this country by airplane or boat.
          </div>
          <div v-else-if="!checkBorderData(index)" class="text-italic">
            <div
              v-if="
                allCountryData[mySelectedCountriesComputed[index - 1]]
                  .schengen &&
                allCountryData[mySelectedCountriesComputed[index]].schengen
              "
            ></div>
            <div v-else>
              There is no data for this border crossing yet, we're sorry.
            </div>
          </div>

          <div v-else-if="checkBorderData(index)">
            <div class="">
              <div
                v-for="(borderItem, borderItemKey) in borderData"
                :key="borderItemKey"
              >
                <div
                  class="q-mt-sm border"
                  style="padding: 8px;"
                  clickable
                  v-if="
                    (borderItem.country1.country ===
                      mySelectedCountriesComputed[index - 1] ||
                      borderItem.country1.country ===
                        mySelectedCountriesComputed[index]) &&
                    (borderItem.country2.country ===
                      mySelectedCountriesComputed[index - 1] ||
                      borderItem.country2.country ===
                        mySelectedCountriesComputed[index])
                  "
                >
                  <div class="row">
                    <div class="row">
                      <modal-countrychip4
                        :countryKey="
                          borderItem.country1.country ===
                          mySelectedCountriesComputed[index - 1]
                            ? borderItem.country1.country
                            : borderItem.country2.country
                        "
                        style="width: 25px;"
                      />
                      {{
                        borderItem.country1.country ===
                        mySelectedCountriesComputed[index - 1]
                          ? borderItem.country1.city
                          : borderItem.country2.city
                      }}
                      -
                      <modal-countrychip4
                        :countryKey="
                          borderItem.country1.country ===
                          mySelectedCountriesComputed[index - 1]
                            ? borderItem.country2.country
                            : borderItem.country1.country
                        "
                        style="width: 25px;"
                      />
                      {{
                        borderItem.country1.country ===
                        mySelectedCountriesComputed[index - 1]
                          ? borderItem.country2.city
                          : borderItem.country1.city
                      }}
                    </div>

                    <q-space></q-space>
                    <add-button
                      :refKey="'Border_item'"
                      :itemKey="borderItemKey"
                    />
                  </div>

                  <div><b>Description:</b></div>
                  <div caption lines="4" v-html="borderItem.description"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            For some reason this border has no information yet.
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="itemDialog">
      <item-dialog-border
        v-if="itemDialog"
        :singleItemData="borderData[clickedItemKey]"
        @close="itemDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
import mixinTrip from "src/mixins/mixin-trip.js";

export default {
  mixins: [mixinGeneral, mixinTrip],
  // props:['userId','tripId','mySelectedCountriesComputed'],

  data() {
    return {
      itemDialog: false,
      clickedItemKey: "",
      validmarkers: {},
    };
  },
  components: {
    "item-dialog-border": require("components/Country/Modals/ItemDialogBorder.vue")
      .default,
    "add-button": require("components/Trip/Modals/AddtoMap.vue").default,
  },
  computed: {
    ...mapState("markers", ["borderData"]),
  },
  methods: {
    addToMapMethod(borderItemKey) {
      this.setItemAction({
        data: {
          refKey: "Border_item",
          itemKey: borderItemKey,
        },
        path:
          "Users/" +
          this.userId +
          "/trips/" +
          this.tripId +
          "/markers/" +
          borderItemKey,
      });
    },
    deleteFromMapMethod(borderItemKey) {
      this.deleteItemAction({
        path:
          "Users/" +
          this.userId +
          "/trips/" +
          this.tripId +
          "/markers/" +
          borderItemKey,
      });
    },
    clickBorderItem(itemKey) {
      this.clickedItemKey = itemKey;
      this.itemDialog = true;
    },

    checkBorderData(index) {
      let keys = Object.keys(this.borderData);
      let x = 0;
      keys.forEach((element) => {
        if (
          (this.mySelectedCountriesComputed[index] ===
            this.borderData[element].country1.country ||
            this.mySelectedCountriesComputed[index] ===
              this.borderData[element].country2.country) &&
          (this.mySelectedCountriesComputed[index - 1] ===
            this.borderData[element].country1.country ||
            this.mySelectedCountriesComputed[index - 1] ===
              this.borderData[element].country2.country)
        ) {
          x++;
        }
      });
      if (x > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style></style>
