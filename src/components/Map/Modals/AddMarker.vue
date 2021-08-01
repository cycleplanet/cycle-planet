<template>
	<q-card class="no-padding " style="width:100% ">
		<modal-header>Add {{markerlist[refKey].title}} Marker</modal-header>
			<q-form @submit.prevent="submitMarker()" ref="myForm">
				<q-card-section class="q-gutter-y-md">

					<modal-banner/>


					<div  class="q-gutter-y-md" >

						<q-banner inline-actions rounded key="banner" class="bg-green-2 text-green-10 q-mt-md">
								<template v-slot:avatar>
									<q-icon name="star" size="sm" />
								</template>
								PRO TIP: You can click on the map to get the coordinates. {{isWebApp?'You can also drag the marker to a position to change the coordinates.':'In the desktop version you can drag the marker to the right position.'}}
						</q-banner>
						<l-map @click="clickCoordinates"  :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}" style="height: 250px" :zoom="zoom" :center="payload.coordinates" :max-bounds="mapsettings.bounds" key="map" >
							<l-tile-layer :url="mapsettings.url" :attribution="mapsettings.attribution"></l-tile-layer>
							<l-marker v-if="payload.coordinates.lat && payload.coordinates.lng" :lat-lng.sync="payload.coordinates" :draggable="true">
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


					<p class="text-h6" v-if="countryKey"><b>Country:</b> {{countryKey}}</p>
					<div class="text-h6" v-if="!countryKey"><b>Country:</b> {{payload.country}}{{currentLocation}}</div>
					<q-input filled v-model="payload.title" label="Title activity"  :rules="[val => val.length >= 5 || 'Use at least 5 characters']"/>
					<modal-description :description.sync="payload.description"/>
					<div v-if="warningDescription" class="text-red">The description is too short!</div>

				</q-card-section >

				<q-card-actions align="right">
					<q-btn label="Save" :style="buttonStyle" @click="submitMarker()"/>
				</q-card-actions>
		</q-form>
  </q-card>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { LMap, LTileLayer, LControl, LMarker,LIcon, LPopup, LFeatureGroup } from 'vue2-leaflet'
import { uid, Notify } from 'quasar'
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
				geocoder: new Geoapify(geoapify.apiKey),
				zoom:1,
				warningDescription:false,
				payload:{
					description:'',
					country:'',
					coordinates:{
						lat:'',
						lng:''
					}

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
				console.log('currentLocation 1', this.payload);
				if(this.payload.coordinates.lat){
					this.geocoder.reverseGeocodeToCountryCode(this.payload.coordinates.lat, this.payload.coordinates.lng).then(cc => {
						this.payload.country=countryCodes[cc];
					}).catch(err => {
						console.log('currentLocation 3',err);
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

			errorCountry(){
				this.$q.dialog({
					title: 'No valid country',
					message: 'With these coordinates, we can`t reckognize a country. Please try different coordinates.'
				}).onOk(() => {
				})
			},

			submitMarker(){
				this.$refs.myForm.validate().then(success => {
				  	if (success) {
						this.payload.refKey=this.refKey
						if(this.countryKey){
							this.payload.country=this.countryKey
						}
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
								countryKey:this.payload.country,
								refKey:this.refKey,
								title:this.payload.title,
								description:this.payload.description,
								refKey:this.refKey,
								date_created:this.timeStamp,
								user_created:this.myUserId,
								coordinates:{
									lat:this.payload.coordinates.lat,
									lng:this.payload.coordinates.lng
								}
							}
						}).then(response=>{

							this.$emit('close')

						}).catch(err=>{
						})

					  }
				})
			},
			addVisaMethod(){
				this.addVisa=true
			},
		}

	}
</script>
