<template>
    <div>
        <template v-if="landMarkers">
          <v-map :options="screenwidthbig?{scrollWheelZoom:true,preferCanvas: true}:(!isWebApp?'':{scrollWheelZoom:false, dragging:false, tap: false,preferCanvas: true})"  :zoom="zoom " :min-zoom="mapsettings.minZoom" :center="mapsettings.center" :max-bounds="mapsettings.bounds">
            <v-tilelayer :url="mapsettings.url" :attribution="mapsettings.attribution"></v-tilelayer>
            <v-marker-cluster :options="clusterOptions" @clusterclick="click()" @ready="true">
              <div v-for="markerKey in markersArray" :key="markerKey">
                <v-marker :lat-lng="landMarkers[markerKey].coordinates" v-if="markerlist[landMarkers[markerKey].refKey].active">

                  <l-icon :icon-url="markerlist[landMarkers[markerKey].refKey].iconurl" :icon-size="dynamicSize" :icon-anchor="dynamicAnchor"></l-icon>
                    <mapmarker-popup :singleItemData="landMarkers[markerKey]" @markerClick="clickedMarkerMethod(markerKey)"/>
                </v-marker>
              </div>
            </v-marker-cluster>

           <l-control position="topleft"  class="q-ma-md">
                <q-btn icon="add" dense class="row bg-white q-pa-xs" size="sm" @click="zoom++"/>
                <q-btn icon="remove" dense class="row bg-white q-pa-xs q-mt-sm" size="sm" @click="zoom--"/>
              </l-control>

           
          </v-map>
        </template>

    

  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { LMap, LTileLayer, LControl, LMarker, LIcon, LPopup } from 'vue2-leaflet'
import Vue2LeafletMarkercluster from 'src/clustermarkers/Vue2LeafletMarkercluster'

export default {
    mixins: [mixinGeneral, ],
    props:['markersArray'],

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
            zoom: 2,
            mapMarkersNew: '',
            loadingMarkers: true,
            showAddNewMarker: false,
            clusterOptions: {},
            userdialog: false,
            itemDialog: false,
            clickedUserId: '',
            itemDetails: {},
            isload: false,
        }
    },
    computed: {
        ...mapState('auth', ['usersWithMapLocation']),
		    ...mapGetters('countries', ['countriesAll']),
        showmarkerType() {
            if (this.loggedIn) {
                this.mapMarkersNew = 'users'
            } else {
                this.mapMarkersNew = 'users'
            }
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
        }

    },
    mounted() {
        this.showmarkerType
        this.$nextTick(() => {
            this.clusterOptions = { disableClusteringAtZoom: 11 }
        });
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
