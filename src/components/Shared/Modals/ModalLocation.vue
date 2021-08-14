<template>
	<div >
		<div class="q-gutter-sm no-padding">
			<q-toggle v-model="value" label="Are you at current location now?" class="no-margin" />
			<div v-if="!value">Or find coordinates on <a href="https://www.openstreetmap.org/" class="underline cursor-pointer text-blue-8">OpenStreetMap</a></div>
			<q-input  filled v-model="payload.coordinates.lat" label="Latitude" :rules="[val => !!val || 'Field is required']" placeholder="Use only numbers and a dot(.), for example: 3.6435345" />
			<q-input  filled v-model="payload.coordinates.lng" label="Longitude"  :rules="[val => !!val || 'Field is required']"  placeholder="Use only numbers and a dot(.), for example: 3.6435345"/>
		</div>
	<div v-if="value">

	<q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="my_location"/>
          <span class="q-ml-sm">Should we use your current location?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" class="text-secondary" :style="buttonStyle" v-close-popup />
          <q-btn  label="Yes" class="bg-secondary text-white" :style="buttonStyle" @click="setNewValue" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
	</div>
	
	</div>
</template>

<script>
const axios = require('axios');
import { Geoapify } from 'app/firebase-functions/shared/src/geoapify'
import { geoapify } from '../../../boot/config.js'

	export default {
		props: ['payload'],
		
		data() {
			return {
				 value: false,
				 dialog:true,
			}
		},
			
		methods: {
			setNewValue() {
                navigator.geolocation.getCurrentPosition(
                    position => {
                       	this.payload.coordinates.lat=position.coords.latitude,
						this.payload.coordinates.lng=position.coords.longitude
						this.getCountry(position)

					},
                    error=> {
                      alert(error.message);
                    }, {
                      enableHighAccuracy: true,
                      timeout: 5000
                    }
                )
			},
			getCountry(position){
				new Geoapify(geoapify.apiKey).reverseGeocode(position.coords.latitude, position.coords.longitude).then(address => {
					this.locationSuccess(address)
				}).catch(err=>{
				})
			},
			locationSuccess(address){
				if (address) {
					this.payload.countryGenerated=address.country
				}
			}
		}
	}
</script>