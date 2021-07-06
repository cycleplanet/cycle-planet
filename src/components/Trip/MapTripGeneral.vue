<template>
  <div style="height:100%" v-if="users && tripDetails &&allCountries">
    <div style="height:100%">  
        <l-map ref="mapinformation" style="height:100%" v-if="mapsettings" :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}"  :zoom.sync="zoom" :center="allCountries[tripDetails.countries[Math.floor(Object.keys(tripDetails.countries).length/2)]].location"   :max-bounds="mapsettings.bounds">
          <l-tile-layer :url="mapsettings.url" ></l-tile-layer>  
          
          <div v-for="(country, countryKey) in tripDetails.countries" :key="countryKey">
            <l-marker v-if="showParts" :lat-lng="[allCountries[country].location.lat,allCountries[country].location.lng]" >
              <l-icon :class-name="'markerStyleCountry markerStyle-z'+zoomStyle[zoom]">
                <div class="absolute-center">{{countryKey+1}}</div>
              </l-icon>
            </l-marker>
            <l-polyline v-if="countryKey>0" color="DeepSkyBlue" dashOffset="3" :lat-lngs="[allCountries[tripDetails.countries[countryKey-1]].location,allCountries[tripDetails.countries[countryKey]].location]"></l-polyline>
          </div>


          <div v-if="showParts">
            <l-control position="topleft"  class="q-ma-md">
              <q-btn icon="add" dense class="row bg-white q-pa-xs" size="sm" @click="zoom++"/>
              <q-btn icon="remove" dense class="row bg-white q-pa-xs q-mt-sm" size="sm" @click="zoom--"/>
            </l-control>
          </div>

        

      </l-map>
    </div>


  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

import { LMap, LTileLayer, LControl, LMarker,LIcon, LPopup, LFeatureGroup, LPolyline} from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { latLng, Icon } from 'leaflet';
const axios = require('axios');
// import  from './LGpx.vue';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


export default {   
  mixins: [mixinGeneral],
  props:['tripDetails','showParts'],

  components: {LMap,LTileLayer,LControl,LMarker,LIcon,LPopup,LFeatureGroup,LPolyline,

  },

  data () {
    return {
      zoom:2,
      zoomStyle:{
        1:2,
        2:2,
        3:3,
        4:4,
        5:5,
        6:6,
        7:7,
        8:8,
        9:9,
        10:9,
        11:9,
        12:9,
        13:9,
        14:9,
        15:9,
        16:9,
        17:9,
        18:9,
      }
       
    }
  },
}


</script>

<style>
.markerStyle-z2{
  width: 10px !important;
  height: 10px !important;
  margin-left: -5px !important;
  margin-top: -5px !important;
  font-size: 7px;

}
.markerStyle-z3{
  width: 16px !important;
  height: 16px !important;
  margin-left: -8px !important;
  margin-top: -8px !important;
  font-size: 10px;

}
.markerStyle-z4{
  width: 22px !important;
  height: 22px !important;
  margin-left: -11px !important;
  margin-top: -11px !important;
  font-size: 13px;

}
.markerStyle-z5{
  width: 28px !important;
  height: 28px !important;
  margin-left: -14px !important;
  margin-top: -14px !important;
  font-size: 16px;
}
.markerStyle-z6{
  width: 34px !important;
  height: 34px !important;
  margin-left: -17px !important;
  margin-top: -17px !important;
  font-size: 19px;
}
.markerStyle-z7{
  width: 40px !important;
  height: 40px !important;
  margin-left: -20px !important;
  margin-top: -20px !important;
  font-size: 21px;
  
}
.markerStyle-z8{
  width: 40px !important;
  height: 40px !important;
  margin-left: -20px !important;
  margin-top: -20px !important;
  font-size: 21px;
}
.markerStyle-z9{
  width: 40px !important;
  height: 40px !important;
  margin-left: -20px !important;
  margin-top: -20px !important;
  font-size: 21px;
}

.markerStyleCountry {
  background-color: lightskyblue;
  border: 1px solid black;
  border-radius: 50%;
}
.markerStyleStory {
  background-color: rgb(252,186,3);
  border: 1px solid black;
  border-radius: 50%;
}
.border{
    border:1px solid black;
    margin-top:10px;
    border-radius: 5px;
    padding:3px;

}
.alignText{
  vertical-align: middle;
}
.map-overlay{
  background-image:  linear-gradient(to bottom, rgba(240,255,0, 0.1),rgba(0,0,0, 0.80));
  position: absolute;
  height:400px;
  width: 600px;
}
.leaflet-control-zoom{
  display: none;
}
.overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
.ownfont{
	font-family: 'customfont';
}
.center {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
}

.circle {
  background:#e6606b;
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