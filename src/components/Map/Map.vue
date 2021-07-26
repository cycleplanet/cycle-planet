<template>
<div>

  <v-map  :options="mapOptions"  :zoom="3" :min-zoom="mapsettings.minZoom" :center="mapsettings.center" :max-bounds="mapsettings.bounds">
    <v-tilelayer :url="mapsettings.url" :attribution="mapsettings.attribution"></v-tilelayer>
    <v-marker-cluster  @clusterclick="click()" :options="clusterOptions">
      <div  v-for="(marker, markerKey) in landMarkers" :key="markerKey">
        <v-marker :lat-lng="mapMarkersNew==='markers'?marker.coordinates:[0,720]" v-if="markerlist[marker.refKey].active" @click="clickedMarkerMethod(markerKey)">
          <l-icon :icon-url="markerlist[marker.refKey].iconurl" 
          :icon-size="dynamicSize" :icon-anchor="dynamicAnchor"></l-icon>
        </v-marker>
      </div>
        <div v-if="mapMarkersNew==='users'" v-for="(userData, userKey) in usersWithMapLocation" :key="userKey">
            <div v-if="usermarkeroptions.pets.active&&userData.hosting.status!=='Touring'?userData.hosting.pets_allowed:true">
              <v-marker v-if="markerlist[userData.hosting.status].active" :lat-lng="!userData.coordinates_hide&&loggedIn?userData.coordinates:(userData.coordinates_approx?userData.coordinates_approx:[userData.coordinates.lat+randomLat,userData.coordinates.lng+randomLng])" @click="clickusermarker(userKey)">
                <l-icon :icon-url="markerlist[userData.hosting.status].iconurl" :icon-size="dynamicSize" :icon-anchor="dynamicAnchor"  ></l-icon>
                  <v-popup :options="{offset:[0,-40]}"  style="min-width:150px;">
                      <user-popup :data="userData" :image="isload" @viewUserProfile="clickedUserMethod(userKey)"/>
                  </v-popup>
              </v-marker>
            </div>
      </div>
    </v-marker-cluster>

            <div v-for="(countryKey) in countriesFiltered" :key="countryKey">
              <v-marker v-if="countryKey&&markerCounts" :lat-lng="mapMarkersNew==='countries'?markerCounts[countryCodes_rev[countryKey]].location:[markerCounts[countryCodes_rev[countryKey]].location.lat,markerCounts[countryCodes_rev[countryKey]].location.lng+720]">
                <l-icon>
                    <q-chip  style="margin-left:-10px;margin-top:-10px" size="md"  clickable outline class="text-subtitle1 " >
                    <q-avatar rounded style="width:auto;" class="" clickable @click="clickedcountry(countryKey)">

                      <img style="border:1px solid black; margin-left:-1px" :src="flagUrlFor(countryKey)" >
                    </q-avatar>
                    </q-chip>
                </l-icon>
                <v-popup style="min-width:150px">
                  <div class="no-padding" dense :to="'/country/'+countryKey">
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
              </div>

                <marker-filter v-if="mapMarkersNew==='markers'" class="col"/>
                <user-filter v-if="mapMarkersNew==='users'" class="col"/>
                <search-countries v-if="mapMarkersNew==='countries'"/>
              </l-control>

              <l-control position="bottomleft" >
                 <q-banner v-if="mapMarkersNew==='users'&&!loggedIn" class="bg-red-3 text-black">
                  Location of users are not correct. You need to login to see accurate locations
                </q-banner>
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

        <q-dialog :maximized="!isWebApp" class="no-padding" v-model="showAddNewMarker">
          <add-marker-list  @close="showAddNewMarker = false" />
        </q-dialog>

        <q-dialog :maximized="!isWebApp" v-model="itemDialog">
          <item-dialog  v-if="itemDetails"
          :singleItemData="itemDetails"
          @close="itemDialog = false"
          />
        </q-dialog>

        <q-dialog v-model="userdialog" v-if="clickedUserId" >
          <user-page-short :userData="users[clickedUserId]" style="width:100%;max-width:600px"/>
        </q-dialog>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { LMap, LTileLayer, LControl, LMarker, LIcon, LPopup, LCircle } from 'vue2-leaflet'
import Vue2LeafletMarkercluster from 'src/clustermarkers/Vue2LeafletMarkercluster'

export default {
    mixins: [mixinGeneral, ],

    components: {
        'v-map': LMap,
        'v-tilelayer': LTileLayer,
        'v-marker': LMarker,
        'v-popup': LPopup,
        'v-marker-cluster': Vue2LeafletMarkercluster,
        LControl,
        LIcon,
        LCircle,
        
        'search-countries': require('src/components/Shared/Modals/SearchCountries.vue').default,
        'mapmarker-popup': require('components/Shared/MapMarkerPopUp.vue').default,
        'add-marker-list': require('components/Map/Modals/AddMarkerList.vue').default,
        'user-popup': require('components/Map/Modals/Popup/UserPopup.vue').default,
        'marker-filter': require('components/Shared/FilterMarkers.vue').default,
        'user-filter': require('components/Shared/FilterUsers.vue').default,
        'getlocation-button': require('components/Shared/GetLocationButton.vue').default,
        'user-page-short': require('components/Profile/UserPageShort.vue').default,
        'item-dialog': require('components/Marker/ItemDialog.vue').default,
    },

    data() {

        return {
          showAddNewMarker: false,
          clusterOptions: {},
          userdialog: false,
          itemDialog: false,
          clickedUserId: '',
          clickedUserId2: '',
          itemDetails: {},
          isload: false,
          mapMarkersNew: 'countries',
          localcenter: {
            lat:0,
            lng:0
          },
          randomLat:0.05,
          randomLng:0.05,

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

        mapOptions(){
          if(this.screenwidthbig){
            return {scrollWheelZoom:true,preferCanvas: true, zoomSnap:0.25, wheelPxPerZoomLevel: 50}
          } else { return {scrollWheelZoom:false, dragging:false, tap: false,preferCanvas: true}}
        }

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
          this.clickedUserId = userKey
          this.userdialog = true
        },
        clickedMarkerMethod(itemKey) {
            this.itemDialog = true
            this.itemDetails = {}
            this.itemDetails = this.landMarkers[itemKey]
        },
       
       
        clickusermarker(userKey){
          this.clickedUserId2=userKey
        },
        
    },
    mounted() {
      this.$nextTick(() => {
        this.clusterOptions = { disableClusteringAtZoom: 11 }
      })
      this.randomLat=(Math.random()*0.02)-0.01
      this.randomLng=(Math.random()*0.02)-0.01
    }
}
</script>

<style>

</style>
