<template>
  <div >
    <div class="items-center justify-center flex" :style="'background-image:linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url('+userData.backgroundimageurl+');height:200px;background-size: cover;'">
      <q-btn class="text-white"  outline label="change background photo" rounded icon="add_a_photo" @click="editBackgroundDialog=true"/>
    </div>

<div class="q-pa-sm">
  <div class="text-h6 q-mt-md">General</div>
  <div >Setup your general profile details.</div>
  <div class="row q-mt-md">
    <div  class="col-xs-12 col-sm-12 col-md-6 col q-mb-md">
      <div style="width:94px" class="q-mb-sm">
        <q-avatar size="94px">
          <q-img v-if="userData.imageurl" :src="userData.imageurl"/>
        </q-avatar>
        <div @click="editProfileDialog=true" class="underline-hover text-blue-10 justify-center row" >Edit image</div>
      </div>
      <div class="row">
        <q-input class="col-xs-12 col-sm-12 col-md-9" outlined v-model="userData.fullname" label="Name"/>
      </div>
    </div>

    <div class="col-xs-12 col-sm-12 col-md-6">
      <l-map @click="clickCoordinates"  :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}" style="height: 250px" :zoom="zoom" :center="userData.coordinates" :max-bounds="mapsettings.bounds" key="map" >
        <l-tile-layer :url="mapsettings.url" :attribution="mapsettings.attribution"></l-tile-layer> 
        <div v-if="userData.coordinates_hide">
          <l-circle
          :lat-lng="userData.coordinates_approx?userData.coordinates_approx:[userData.coordinates.lat+Math.random()*0.01,userData.coordinates.lng+Math.random()*0.01]"
          :radius="1100"
          />
        </div> 
        <l-marker v-if="userData.coordinates&&!userData.coordinates_hide"  :lat-lng.sync="userData.coordinates" :draggable="true">
          <l-icon
          :icon-size="dynamicSize"
          :icon-anchor="dynamicAnchor"
          :icon-url="markerlist[userData.hosting.status].iconurl" class-name="someExtraClass"
          ></l-icon>
        </l-marker>
          <l-control position="topleft"  class="q-ma-md">
          <q-btn icon="add" dense class="row bg-white q-pa-xs" size="sm" @click="zoom++"/>
          <q-btn icon="remove" dense class="row bg-white q-pa-xs q-mt-sm" size="sm" @click="zoom--"/>
        </l-control>
      </l-map>
      <getlocation-button/>
      <q-toggle v-model="userData.coordinates_hide" label="Hide exact location" />
      <div v-if="userData.coordinates" class="q-my-md">
        <city-country class="text-bold" :lat="userData.coordinates.lat" :lng="userData.coordinates.lng" />
        <div>{{userData.coordinates.lat}}, {{userData.coordinates.lng}}</div>
      </div>
      <div class="row">
        <q-select class="col-xs-12 col-sm-12 col-md-9" outlined v-if="userData.hosting" v-model="userData.hosting.status" :options="options" label="Status" use-input behavior="menu"  />
      </div>
    </div>
  </div>
</div>
<q-separator class="q-my-md"></q-separator>
<div class="q-pa-sm">
  <div class="text-h6">About</div>
  <div>Tell others something more about yourself.</div>
  <div class="row justify-center">
    <div class="col-xs-12 col-sm-12 col-md-4 q-pa-xs">
      <q-input outlined type="textarea"  v-model="userData.bio" label="About me" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4  q-pa-xs">
      <q-input outlined type="textarea"  v-model="userData.interests" label="Interests" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4  q-pa-xs">
<<<<<<< HEAD
      <q-select outlined  type="textarea" v-model="userData.countries_cycled_new" multiple :options="Object.keys(countryCodes_rev)" use-chips stack-label label="Countries cycled" behavior="menu"/>
=======
      <q-select outlined  type="textarea" v-model="userData.countries_cycled_new" multiple :options="Object.values(countries)" use-chips stack-label label="Countries cycled" behavior="menu"/>
>>>>>>> 5d04262 (make Geoapify available in firebase-functions)

    </div>
  </div>
</div>
<q-separator class="q-my-md"></q-separator>
<div class="q-pa-sm">
  <div class="text-h6">Gear</div>
  <q-card-section class="q-pt-none no-margin no-padding" >
    <q-list  separator >
        <div  v-for="(gear, gearKey) in userData.gear_list_new" :key="gearKey" class="q-mt-md">
          <b>{{gearKey}}</b>
          <div v-for="(item, itemKey) in gear" :key="itemKey">
            <div v-for="(childitem, childitemKey) in item" :key="childitemKey">
                <q-item bordered separator>
                    <q-item-section>
                        <q-item-label caption>{{itemKey}}</q-item-label>
                        <q-item-label >{{childitem}}</q-item-label>
                        </q-item-section>
                    <q-item-section side>
                        <q-btn flat dense icon="cancel" @click="deleteGear(gearKey,itemKey,childitemKey)"/>
                    </q-item-section>
                </q-item>
                <q-separator></q-separator>
            </div>
          </div>

        </div>
    </q-list>
    <q-btn icon="add" label="add gear item" @click="addItemDialog=true" class="q-mt-md buttontheme1"/>
  </q-card-section>
</div>
  <q-dialog :maximized="isWebApp?false:true" v-model="editBackgroundDialog">
    <edit-backgroundpicture @close="editBackgroundDialog = false" />
  </q-dialog>

  <q-dialog :maximized="isWebApp?false:true" v-model="editProfileDialog">
    <edit-profilepicture @close="editProfileDialog = false" />
  </q-dialog>

  <q-dialog v-model="addItemDialog" >
    <add-gear @close="addItemDialog=false"/>
  </q-dialog>

  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { LMap, LTileLayer, LControl, LMarker,LIcon, LPopup, LFeatureGroup, LCircle } from 'vue2-leaflet'
const countryConstants = require('app/firebase-functions/shared/src/country-constants.js')

export default {
    mixins: [mixinGeneral],
    props:['userData'],

     data() {
	  	return {
      editBackgroundDialog:false,
      zoom:null,
      editProfileDialog:false,
      addGear:false,
      addItemDialog:false,
      cityCountry:'',
      options: [
          'Available for hosting', 'Not available for hosting', 'Touring'
      ]
	  }
  },

  components:{
       	LMap, LTileLayer,  LControl, LMarker,  LIcon,  LPopup, LFeatureGroup, LCircle,
		'edit-backgroundpicture': require('components/Profile/EditBackgroundImage.vue').default,
		'edit-profilepicture': require('components/Profile/EditProfileImage.vue').default,
		'add-gear': require('components/Profile/AddGear.vue').default,
		'getlocation-button': require('components/Shared/GetLocationButton.vue').default,
  },
  methods:{
      ...mapActions('other', ['getAllGearUser','addGearUser','selectGearUser','deleteGearUser']),

      countries() {
        return countryConstants.countryCodes
      },

      clickCoordinates(event) {
				this.userData.coordinates=event.latlng
			},

      deleteGear(gearKey,itemKey,childitemKey){
          let path=gearKey+'/'+itemKey+'/'+childitemKey
          this.$delete( this.userData.gear_list_new[gearKey][itemKey], childitemKey)
          this.deleteGearUser({
              path:path
          })
      }
  },
  created(){
     if(this.userData.coordinates){
       this.zoom=10
     }else{
       this.zoom=1
     }
  }
}
</script>

<style>

</style>