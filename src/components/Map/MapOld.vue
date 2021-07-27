<template>
    <div>
        <template  v-if="landMarkers">
          <v-map ref="mymap" :options="screenwidthbig?{scrollWheelZoom:true,preferCanvas: true, zoomSnap:0.25, wheelPxPerZoomLevel: 50}:(!isWebApp?'':{scrollWheelZoom:false, dragging:false, tap: false,preferCanvas: true})"  :zoom="zoom" :min-zoom="mapsettings.minZoom" :center="mapsettings.center" :max-bounds="mapsettings.bounds">
            <v-tilelayer :url="mapsettings.url" :attribution="mapsettings.attribution"></v-tilelayer>
            <div v-for="(marker, markerKey) in markerCounts" :key="markerKey" v-if="zoom<clusterbreak">
              <div v-if="mapMarkersNew==='markers'">
                <v-marker v-if="marker.location&&marker.poi" :lat-lng="[marker.location.lat,marker.location.lng]" @click="clickmarkercounter(markerKey)">
                  <l-icon v-if="marker.poi" style="margin:1px">
                    <q-btn size="sm" rounded transparent outline style="font-size: 15px;" color="black" class="bg-amber" :label="marker.poi+' '"/>
                  </l-icon>
                   
                </v-marker>
              </div>
              <div v-if="mapMarkersNew==='users'">
                <v-marker v-if="marker.location&&marker.users" :lat-lng="[marker.location.lat,marker.location.lng]" >
                  <l-icon v-if="marker.users" style="margin:1px">
                    <q-btn size="sm" rounded transparent outline style="font-size: 15px;" color="white" class="bg-teal " :label="marker.users+' '"/>
                  </l-icon>
                   
                </v-marker>
              </div>
            </div>
            <v-marker-cluster v-if="zoom>=clusterbreak" :options="clusterOptions" @clusterclick="click()" @ready="true">
              <div  v-for="(marker, markerKey) in landMarkers" :key="markerKey">
                <v-marker :lat-lng="mapMarkersNew==='markers'?[marker.coordinates.lat,marker.coordinates.lng]:[0,720]" v-if="markerlist[marker.refKey].active">

                  <l-icon :icon-url="markerlist[marker.refKey].iconurl" :icon-size="dynamicSize" :icon-anchor="dynamicAnchor"></l-icon>
                    <mapmarker-popup :singleItemData="marker" @markerClick="clickedMarkerMethod(markerKey)"/>
                </v-marker>
              </div>
               <div v-for="(userData, userKey) in usersWithMapLocation" :key="userKey">
                    <div v-if="usermarkeroptions.pets.active&&userData.hosting.status!=='Touring'?userData.hosting.pets_allowed:true">
                      <v-marker v-if="markerlist[userData.hosting.status].active" :lat-lng="mapMarkersNew==='users'?[userData.coordinates.lat,userData.coordinates.lng]:[0,720]" >
                        <l-icon :icon-url="markerlist[userData.hosting.status].iconurl" :icon-size="dynamicSize" :icon-anchor="dynamicAnchor" ></l-icon>
                          <v-popup style="min-width:150px">
                              <user-popup :data="userData" :image="isload" @viewUserProfile="clickedUserMethod(userKey)"/>
                          </v-popup>
                      </v-marker>
                    </div>
              </div>
            </v-marker-cluster>

            <div v-for="(country, countryKey) in countryCodes_rev" :key="countryKey">
              <v-marker :lat-lng="mapMarkersNew==='countries'?[markerCounts[country].location.lat,markerCounts[country].location.lng]:[markerCounts[country].location.lat,markerCounts[country].location.lng+720]">
                <l-icon>
                    <q-chip  style="margin-left:-10px;margin-top:-10px" size="md"  clickable outline class="text-subtitle1 " >
                    <q-avatar rounded style="width:auto;" class="" clickable @click="clickedcountry(countryKey)">

                      <img style="border:1px solid black; margin-left:-1px" :src="flagUrlFor(countryKey)" >

                    </q-avatar>
                    </q-chip>
                </l-icon>
                <v-popup style="min-width:150px">
                  <div class="no-padding" dense :to="'/country/'+countryKey.name">
                    <div class="text-bold">
                      <div class="text-h6">{{countryKey}}</div>
                      <div class="underline-hover cursor-pointer" @click="$router.push('/country/'+countryKey)">View more</div>
                    </div>
                  </div>
                </v-popup>
              </v-marker>
            </div>

            <div>
              <l-control position="topleft"  class="q-ma-md">
                <q-btn icon="add" dense class="row bg-white q-pa-xs" size="sm" @click="zoom++"/>
                <q-btn icon="remove" dense class="row bg-white q-pa-xs q-mt-sm" size="sm" @click="zoom--"/>
              </l-control>

              <l-control position="topright" class="column items-end">
                <div class="q-pa-md" style="background-color: rgba(255,255,255, 0.7); border-radius:10px">
                <q-option-group
                  :options="radio_options"
                  type="radio"
                  v-model="mapMarkersNew"
                />
                <!-- <div>Zoom: {{zoom}}</div> -->
                <!-- <div>Lat: {{localcenter.lat}}</div> -->
              </div>

                <marker-filter v-if="mapMarkersNew==='markers'" class="col"/>
                <user-filter v-if="mapMarkersNew==='users'" class="col"/>
                <search-countries v-if="mapMarkersNew==='countries'"/>
              </l-control>

              <l-control position="bottomleft" >
                  <q-btn
                rounded  class="q-my-sm row"
                :size="isWebApp?'md':'sm'"
                icon="add"
                :style="buttonStyle"
                @click="loggedIn?showAddNewMarker=true:showLoginDialog()"
                >add marker</q-btn>

                <getlocation-button/>

              </l-control>
            </div>
          </v-map>
        </template>

        <template v-if="!landMarkers">
          <q-dialog v-model="loadingMarkers">
              <img class="loadinglogo" src="logo/logo.ico" style="width:100px" />
          </q-dialog>
        </template>


        <q-dialog :maximized="!isWebApp" class="no-padding" v-model="showAddNewMarker">
          <add-marker-list  @close="showAddNewMarker = false" />
        </q-dialog>

        <q-dialog :maximized="!isWebApp" v-model="itemDialog">
          <item-dialog  v-if="itemDetails"
          :singleItemData="itemDetails"
          @close="itemDialog = false"
          />
        </q-dialog>

        <q-dialog :maximized="true" v-model="userdialog" v-if="clickedUserId">
          <mobile-header />
          <user-page :userData="users[clickedUserId]"/>
        </q-dialog>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { LMap, LTileLayer, LControl, LMarker, LIcon, LPopup } from 'vue2-leaflet'
import Vue2LeafletMarkercluster from 'src/clustermarkers/Vue2LeafletMarkercluster'
import { Geoapify } from 'app/firebase-functions/shared/src/geoapify'

export default {
    mixins: [mixinGeneral, ],

    components: {
        LMap,
        LControl,
        LIcon,
        LTileLayer,
        LMarker,
        LPopup,
        'mapmarker-popup': require('components/Shared/MapMarkerPopUp.vue').default,
        'add-marker-list': require('components/Map/Modals/AddMarkerList.vue').default,
        'user-popup': require('components/Map/Modals/Popup/UserPopup.vue').default,
        'marker-filter': require('components/Shared/FilterMarkers.vue').default,
        'user-filter': require('components/Shared/FilterUsers.vue').default,
        'getlocation-button': require('components/Shared/GetLocationButton.vue').default,

        'v-map': LMap,
        'v-tilelayer': LTileLayer,
        'v-marker': LMarker,
        'v-popup': LPopup,
        'v-marker-cluster': Vue2LeafletMarkercluster,
        
        'search-countries': require('src/components/Shared/Modals/SearchCountries.vue').default,

        'user-page': require('components/Profile/UserPage.vue').default,
        'item-dialog': require('components/Marker/ItemDialog.vue').default,
    },

    data() {

        return {
          map:null,
          zoom: 3,
          clusterbreak:0.5,
          // mapMarkersNew: '',
          loadingMarkers: true,
          showAddNewMarker: false,
          clusterOptions: {},
          userdialog: false,
          itemDialog: false,
          clickedUserId: '',
          itemDetails: {},
          isload: false,
          mapMarkersNew: 'markers',
          localcenter: {
            lat:0,
            lng:0
          },

          radio_options: [
            { label: 'Land markers', value: 'markers', color:'red' },
            { label: 'Users', value: 'users', color: 'red' },
            { label: 'Country Wiki', value: 'countries', color: 'red' }
          ]
        }
    },
    computed: {
        ...mapState('auth', ['usersWithMapLocation']),
		    ...mapGetters('countries', ['countriesAll']),

    },

    methods: {

        click: (e) => console.log("clusterclick", e),
        ready: (e) => console.log('ready', e),
        modalShown() {
          setTimeout(() => {
            this.$refs.mymap.mapObject.invalidateSize();
          }, 100);
        },
        clickedUserMethod(userKey) {
            if (this.isWebApp) {
                let routeData = this.$router.resolve('/user/' + userKey);
                window.open(routeData.href, '_blank');
            } else {
                this.clickedUserId = userKey
                this.userdialog = true
            }
        },
        clickedMarkerMethod(itemKey) {
            this.itemDialog = true
            this.itemDetails = {}
            this.itemDetails = this.landMarkers[itemKey]
        },
        userpopupmethod(userKey) {
          this.isload = true;
        },
        petstoggleclicked() {
            this.pets = !this.pets
        },

    },
    mounted() {
      this.$nextTick(() => {
        this.clusterOptions = { disableClusteringAtZoom: 11 }
      })
    }
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
html,
body {
    height: 100%;
    margin: 0;
}

.loadinglogo {
    animation: roll 3s infinite;
    opacity: .7;
}

@keyframes roll {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}

.leaflet-control-zoom {
    display: none;
}

.circle {
    background: #e6606b;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: 0px 0px 1px 1px #0000001a;
}

.pulse {
    animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
    0% {
        box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
        box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
    }
}
</style>
