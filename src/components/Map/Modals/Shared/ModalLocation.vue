<template>
	<div class="q-mb-sm no-padding">
		<q-toggle
			v-model="value" class="no-padding"
			label="Are you at current location now?"
		/>
		<div v-if="value">
			<q-dialog v-model="dialog">
				<q-card>
					<q-card-section class="row items-center">
					<q-avatar icon="my_location" :style="buttonStyle" text-color="white" />
					<span class="q-ml-sm">Should we use your current location?</span>
					</q-card-section>

					<q-card-actions align="right">
					<q-btn flat label="Cancel" v-close-popup />
					<q-btn  label="Yes" :style="buttonStyle" @click="setNewValue" v-close-popup />
					</q-card-actions>
				</q-card>
			</q-dialog>
		</div>
	</div>
</template>

<script>
    import {Geoapify} from 'src/functions/geoapify';

	export default {
		props: ['payload'],
		
		data() {
			return {
				 value: false,
				 dialog:true,
			}
		},

		
			
		methods: {
			

			setNewValue(){
			   
                navigator.geolocation.getCurrentPosition(
                    position => {
                       	this.payload.coordinates.lat=position.coords.latitude,
						this.payload.coordinates.lng=position.coords.longitude
						this.getCityAndCountry(position)

					},
                    error=> {
                      alert(error.message);
                    }, {
                      enableHighAccuracy: true,
                      timeout: 5000
                    }
                )
			},
			getCityAndCountry(position){
				Geoapify.reverseGeocode(position.coords.latitude, position.coords.longitude).then(address => {
					this.locationSuccess(address)
				}).catch(err=>{
				})
			},

			locationSuccess(address){
				if(address.country){
				this.payload.country = address.country;
				}
				this.payload.city = address.city;
			}
		}
	}
</script>