<template>
    <div >
        <l-map :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}" style="height: 250px" :zoom="11" :center="singleItemData.coordinates">
        <l-tile-layer :url="mapsettings.url" :attribution="mapsettings.attribution"></l-tile-layer>  
          <l-marker :lat-lng="(singleItemData.coordinates)" :draggable="draggable">
            <l-icon
            :icon-size="dynamicSize"
            :icon-anchor="dynamicAnchor"
            :icon-url="markerlist[refKey].iconurl"
            > </l-icon>
            <mapmarker-popup :singleItemData="singleItemData"/>
           
          </l-marker>
        </l-map>
        

     
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'

import { LMap, LTileLayer, LControl, LMarker,LIcon } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

export default {    
  props:['singleItemData','draggable'],
  mixins: [mixinGeneral, ],

  components: {
    LMap, LTileLayer,  LControl, LMarker,  LIcon,
    'mapmarker-popup' : require('components/Shared/MapMarkerPopUp.vue').default,
  },

  data () {
    return {
    }
  },
   
  computed: {
    refKey(){
      return this.singleItemData.refKey
    },
        
  },
 
}


</script>

<style>

</style>