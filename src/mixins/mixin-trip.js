import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { date, uid, Notify } from 'quasar'
import { openURL } from 'quasar'
import { Geoapify } from '../functions/geoapify'

export default {
	data() {
		return {
		  storyData:{
			coordinates:{
			  lat:0,
			  lng:0
			},
			country:'',
			place:'',
			title:'',
			story:'',
		  },
		  tripId:'',
		  userId2:'',
		  mySelectedCountries:[],
		  mySelectedCountriesNew:[],

		}
	
	},
	computed: { 
		...mapState('markers', ['markerlist','settings','markeruserlist']),    
		...mapState('countries', ['countryCodes']),    
		locationSupported() {
			if ('geolocation' in navigator) return true
			return false
		},
		userId () {
			if(this.$route.params.userId){
				return this.$route.params.userId
			}else{
				this.userId2
			}
		},
		myProfile() {
			if(this.userId===this.myUserId){
					return true
			}else{
				return false
			}
		},
		tripDetails () {
			if(Object.keys(this.users).length){
				if(this.$route.params.userId){
					return this.users[this.userId].trips[this.tripId]

				}else{
					if(this.userId2){
						return this.users[this.userId2].trips[this.tripId]

					}
				}
			}
		},
		storyKeys(){
			if(Object.keys(this.tripDetails).length){
			  if(this.tripDetails.stories){
			   return Object.keys(this.tripDetails.stories)  
			  }
			}
		},
		totalStoryKeys(){
			if(Object.keys(this.tripDetails).length){
			  if(this.tripDetails.stories){
			   return Object.keys(this.tripDetails.stories).length  
			  }
			}
		},
		totalPlannedCountries(){
			if(Object.keys(this.tripDetails).length){
			  if(this.tripDetails.stories){
			   return Object.keys(this.tripDetails.stories).length  
			  }
			}
		},
		hasEndDate(){
			if(this.tripDetails.enddate){
				return true
			}else{
				return false
			}
		},
		tripFuture(){
			if(this.daysToGo(this.tripDetails.startdate)>0){
			  return true
			}else{
			  return false
			}
		  },
		tripActive(){
		  if(this.hasEndDate){
			if(this.daysToGo(this.tripDetails.startdate)<1&&this.daysToGo(this.tripDetails.enddate)>0){
				return true
			}else{
				return false
			  }
		  }else if(this.daysToGo(this.tripDetails.startdate)<1&&!this.hasEndDate){
			return true
		  }else{
			return false
		  }
		 
		},
		tripFinished(){
		  if(this.daysToGo(this.tripDetails.enddate)<1){
			return true
		  }else{
			return false
		  }
		},
		daysTraveling(){
			if(this.tripActive){
				return -this.daysToGo(this.tripDetails.startdate)
			}else if(this.tripFinished){
				return (-this.daysToGo(this.tripDetails.startdate))-(-this.daysToGo(this.tripDetails.enddate))
			}
			
		},
		mySelectedCountriesComputed(){
			if(this.tripDetails.countries){
				this.mySelectedCountries=this.tripDetails.countries
				return this.mySelectedCountries
			}else{
				this.mySelectedCountries=''
				return this.mySelectedCountries
			}
		},
		getStoryCountryKeys(){
		  	let countriesStories={}
		  	if(this.tripDetails.stories){

				let stories=Object.keys(this.tripDetails.stories)
				stories.forEach(element => {
					let country=this.tripDetails.stories[element].country
					countriesStories[country]=false
				})
				return countriesStories
			}else{
				return false
			}

			
		},
		currentLocation(){
			navigator.geolocation.getCurrentPosition(position => {
				this.storyData.coordinates.lat=position.coords.latitude
				this.storyData.coordinates.lng=position.coords.longitude
				
				Geoapify.reverseGeocode(this.storyData.coordinates.lat, this.storyData.coordinates.lng).then(address => {
					this.storyData.country = address.country_code.toUpperCase()
					this.storyData.place = address.city
				})
			});
		},
	},
	
	methods: {
		...mapActions('markers', ['addMarker','firebaseGetAllMarkers']),
		...mapActions('other',['setItemAction','deleteItemAction','updateItemAction']),
		...mapActions('profile', ['saveEditStoryAction','saveExistingCountryListAction','deleteExistingCountryListAction']),
		tripIdRoute(){
			if(this.$route.params.tripId){
				this.tripId=this.$route.params.tripId
			}
		},
		tripIdMethod(id){
			if(!this.$route.params.tripId){
				this.tripId=id
			}
		},
		setUserId(userId){
			this.userId2=userId
		},
		
		saveStory(){
		  this.setItemAction({
			data:this.storyData,
			path:'Users/'+this.myUserId+'/trips/'+this.tripId+'/stories/'+this.timeStamp,
		  })
		  this.storyData.title=''
		  this.storyData.story=''
		  this.addStoryDialog=false
		},
		editStoryMethod(story, storyId){
		  this.editStoryData.story=story
		  this.editStoryData.storyId=storyId
		  this.editStoryDialog=true
		},
		saveEditStory(){
		  this.updateItemAction({
			data:this.editStoryData.story,
			path:'Users/'+this.myUserId+'/trips/'+this.tripId+'/stories/'+this.editStoryData.storyId,
		  })
		  
		  this.editStoryData={}
		  this.editStoryDialog=false
		},
		deletecountry(countryKey){
		  this.deleteItemAction({
			path:'Users/'+this.userId+'/trips/'+this.tripId+'/countries/'+countryKey
		  })
		  	if(!this.tripDetails.countries){
				this.mySelectedCountries={}
			}
		},

		saveTripAction(){
			this.updateItemAction({
				data:this.editTripDetails,
				path:'Users/'+this.userId+'/trips/'+this.tripId
		   	})
		   	this.editTripDialog=false
		},
		clickedcountryMethod(countryKey){
		if(this.tripDetails.countries){
			this.mySelectedCountries.push(countryKey)
		}else{
			this.mySelectedCountries={
				0:countryKey
			}
		}
		this.setItemAction({
			data:this.mySelectedCountries,
			path:'Users/'+this.userId+'/trips/'+this.tripId+'/countries'
		})
	
		},
		 
		
	},
	components: {

	},
	created(){
		this.currentLocation
		this.getCountries
		this.tripIdRoute()
		this.mySelectedCountriesComputed
	}
}
