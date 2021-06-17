<template>
	<q-card class="no-padding" style="width:100%">
		<modal-header>Edit Visa Marker</modal-header>
			<form @submit.prevent="submitMarker">
				<q-card-section class="q-gutter-y-md">

					<q-banner dense rounded class="bg-green-2 text-green-10" v-if="canEdit">You can edit the <b>title</b> and <b>coordinates</b> because you {{admin?'are an admin.':(roleEditor?'are an editor.':(data.user_created===myUserId?'created this item.':''))}}</q-banner>

					<q-banner inline-actions rounded class="bg-green-2 text-green-10" v-if="!canEdit">To edit the <b>coordinates</b> you need to be an <span class="underline cursor-pointer" @click="applyEditor=true">editor</span>. Now you can only add and edit <b>visa types</b> and the <b>description</b></q-banner>

					<p><b>Visa for:</b> {{countryKey}}</p>
						


					
					<div v-if="data.onlineVisa">
						<div v-if="canEdit" class="q-gutter-md">
							<q-input filled v-model="data.website" label="Website" />
						</div>
						<div v-if="!canEdit" class="q-gutter-y-md">
							<p><b>Website:</b> {{data.website}}</p>
						</div>
					</div>
							
					<div v-if="!data.onlineVisa" class="q-gutter-y-md">
						<p><b>Embassy located in:</b>{{data.country}}</p>
						<div v-if="canEdit" class="q-gutter-y-md">
							<p><b>Coordinates:</b></p>
							<q-input label="Latitude" v-model="marker.position.lat" filled/>
							<q-input label="Longitude" v-model="marker.position.lng" filled/>
							<q-btn  label="update map" @click="updateCoords()" :class="mapUpdated?'text-grey bg-white':'text-white bg-secondary'"/>
							<q-banner inline-actions rounded class="bg-green-2 text-green-10" v-if="canEdit">
								<template v-slot:avatar>
									<q-icon name="star" size="sm" />
								</template>
								PRO TIP: {{isWebApp?'You can also drag the marker to a position to change the coordinates.':'In the desktop version you can drag the marker to the right position.'}}
								</q-banner>
						</div>
						<div v-if="!canEdit" class="q-gutter-md">
							<p><b>Latitude:</b> {{marker.position.lat}}</p>
							<p><b>Longitude:</b> {{marker.position.lng}}</p>
						</div>
					</div>
							
				</q-card-section >

				<div v-if="!data.onlineVisa">
					<l-map :options="screenwidthbig?{scrollWheelZoom:false}:{scrollWheelZoom:false, dragging:false, tap: false}" style="height: 250px" :zoom="11" :center="data.coordinates">
					<l-tile-layer :url="mapsettings.url" :attribution="mapsettings.attribution"></l-tile-layer>  
					<l-marker :lat-lng.sync="marker.position" :draggable="canEdit?true:false">
						<l-icon
						:icon-size="dynamicSize"
						:icon-anchor="dynamicAnchor"
						:icon-url="markerlist[refKey].iconurl"
						> </l-icon>
					</l-marker>
					</l-map>
				</div>
				
				<q-card-section >
					<p><b>Visa types:</b></p>
					<q-list bordered  class="bg-white">
						<q-item class="text-bold">
						<q-item-section class="col-5">
							<div class="row">
								Type
								<q-icon name="help" class="q-pa-xs text-grey">
									<q-tooltip content-class="bg-purple" content-style="font-size: 16px">
									What kind of visa is it? For example: this can be a tourist visa with single entry, or a bussines visa.
									</q-tooltip>
								</q-icon>
							</div>
						</q-item-section>
						<q-item-section class="col-3">
							<div class="row">
								Length
								<q-icon name="help" class="q-pa-xs text-grey">
									<q-tooltip content-class="bg-purple" content-style="font-size: 16px">
									Specify for how long this type is valid, in days or months.
									</q-tooltip>
								</q-icon>
							</div></q-item-section>
						<q-item-section class="col-2">
							<div class="row">
								Costs
								<q-icon name="help" class="q-pa-xs text-grey">
									<q-tooltip content-class="bg-purple" content-style="font-size: 16px">
									Specify the cost of this type of visa, in the currency that you need to use.
									</q-tooltip>
								</q-icon>
							</div></q-item-section>
							<q-item-section class="col-1">
								</q-item-section>
					</q-item>
						<q-separator />

						<div v-for="(visa, visaKey) in (data.visas?data.visas:payloadData.visas)" :key="visaKey">
							<q-item>
								<q-item-section class="col-5">{{visa.title}}</q-item-section>
								<q-item-section class="col-3">{{visa.leng}}</q-item-section>
								<q-item-section class="col-2">{{visa.costs}}</q-item-section>
								<q-item-section class="col-1">
									<q-btn v-if="admin||roleEditor||data.user_created===myUserId" icon="edit" flat dense size="sm" @click="editVisaMethod(visaKey)"/>
								</q-item-section>
							</q-item>
							<q-separator />
						</div>
							<q-item v-if="addVisa">
							<q-form  @submit.prevent="submitVisa()" class="q-gutter-sm full-width">
								<q-input filled v-model="visas.title" label="Type" />
								<q-input filled v-model="visas.leng" label="Length" />
								<q-input filled v-model="visas.costs" label="Costs" />
							</q-form>
						</q-item>
						<q-item>
							<q-item-section><q-btn dense label="Add" icon="add" v-if="!addVisa" :style="buttonStyle" @click="addVisaMethod"/></q-item-section>
							<q-item-section><q-btn dense label="Cancel" v-if="addVisa"  outline class="buttontheme2" @click="addVisa=false"/></q-item-section>
							<q-item-section><q-btn dense label="Submit" v-if="addVisa" :style="buttonStyle" @click="submitVisa"/></q-item-section>
						</q-item>
					</q-list>
				</q-card-section>

				
	
					<q-card-section >
						<div class="q-gutter-sm">
							<div class="text-bold">Description:</div>
						<q-banner rounded class="bg-orange-2 text-orange-10">All logged in users can edit the description, but please make sure to follow our <span class="underline cursor-pointer" @click="clickGuidelines()">guidelines</span>.</q-banner>
								<q-editor
								@paste.native="evt => pasteCapture(evt)"
							ref="editor_ref"
								v-model="data.description"
								:dense="$q.screen.lt.md"
								:toolbar="[
									['bold', 'italic', 'underline'],
									['link'],
									['unordered', 'ordered'],
									['viewsource']
								]">
								</q-editor>
						</div>
					</q-card-section>


					<q-separator />

			<q-card-actions align="right">
				<q-btn label="Save" :style="buttonStyle" type="submit" />
			</q-card-actions>
		</form>

		 <q-dialog v-model="editVisaType">
			<q-card class="no-padding" style="width:100%; max-width:350px">
    		<modal-header>Edit Visa Type</modal-header>

				<q-form  @submit.prevent="saveEditVisaType" class="q-gutter-sm full-width">
					<q-input filled v-model="editVisaData.title" label="Type" />
					<q-input filled v-model="editVisaData.leng" label="Length" />
					<q-input filled v-model="editVisaData.costs" label="Costs" />
					
					<q-card-actions align="right">
						<q-btn label="Save" :style="buttonStyle" type="submit" />
					</q-card-actions>
				</q-form>
			</q-card>
		</q-dialog>
		 <q-dialog v-model="applyEditor" >
			<apply-editor @close="applyEditor = false" />
		</q-dialog>

  </q-card>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import {  uid, Notify } from 'quasar'
import { mapState, mapActions, mapGetters  } from 'vuex'
import { LMap, LTileLayer, LControl, LMarker,LIcon, LPopup, LFeatureGroup } from 'vue2-leaflet'
import { firebase } from 'boot/config'

	export default {
		props:['singleItemData'],
		mixins: [mixinGeneral],
		components: {
       	LMap, LTileLayer,  LControl, LMarker,  LIcon,  LPopup, LFeatureGroup,

		'apply-editor': require('components/Shared/ApplyEditor.vue').default,
		},
		data() {
			return {
				model: null,
				addVisa:false,
				editVisaType:false,
				editVisaData:{},
				visaKey:'',
				applyEditor:false,
				visas:{},
				payloadData:{
					visas:[],
					coordinates:{lat:null,lng:null},
				},

				marker: {
					position: { 
						lat: this.singleItemData.coordinates.lat, 
						lng: this.singleItemData.coordinates.lng 
					},
				},
				data:{},
			}
		},
		computed: {

			refKey () {
				return this.singleItemData.refKey
			},
			itemKey () {
				return this.singleItemData.itemKey
			},
			countryKey () {
				return this.singleItemData.countryKey
			},
		
			canEdit(){
				if(this.admin||this.roleEditor||this.data.user_created===this.myUserId){
					return true
				}else{
					return false
				}
			},
			mapUpdated(){
				if(this.data.coordinates.lat===this.marker.position.lat&&this.data.coordinates.lng===this.marker.position.lng){
					return true
				}else{return false}
			}
			      
		},
		
		methods: {
			updateCoords(){
				this.data.coordinates.lat=this.marker.position.lat
				this.data.coordinates.lng=this.marker.position.lng
				this.marker.position.lat=this.data.coordinates.lat
				this.marker.position.lng=this.data.coordinates.lng
			},
			submitVisa(){
				if(this.data.visas){
                    this.data.visas.push(this.visas)
                }else{
                    this.data.visas={
                        0:this.visas
                    }
                }
                firebase.fs.collection('Markers').doc(this.itemKey).update({visas:this.data.visas})
				this.visas={}
				this.addVisa=false
			},

			editVisaMethod(visaKey){
				this.visaKey=visaKey
				this.editVisaData=this.data.visas[visaKey]
				this.editVisaType=true
			},
			saveEditVisaType(){
				if(this.data.visas){
                    this.data.visas=this.data.visas
                }else{
                    this.data.visas={
                        [this.visaKey]:editVisaData
                    }
                }
                firebase.fs.collection('Markers').doc(this.itemKey).update({visas:this.data.visas})

				// this.updateItemActionFs({
				// 	collection:'Markers',
				// 	doc:this.itemKey+'/visas/'+this.visaKey,
				// 	data:this.data
				// })
			
				this.editVisaType=false
				this.visaKey=''
				this.editVisaData={}
			},

			submitMarker(){
				
				this.data.refKey=this.refKey
				this.data.date_edited=this.timeStamp
				this.data.user_edited=this.myUserId
				this.data.coordinates.lat=this.marker.position.lat
				this.data.coordinates.lng=this.marker.position.lng
				if(!this.data.visas){
					this.data.visas=this.payloadData.visas
				}
				this.updateItemActionFs({
					collection:'Markers',
					doc:this.itemKey,
					data:this.data
				})
				this.$emit('close')
			},
			addVisaMethod(){
				this.addVisa=true
			},
		},
		mounted() {
			this.data = Object.assign({}, this.singleItemData)
 		}
		
	}
</script>