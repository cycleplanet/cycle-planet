import Vue from 'vue'
import { uid, Notify, date } from 'quasar'
import { firebase } from 'boot/config'

const state = {

	mapsettings:{
		iconSize: 50,
		zoom: 3,
		minZoom:2,
		bounds:[
			[-100, -200],
			[100, 200]
		  ],
		center: L.latLng(40, 5),
		url1:'https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=36d058c13ff745068be0b7a35a6992a1',
		url:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
	},
	fbRefs:[
		'Users',
		'Wildcamping','FormalCamping','Campsites','Hostels',
		'SeeDo','Embassy','Border_item','BikeShop',
		'Shop','Water','ATM','Warning','OtherMarker'
	],
	fbUserRefs:[
	],

	f
	markerlist:{
		'Touring':{title:'Touring',fbref:'Touring',hideInList:true,iconcolor:'black', markercolor:'bg-secondary', markertint:'bg-secondary-2',active:true, iconurl:"markers/Touring.png"},
		'Available for hosting':{title:'Hosting',hideInList:true,fbref:'Available for hosting',iconcolor:'black', markercolor:'bg-red',active:true, markertint:'bg-red-2', iconurl:"markers/Hosting.png"},
		'Not available for hosting':{title:'Not hosting',hideInList:true,fbref:'Not available for hosting',iconcolor:'black', markercolor:'bg-grey',active:true, markertint:'bg-grey-2', iconurl:"markers/NotHosting.png"},
	
				
		'Wildcamping':{title:'Wild camping',fbref:'Wildcamping',icon:'fas fa-campground', iconcolor:'black', markercolor:'bg-lime', markertint:'bg-lime-2',active:true, iconurl:"markers/Wildcamping.png", checkdescription:"Is it not on private property? Are there any dangers?"},
		'FormalCamping':{title:'Formal camping',fbref:'FormalCamping',icon:'fas fa-campground', iconcolor:'black', markercolor:'bg-light-green', markertint:'bg-light-green-2',active:true, iconurl:"markers/FormalCamping.png", checkdescription:"How to make formal camping at this place happen? Who should be approached? Any other things to take into account?"},
		'Campsites':{title:'Campsite',fbref:'Campsites',icon:'fas fa-campground', iconcolor:'black', markercolor:'bg-green', markertint:'bg-green-2',active:true, iconurl:"markers/Campsites.png", checkdescription:"Does it describe well enough how to reach this place, how expensive it is, and how the facilities are?"},
		'Hostels':{title:'Ho(s)tel',fbref:'Hostels',icon:'fas fa-h-square', iconcolor:'black', markercolor:'bg-teal', markertint:'bg-teal-2',active:true, iconurl:"markers/Hostels.png", checkdescription:"What is the price? Is there a website or phonenumber? How are the facilities?"},
	
	
		'BikeShop':{title:'Bike Shop',fbref:'BikeShop',icon:'fas fa-wrench', iconcolor:'black', markercolor:'bg-cyan', markertint:'bg-cyan-2',active:true, iconurl:"markers/BikeShop.png", checkdescription:"What can someone expect from this place? Do they have many spare parts? Is there a website or phonenumber?"},
		'SeeDo':{title:'See and do',fbref:'SeeDo',icon:'fas fa-camera', iconcolor:'black', markercolor:'bg-light-blue', markertint:'bg-light-blue-2',active:true, iconurl:"markers/SeeDo.png", checkdescription:"What is there to see or do? Does this activity costs any money? Any other things to take into account?"},
		'Embassy':{title:'Visa ',fbref:'Embassy',icon:'fas fa-address-card', iconcolor:'black', markercolor:'bg-blue', markertint:'bg-blue-2',active:true, iconurl:"markers/Embassy.png", checkdescription:"How's the procedure of getting this visa? Which documents are needed? Opening times?"},
		'Border_item':{title:'Border',fbref:'Border_item',icon:'fas fa-archway', iconcolor:'black', markercolor:'bg-indigo', markertint:'bg-indigo-2',active:true, iconurl:"markers/Border.png", checkdescription:"The procedure of passing this border crossing?"},
	
	
		'Shop':{title:'Shop',fbref:'Shop',icon:'fas fa-shopping-cart', iconcolor:'black', markercolor:'bg-blue-grey', markertint:'bg-blue-grey-2',active:true, iconurl:"markers/Shop.png", checkdescription:""},
		'Ferry':{title:'Ferry',fbref:'Ferry',icon:'directions_boat', iconcolor:'black', markercolor:'bg-blue-grey', markertint:'bg-blue-grey-2',active:true, iconurl:"markers/Ferry.png", checkdescription:""},
		'Water':{title:'Water',fbref:'Water',icon:'fas fa-tint', iconcolor:'black', markercolor:'bg-blue-grey', markertint:'bg-blue-grey-2',active:true, iconurl:"markers/Water.png", checkdescription:""},
		'ATM':{title:'ATM',fbref:'ATM',icon:'fas fa-piggy-bank', iconcolor:'black', markercolor:'bg-blue-grey', markertint:'bg-blue-grey-2',active:true, iconurl:"markers/ATM.png", checkdescription:""},
		'Warning':{title:'Warning',fbref:'Warning',icon:'fas fa-exclamation-triangle', iconcolor:'black', markercolor:'bg-blue-grey',active:true, markertint:'bg-blue-grey-2', iconurl:"markers/Warning.png", checkdescription:""},
		'OtherMarker':{title:'Other',fbref:'OtherMarker',icon:'fas fa-question', iconcolor:'black', markercolor:'bg-blue-grey', markertint:'bg-blue-grey-2',active:true, iconurl:"markers/Other.png", checkdescription:""},
	},
	usermarkeroptions:{
		'pets':{title:'Allows pets',active:false, icon:"pets"},
	},
	// userMarkers:{
	// 	'Touring':{},
	// 	'Available for hosting':{},
	// 	'Not available for hosting':{}
	// },
	// countryData2:{
	// 	'Embassy':{},
	// 	'SeeDo':{},
	// 	'BikeShop':{},
	// 	'Border_item':{},
	// },
	landMarkers:{},
	landMarkersNewState:{},
	borderData:{},
	embassyData:{},
	seeDoData:{},
	userMarkerData:{},
	checkMarkerData:{},
	markerCounts:{}

}

const mutations = {
   
	
	addLandMarkersOnce(state, payload) {
		Object.assign(state.landMarkers, payload)
	},
	addLandMarkersOnceNew(state, payload) {
		Object.assign(state.landMarkers, payload)
	},
	addMarkerCounts(state, payload) {
		Vue.set(state.markerCounts, payload.countryCode, payload.countryCounts)
	},
	addLandMarkers(state, payload) {
		Vue.set(state.landMarkers, payload.itemId, payload.itemDetails)
	},
	deleteLandMarker(state, itemId) {
		Vue.delete(state.landMarkers, itemId)
	},
	addBorderData(state, payload){
		Vue.set(state.borderData, payload.itemId, payload.itemDetails)
	},
	addEmbassyData(state, payload){
		Vue.set(state.embassyData, payload.itemId, payload.itemDetails)
	},

	addSeeDoData(state, payload){
		Vue.set(state.seeDoData, payload.itemId, payload.itemDetails)
	},
	addUserMarker(state, payload){
		Vue.set(state.userMarkerData, payload.itemId, payload.itemDetails)
	},
	addCheckMarker(state, payload){
		Vue.set(state.checkMarkerData, payload.itemId, payload.itemDetails)
	},
	// deleteCountryMarkerData(state){
	// 	state.countryData2.Embassy={}
	// 	state.countryData2.SeeDo={}
	// 	state.countryData2.BikeShop={}
	// 	state.countryData2.Border_item={}
	// },
  
}

const actions = {
	
	updateMarkerAction({},payload){
		firebase.fs.collection('Markers').doc(payload.doc).update(Object.assign({}, payload.data)).then(() => {
		}).catch((error) => {
			console.error("Error writing document: ", error);
		});
	},

	// getAllLandMarkersNew({commit}){
	// 	const axios = require('axios');
	// 	axios.get(`${ process.env.API }/markers`).then(response=>{
	// 		commit('addLandMarkersOnceNew', response.data)
	// 	  }).catch(err=>{
	// 	})
	// },

	getMarkerCounts({commit}){
		firebase.db.ref('CountryMarkerCounts/').on('child_added', snapshot => {
			let countryCounts = snapshot.val()
			let countryCode = snapshot.key
			commit('addMarkerCounts', {countryCode,countryCounts})
		})
	},

	getAllLandMarkersFs({commit}){
		const countryMarkerCounts = {};

		function countMarker(countryKey) {
			if (!countryKey) return;

			console.log('Adding a POI count for ' + countryKey)
			const cc = state.countryCodes_rev[countryKey];

			if (!cc) return;

			countryMarkerCounts[cc].poi++;
		}

		Object.values(state.countryCodes_rev).forEach(cc => {
			countryMarkerCounts[cc] = {
				poi: 0
			}
		});

		firebase.fs.collection("Markers").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				let itemId=doc.id
				let itemDetails=doc.data()

				if(itemDetails.refKey==='Border_item'){
					countMarker(itemDetails.country1.country);
					countMarker(itemDetails.country2.country);
				} else {
					countMarker(itemDetails.countryKey);
				}				
				// commit('addCountryMarkerCounts', {itemId,itemDetails})
			});
		}).then(_ => {
			const countryCodes = Object.keys(countryMarkerCounts)
			countryCodes.forEach(cc => {
				console.log('writing count for country ' + cc);
				firebase.db.ref(`CountryMarkerCounts/${cc}/poi`).set(countryMarkerCounts[cc].poi).catch((err) => console.error('Could not write POI count for country', err));
				
			});
		});

		firebase.fs.collection("Markers").onSnapshot(function(snapshot) {
			snapshot.docChanges().forEach(function(change) {
				if (change.type === "added") {
					let itemId=change.doc.id
					let itemDetails=change.doc.data()
					commit('addLandMarkers', {itemId,itemDetails})
				}
				if (change.type === "modified") {
					let itemId=change.doc.id
					let itemDetails=change.doc.data()
					commit('addLandMarkers', {itemId,itemDetails})
				}
				if (change.type === "removed") {
					let itemId=change.doc.id
					commit('deleteLandMarker', itemId)
				}
			});
		});
		
	},
	getMainMarkersData({commit}){
		console.log('getMainMarkersData 1');
		let allLandMarkers = Object.keys(state.landMarkers)
		allLandMarkers.forEach(element => {
			let itemId = element
			let itemDetails = state.landMarkers[element]
			console.log('getMainMarkersData 2',itemId);

			// if(itemDetails.likes){
			// 	console.log('getMainMarkersData 3',itemDetails.likes);
			// 	let userLikes = Object.keys(itemDetails.likes)
			// 	userLikes.forEach(element => {
			// 		let userId = element
			// 		firebase.db.ref('Users/'+userId+'/points/markers_liked').update({
			// 			[itemId]:itemDetails.date_created
			// 		})
			// 	})
			// }
			
			if(itemDetails.refKey==='Border_item'){
				commit('addBorderData', {itemId,itemDetails})
			}else if(itemDetails.refKey==='Embassy'){
				commit('addEmbassyData', {itemId,itemDetails})
			}else if(itemDetails.refKey==='SeeDo'){
				commit('addSeeDoData', {itemId,itemDetails})
			}
		})
	},
	getUserMarkerData({commit}, userId){
		let allLandMarkers = Object.keys(state.landMarkers)
		allLandMarkers.forEach(element => {
			let itemId = element
			let itemDetails = state.landMarkers[element]
			
			if(itemDetails.user_created===userId){
				commit('addUserMarker', {itemId,itemDetails})
			}
		})
	},
	getCheckMarkerData({commit},){
		let userId = firebase.auth.currentUser.uid
		let allLandMarkers = Object.keys(state.landMarkers)
		allLandMarkers.forEach(element => {
			let itemId = element
			let itemDetails = state.landMarkers[element]
			
			if(!itemDetails.status){
				commit('addCheckMarker', {itemId,itemDetails})
			}
		})
	},
	backupFirestoreMarkers(){
		let allLandMarkers = Object.keys(state.landMarkers)
		allLandMarkers.forEach(element => {
			let itemId = element
			let itemDetails = state.landMarkers[element]
			firebase.db.ref('MarkersBackup/'+itemId).set(itemDetails)
		})
	},
	destroyMapData({ commit }) {
	// 	// commit('deleteCountryMarkerData')
	},

}

const getters = {
	
	landMarkersSorted: (state) => {
		let landMarkersSorted = {},
				keysOrdered = Object.keys(state.landMarkers)

		keysOrdered.sort((a,b) => {
			let AProp = (state.landMarkers[a].date_created)
			let	BProp = (state.landMarkers[b].date_created)

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			landMarkersSorted[key] = state.landMarkers[key]
		})

		return landMarkersSorted
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}