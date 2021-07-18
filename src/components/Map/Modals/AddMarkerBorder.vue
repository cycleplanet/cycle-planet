<template>
	<q-card class="no-padding" style="width:100% ; height:80%">
		<modal-header>Add Border Marker</modal-header>
			<q-form @submit.prevent.stop="submitMarker()" ref="myForm">
					<q-card-section class="q-gutter-md">
						<modal-banner/>
						
						<p class="cp-h2">Coordinates of border crossing</p>

						<div class="q-gutter-y-md" >
						
						<q-banner inline-actions rounded key="banner" class="bg-green-2 text-green-10">
								<template v-slot:avatar>
									<q-icon name="star" size="sm" />
								</template>
								PRO TIP: You can click on the map to get the coordinates. {{isWebApp?'You can also drag the marker to a position to change the coordinates.':'In the desktop version you can drag the marker to the right position.'}}		
						</q-banner>
						<l-map @click="clickCoordinates" :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}" style="height: 250px" :zoom="zoom" :center="payload.coordinates" key="map" :max-bounds="mapsettings.bounds">
						<l-tile-layer :url="mapsettings.url" :attribution="mapsettings.attribution"></l-tile-layer>  
						<l-marker v-if="payload.coordinates.lat&&payload.coordinates.lng" :lat-lng.sync="payload.coordinates" :draggable="true">
							<l-icon
							:icon-size="dynamicSize"
							:icon-anchor="dynamicAnchor"
							:icon-url="markerlist[refKey].iconurl"
							> </l-icon>
						</l-marker>
						<l-control position="topleft"  class="q-ma-md">
							<q-btn icon="add" dense class="row bg-white q-pa-xs" size="sm" @click="zoom++"/>
							<q-btn icon="remove" dense class="row bg-white q-pa-xs q-mt-sm" size="sm" @click="zoom--"/>
						</l-control>
						</l-map>
					</div>
						<modal-location :payload.sync="payload" />

						<p class="cp-h2">Details of first country</p>
						<div class="text-h6"><b>Country:</b> {{payload.country1.country}}{{currentLocation}}</div>
					
      					<q-input  filled v-model="payload.country1.city" label="Nearest town" :rules="[val => val && val.length > 0 || 'Field is required']"/>
							 
					<div v-if="payload.country1.country">
						<p class="cp-h2">Details of second country</p>
						<q-select :options="Object.keys(allCountries[payload.country1.country].borders_new)" v-model="payload.country2.country" filled label="Select country" behavior="menu" :rules="[val => val && val.length > 0 || 'Field is required']"/>
      					<q-input filled v-model="payload.country2.city" label="Nearest town" :rules="[val => val && val.length > 0 || 'Field is required']"/>
						<modal-description :description.sync="payload.description"/>
						<div v-if="warningDescription" class="text-red">The description is too short!</div>
					</div>
					</q-card-section >

			<q-card-actions align="right">
				<q-btn
					label="Save"
					:style="buttonStyle"
					type="submit" />
			</q-card-actions>
		</q-form>
  </q-card>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { LMap, LTileLayer, LControl, LMarker,LIcon, LPopup, LFeatureGroup } from 'vue2-leaflet'
import { uid } from 'quasar'
import { Geoapify } from 'app/firebase-functions/shared/src/geoapify'
import { geoapify } from '../../../boot/config.js'
import { countryCodes } from 'app/firebase-functions/shared/src/country-constants.js'

	export default {
		props:['refKey','countryKey'],
		mixins: [mixinGeneral],
		components: {
       	LMap, LTileLayer,  LControl, LMarker,  LIcon,  LPopup, LFeatureGroup,
		},
		data() {
			return {
				zoom:1,
				warningDescription:false,
				payload:{
					country1:{city:'',country:''},
					country2:{city:'',country:''},
					coordinates:{lat:null,lng:null},
				}
			}
		},
		computed: {
			
			mapUpdated(){
				if(this.payload.coordinates.lat===this.marker.position.lat&&this.payload.coordinates.lng===this.marker.position.lng){
					return true
					
				}else{return false}
			},
			hasCountryKey(){
				if(this.countryKey){
					this.payload.country1.country=this.countryKey
				}
			},
			currentLocation(){
				if(this.payload.coordinates.lat){
					new Geoapify(geoapify.apiKey).reverseGeocodeToCountryCode(this.payload.coordinates.lat, this.payload.coordinates.lng).then(cc => {
						if (cc) {
							 this.payload.country1.country=countryCodes[cc]
						}
					}).catch(err => {

					})
				}

			},          
		},
		mounted(){
			this.hasCountryKey
		},
		methods: {

			clickCoordinates(event) {
				this.payload.coordinates=event.latlng
			},
			
			submitMarker(){
				if(Object.keys(this.payload.description).length>50){
					this.$refs.myForm.validate().then(success => {
						if (success) {
							let markerId=uid()

							this.updateItemAction({
								path:'Users/'+this.myUserId+'/points/markers_added',
								data:{
									[this.timeStamp]:markerId
								}
							})
							this.addPoints(10)
							Notify.create('Thanks for your contribution. You`ve earned 10 points!')
							
							this.setItemActionFs({
								collection:'Markers',
								doc:markerId,
								data:{
									itemKey:markerId,
									refKey:this.refKey,
									description:this.payload.description,
									country1:this.payload.country1,
									country2:this.payload.country2,
									refKey:this.refKey,
									date_created:this.timeStamp,
									user_created:this.myUserId,
									coordinates:{
										lat:this.payload.coordinates.lat,
										lng:this.payload.coordinates.lng
									}
								},
							}).then(response=>{
								this.$emit('close')

							}).catch(err=>{
							})
						}
					})
				}else{
					this.warningDescription=true

				}
			}
		}
		
	}
</script>