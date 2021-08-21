<template>
  <div>
      <div class="row q-ma-sm">
        <div
          v-for="(trip, tripKey) in tripsData"
          :key="tripKey"
          class="card q-mb-sm col-md-5 col-sm-5 col-xs-12"
          style="height: 300px;"
        >
          <q-card
            class="cursor-pointer cardstyle2"
            :class="tripKey === hoverKey ? 'overlayactive' : 'overlayhidden'"
            @click="clickedTrip(tripKey)"
            :style="
              'background-image:  linear-gradient(to bottom,rgba(0,0,0, 0.4), rgba(0,0,0, 0.80)),url(' +
              trip.image +
              '); height:100%; width: 100%;'
            "
            @mouseover="hoveroverMethod(tripKey)"
            @mouseleave="hoverleaveMethod(tripKey)"
          >
            <div class="text-white q-pa-md bottom-left">
              <div
                class="row q-mb-md"
                :class="tripKey === hoverKey ? 'textactive' : 'texthidden'"
              >
                <div class="text-bold text-body1 q-mb-md">
                  {{ trip.summary }}
                </div>
                <div
                  v-for="(countryKey, index) in trip.countries"
                  :key="index"
                  class="row"
                >
                  <div v-if="index < 10">{{ countryKey }}</div>
                  <div
                    v-if="
                      index < Object.keys(trip.countries).length - 1 &&
                      index < 9
                    "
                    class="q-mx-xs"
                  >
                    -
                  </div>
                </div>
                <div
                  class="q-ml-sm"
                  v-if="Object.keys(trip.countries).length > 9"
                >
                  & {{ Object.keys(trip.countries).length - 10 }} more
                </div>
              </div>
              <div class="text-h4">{{ trip.title }}</div>
            </div>
          </q-card>
        </div>
        <q-btn
          rounded
          label="Or create your own trip"
          class="q-ma-sm"
          :style="buttonStyle"
          @click="loggedIn ? (createTripDialog = true) : showLoginDialog()"
        />

        <q-dialog v-model="createTripDialog">
          <create-trip @close="createTripDialog = false" />
        </q-dialog>
      </div>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
export default {
  mixins: [mixinGeneral],

  data() {
    return {
      hover: false,
      hoverKey: "",
      createTripDialog: false,
      tripsData: {
        "cairo-capetown": {
          countries: [
            "Egypt",
            "Sudan",
            "Ethiopia",
            "Kenya",
            "Uganda",
            "Rwanda",
            "Burundi",
            "Tanzania",
            "Zambia",
            "Botswana",
            "South Africa",
          ],
          image: "images/eastafrica.jpg",
          summary:
            "Cycle East Africa between the wild animals, the savanne landscapes and the ancient cultures.",
          title: "Cairo to Cape Town",
        },
        "alaska-patagonia": {
          countries: [
            "Canada",
            "United States of America",
            "Mexico",
            "Guatemala",
            "Honduras",
            "Nicaragua",
            "Costa Rica",
            "Panama",
            "Colombia",
            "Ecuador",
            "Peru",
            "Bolivia",
            "Chile",
            "Argentina",
          ],
          image: "images/andes.jpg",
          summary:
            "Experience all the different climates in a single trip, and get dissolved in the fabulous nature of the Americas.",
          title: "Alaska to Patagonia",
        },
        "istanbul-singapore": {
          countries: [
            "Turkey",
            "Georgia",
            "Azerbaijan",
            "Iran",
            "Turkmenistan",
            "Uzbekistan",
            "Tajikistan",
            "Kyrgyzstan",
            "China",
            "Laos",
            "Thailand",
            "Malaysia",
            "Singapore",
          ],
          image: "images/registan.jpg",
          summary:
            "Discover forgotten lands on the once so mighty Silk Road, and dive into the mysterious culture of the East.",
          title: "Istanbul to Singapore",
        },
        "tanger-capetown": {
          countries: [
            "Morocco",
            "Mauritania",
            "Senegal",
            "Gambia",
            "Senegal",
            "Guinea-Bissau",
            "Guinea",
            "Sierra Leone",
            "Liberia",
            "Cote d'Ivoire",
            "Ghana",
            "Togo",
            "Benin",
            "Nigeria",
            "Cameroon",
            "Gabon",
            "Congo, Republic",
            "Angola",
            "Namibia",
            "South Africa",
          ],
          image: "images/westafrica.jpg",
          summary:
            "Meet the incredible hospitality that one of the poorest regions in the world has to offer you.",
          title: "Tanger to Cape Town",
        },
      },
    };
  },

  components: {
    "create-trip": require("components/Profile/CreateTrip.vue").default,
  },
  methods: {
    clickedTrip(tripKey) {
      this.$router.push("/trips/" + tripKey);
    },
    hoveroverMethod(tripKey) {
      this.hoverKey = tripKey;
    },
    hoverleaveMethod(tripKey) {
      this.hoverKey = "";
    },
  },
};
</script>

<style>
.cardstyle2 {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.bottomleft {
  position: absolute;
  bottom: 8px;
  left: 16px;
  font-size: 18px;
}
.overlayhidden {
  opacity: 0.9; /* Completely invisible. */
  transition: 1s; /* A 1 second transition. */
}
.overlayactive {
  opacity: 1;
  transition: 1s;
}

.texthidden {
  opacity: 0; /* Completely invisible. */
  transition: 1s; /* A 1 second transition. */
}
.textactive {
  opacity: 1;
  transition: 1s;
}
.card {
  background-color: white;
  border-radius: 5px;
  margin: 0px 6px 8px 0px;
}

.bottom-left {
  position: absolute;
  bottom: 8px;
  left: 16px;
}
</style>
