<template>
  <div style="height:100%" v-if="users && tripDetails &&countriesAll">
    <div style="height:100%">  
        <l-map ref="mapinformation" style="height:100%" v-if="mapsettings" :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}"  :zoom.sync="zoom" :center="countriesAll[tripDetails.countries[Math.floor(Object.keys(tripDetails.countries).length/2)]].location"   :max-bounds="mapsettings.bounds">
          <l-tile-layer :url="mapsettings.url" ></l-tile-layer>  
          
          <div v-if="!tripFinished">
          <div v-for="(country, countryKey) in tripDetails.countries" :key="countryKey">
            <l-marker v-if="showParts" :lat-lng="[countriesAll[country].location.lat,countriesAll[country].location.lng]" >
              <l-icon :class-name="'markerStyleCountry markerStyle-z'+zoomStyle[zoom]">
                <div class="absolute-center">{{countryKey+1}}</div>
              </l-icon>
            </l-marker>
            <l-polyline v-if="countryKey>0" color="DeepSkyBlue" dashOffset="3" :lat-lngs="[countriesAll[tripDetails.countries[countryKey-1]].location,countriesAll[tripDetails.countries[countryKey]].location]"></l-polyline>
          </div>
          </div>

          <div v-if="!tripFuture">
          <div v-for="(story, storyId, index) in tripDetails.stories" :key="storyId"  >
              <l-marker :lat-lng="story.coordinates" >
                  <l-icon :class-name="'markerStyleStory markerStyle-z'+zoomStyle[zoom]">
                      <div class="absolute-center" >{{index+1}}</div>
                  </l-icon>
              </l-marker>
            
              <l-polyline v-if="index>0" :lat-lngs="[tripDetails.stories[storyKeys[index-1]].coordinates,tripDetails.stories[storyKeys[index]].coordinates]" color="rgb(252,186,3)"/>
            </div>
            </div>
            
            <div v-if="storyData.coordinates && tripActive">
                <l-marker :lat-lng="users[userId].coordinates" >
                    <l-icon class-name="center">
                        <div class="center">
                            <div class="circle pulse"></div>
                        </div>
                    </l-icon>
                </l-marker>
                <l-polyline v-if="tripDetails.stories" color="red" dashArray="20,20" dashOffset="3" :lat-lngs="[tripDetails.stories[storyKeys[Object.keys(tripDetails.stories).length-1]].coordinates,storyData.coordinates]"></l-polyline>
            </div>

          <div v-if="!tripFinished&&myProfile">
           <div v-for="(marker, markeryKey) in tripDetails.markers" :key="markeryKey">
            <l-marker v-if="showParts" :lat-lng="landMarkers[marker.itemKey].coordinates" >
              <l-icon :icon-url="markerlist[marker.refKey].iconurl" :icon-size="dynamicSize" :icon-anchor="dynamicAnchor">
              </l-icon>
             
            </l-marker>
          </div>
          </div>


          <div v-if="showParts">
             <l-control position="topleft"  class="q-ma-md">
              <q-btn icon="add" dense class="row bg-white q-pa-xs" size="sm" @click="zoom++"/>
              <q-btn icon="remove" dense class="row bg-white q-pa-xs q-mt-sm" size="sm" @click="zoom--"/>
            </l-control>
          </div>

          <div v-if="!showParts">
            <l-control position="topleft" class="map-overlay no-margin cursor-pointer"/>
            <l-control position="topright" class="q-ma-md">
                 <chip-status :status="tripFuture?'tripFuture':(tripActive?'tripActive':(tripFinished?'tripFinished':false))"/>
            </l-control>

           

            <l-control position="bottomleft" class="q-gutter-xs q-ma-md ownfont text-white" >
            <div class="text-h4 q-ma-sm cursor-pointer">{{tripDetails.title}}</div>
            <div class="row q-gutter-x-sm text-center">
              <div v-if="tripFuture" class="col" style="width:70px">
                <div>{{daysToGo(tripDetails.startdate)}}</div>
                <div>{{daysToGo(tripDetails.startdate)===1?'Day':'Days'}} to go</div>
              </div>
              <div v-if="!tripFuture" class="col" style="width:70px">
                <div>{{daysTraveling}}</div>
                <div>{{daysTraveling===1?'Day':'Days'}}</div>
              </div>
              <div v-if="!tripFuture && totalStoryKeys" class="col" >
                <div>{{totalStoryKeys}}</div>
                <div>Stories</div>
              </div>
              <div class="col">
                <div>{{Object.keys(tripDetails.countries).length}}</div>
                <div>Countries</div>
              </div>
            </div>
          </l-control>
        </div>

      </l-map>
      {{zoom}}
    </div>


  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import mixinTrip from 'src/mixins/mixin-trip.js'
import { LocalStorage } from 'quasar'

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
  mixins: [mixinGeneral,mixinTrip],
  props:['userId','tripKey','showParts'],

  components: {LMap,LTileLayer,LControl,LMarker,LIcon,LPopup,LFeatureGroup,LPolyline,
		'chip-status' : require('components/Trip/ChipStatus.vue').default,
  },

  data () {
    return {
      zoom:5,
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



computed: {

},
methods:{
    ...mapActions('auth',['loadBaseData']),

},
  created(){
    if(!this.countriesAll){
      this.firebasegetCountries()
    }
    let checkload = LocalStorage.getItem('loadedBaseData')
    if(!checkload){
      this.loadBaseData()
    }
    this.tripIdMethod(this.tripKey)
    this.setUserId(this.userId)
  },
  mounted(){
    this.tripIdMethod(this.tripKey)
    this.test
    this.setZoom
  }



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