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
import { LMap, LTileLayer, LControl, LMarker, LIcon, LPopup } from 'vue2-leaflet'
import Vue2LeafletMarkercluster from 'src/clustermarkers/Vue2LeafletMarkercluster'
import { latLng, Icon } from 'leaflet';

  export default {
  mixins: [mixinGeneral, ],
  props:['countryKey'],
    components: {
      LMap,
      LControl,
      LIcon,
      LTileLayer,
      LMarker,
      LPopup,
		  'item-dialog': require('components/Marker/ItemDialog.vue').default,
    	// 'item-dialog': require('components/Country/Modals/ItemDialog.vue').default,
      
      'mapmarker-popup' : require('components/Shared/MapMarkerPopUp.vue').default,

      'v-map': LMap,
      'v-tilelayer': LTileLayer,
      'v-marker': LMarker,
      'v-popup': LPopup,
      'v-marker-cluster': Vue2LeafletMarkercluster,
    },
    
    data () {
     
      return {
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
        console.log('clickedMarkerMethod',this.itemDetails);
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
  @import "~leaflet/dist/leaflet.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
  html, body {
    height: 100%;
    margin: 0;
  }
</style>