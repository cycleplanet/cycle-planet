<template>
<div>
  {{markersArray}}
  <l-map :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}" style="height: 350px" :zoom="zoom">
				<l-tile-layer :url="mapsettings.url" :attribution="mapsettings.attribution"></l-tile-layer>


        <v-marker-cluster :options="clusterOptions" @clusterclick="click()" @ready="true">
          <div v-for="itemKey in markersArray" :key="itemKey">
              <v-marker :lat-lng="[landMarkers[itemKey].coordinates.lat,landMarkers[itemKey].coordinates.lng]" v-if="markerlist[landMarkers[itemKey].refKey].active">
                <!-- <l-icon :icon-url="markerlist[landMarkers[itemKey].refKey].iconurl" :icon-size="dynamicSize" :icon-anchor="dynamicAnchor"></l-icon> -->
                  <!-- <mapmarker-popup :singleItemData="landMarkers[itemKey]" @markerClick="clickedMarkerMethod(itemKey)"/> -->
              </v-marker>
          </div>
        </v-marker-cluster>

					<l-control position="topleft"  class="q-ma-md">
                            <q-btn icon="add" dense class="row bg-white q-pa-xs" size="sm" @click="zoom++"/>
                            <q-btn icon="remove" dense class="row bg-white q-pa-xs q-mt-sm" size="sm" @click="zoom--"/>
                        </l-control>
				</l-map>

  <q-dialog :maximized="!isWebApp" v-model="itemDialog">
			<item-dialog  v-if="itemDetails"
			:singleItemData="itemDetails"
			@close="itemDialog = false"
			/>
		</q-dialog>
</div>

</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import * as Vue2Leaflet from 'vue2-leaflet'
import { latLng, Icon, icon } from 'leaflet'
import { LMap, LTileLayer, LControl, LMarker,LIcon, LPopup, LFeatureGroup } from 'vue2-leaflet'
import Vue2LeafletMarkercluster from 'src/clustermarkers/Vue2LeafletMarkercluster'

  function rand(n) {
    let max = n + 0.1
    let min = n - 0.1
    return Math.random() * (max - min) + min;
  }

  export default {
  mixins: [mixinGeneral, ],
  props:['markersArray'],

    components: {
      LMap,
      LTileLayer,
      LControl,
      LIcon,
		  'item-dialog': require('components/Marker/ItemDialog.vue').default,
      'mapmarker-popup' : require('components/Shared/MapMarkerPopUp.vue').default,

      'v-map': Vue2Leaflet.LMap,
      'v-tilelayer': Vue2Leaflet.LTileLayer,
      'v-icondefault': Vue2Leaflet.LIconDefault,
      'v-marker': Vue2Leaflet.LMarker,
      'v-popup': Vue2Leaflet.LPopup,
      'v-marker-cluster': Vue2LeafletMarkercluster
    },

    data () {
      let locations = []
      for (let i = 0; i < 100; i++) {
        locations.push({
          id: i,
          latlng: latLng(rand(-34.9205), rand(-57.953646)),
          text: 'Hola ' + i
        })
      }
      return {
        locations,
        clusterOptions: {},
        initialLocation: latLng(-34.9205, -57.953646),
        itemDialog:false,
        itemDetails:{},
        zoom:2
      }
    },
    computed: {
		...mapState('markers', ['landMarkersNewState']),

  },

methods:{

    click: (e) => console.log("clusterclick", e),
    ready: (e) => console.log('ready', e),
    modalShown() {
      setTimeout(() => {
        this.$refs.mymap.mapObject.invalidateSize();
      }, 100);
    },
    clickedMarkerMethod(itemKey){
        this.itemDialog=true
        this.itemDetails={}
        this.itemDetails=this.landMarkers[itemKey]
    },
},

    mounted() {
      setTimeout(() => {
        this.$nextTick(() =>{
          this.clusterOptions = { disableClusteringAtZoom: 11 }
        });
      }, 1000);

    }
  }
</script>

<style>
  /* @import "~leaflet/dist/leaflet.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css"; */
  html, body {
    height: 100%;
    margin: 0;
  }

</style>
