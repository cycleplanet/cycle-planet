<template>
    <div v-if="orderMarkers">
        <l-map 
        :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}"
        style="height: 350px" 
        :zoom="zoom"
        :center="countryData.location"
        >
          <l-tile-layer 
          :url="mapsettings.url" 
          :attribution="mapsettings.attribution" 
          ></l-tile-layer>  
            <div v-for="(itemKey, index) in orderMarkers" :key="index">
              <l-marker :lat-lng="(landMarkers[itemKey].coordinates) ">
                <l-icon class-name="markerStyleNew" :style="'background-color: purple'">
                  <div class="text-h6" >{{index+1}}</div>
                </l-icon>
              </l-marker>
            </div>

          <l-control position="topleft"  class="q-ma-md">
            <q-btn icon="add" dense class="row bg-white q-pa-xs" size="sm" @click="zoom++"/>
            <q-btn icon="remove" dense class="row bg-white q-pa-xs q-mt-sm" size="sm" @click="zoom--"/>
          </l-control>
        </l-map>
        

     
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters  } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

import { LMap, LTileLayer, LControl, LMarker,LIcon, LPopup, LFeatureGroup } from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { latLng, Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default { 
	mixins: [mixinGeneral],

    props:['refKey','orderMarkers','countryKey'],
    components: { LMap, LTileLayer,  LControl, LMarker,  LIcon,  LPopup, LFeatureGroup,
    },

  data () {
    return {
      zoom:3
      
      }
  },
   mounted() {
			this.$root.$on('showAddTask', () => {
				this.showAddTask = true
			})
      this.zoom=this.countryData.zoom
		},
    computed: {
		  ...mapState('country', ['countryData']),

            
    },


  methods:{
  
  }
 
}


</script>

<style>
.markerStyleNew {
  background-color: lightcoral;
  border: 1px solid black;
  border-radius: 15px;
  text-align: center;
  width: 30px !important;
  height: 30px !important;
  margin-left: -15px !important;
  margin-top: -15px !important;
}
</style>