<template>
<div>
  <v-marker-cluster :options="clusterOptions" @clusterclick="click()" @ready="true">
    <div v-for="(marker, markerKey) in landMarkers" :key="markerKey">
      <div v-if="marker.countryKey===countryKey">
        <v-marker :lat-lng="[marker.coordinates.lat,marker.coordinates.lng]" v-if="markerlist[marker.refKey].active">
          <l-icon :icon-url="markerlist[marker.refKey].iconurl" :icon-size="dynamicSize" :icon-anchor="dynamicAnchor"></l-icon>
            <mapmarker-popup :singleItemData="marker" @markerClick="clickedMarkerMethod(markerKey)"/>
        </v-marker>
      </div>
    </div>
  </v-marker-cluster>

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
  props:['countryKey'],

    components: {
      LMap,
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
