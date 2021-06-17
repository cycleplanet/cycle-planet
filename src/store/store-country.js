import Vue from 'vue'
import { firebase } from 'boot/config'
import {showErrorMessage} from 'src/functions/function-show-error-message'

const state = {
	refsextra:{
					
		'About':{title:'About', type:'single' },
		'Corona':{title:'Corona', type:'single'},
		'QuickFacts':{title:'Quick Facts',type:'summarylist', summarylist:true, items:{
			'climate':{title:'Climate',  },
			'language':{title:'Language',  },
			'religion':{title:'Religion',  },
			'sim_card':{title:'Sim card provider',  },
			
		} },
		'People':{title:'People', type:'single'   },
		'Route':{title:'Routes',postlist:true,  type:'postlist'  },
		'Visa':{title:'Visa',  type:'single' },
		'Embassy':{title:'Where to obtain a visa of ', title_dialog:'Embassy',title_popup:'Visa',type:'tilelist',  tilelist:true,},
		'Border_item':{title:'Border crossings',title_dialog:'Border crossing',type:'tilelist', tilelist:true, },
		'SeeDo':{title:'See and Do', title_dialog:'See and do',type:'tilelist', tilelist:true, },
		'BikeShop':{title:'Bike shops',type:'tilelist', tilelist:true,  },
		'Sleeping':{title:'Sleeping',type:'summarylist', summarylist:true, items:{
			'body_cs_ws':{title:'Staying with locals',  },
			'body_formal_camping':{title:'(Formal) Camping',  },
			'body_hostels':{title:'Ho(s)tels',  },
			'body_wildcamping':{title:'Wildcamping',  },
		} },
		'Safety':{title:'Safety',type:'summarylist', summarylist:true, items:{
			'body':{title:'General',  },
			'body_traffic':{title:'Traffic',  },
			'body_criminality':{title:'Criminality',  },
			'body_corruption':{title:'Corruption',  },
			'body_nature':{title:'Nature and animals',  },
		} },
		'Transport':{title:'Transport',type:'summarylist', summarylist:true, items:{
			'body_airplane':{title:'Airplane',  },
			'body_train':{title:'Train',  },
			'body_bus':{title:'Bus',  },
			'body_boat':{title:'Boat',  },
		} },
		'FoodDrink':{title:'Food and Drink', type:'single'  },
		'Health':{title:'Vaccinations & health', type:'single'  },
		'Blog':{title:'Blogs',postlist:true,  type:'postlist'  },
		'Video':{title:'Video',postlist:true,  type:'postlist'  },
		'Other':{title:'Other',  type:'single'  },


		
	},
	refs:[
	],
	sort: 'title',
	countryData:{},
	borderItem:{},
	blogDataCountry:{},
	videoDataCountry:{},
	singleItemDataState:{},
	visaData:{},
}

const mutations = {
	setSort(state, value) {
		state.sort = value
	},

	addSingleItemDataOnce(state, payload) {
		Object.assign(state.singleItemDataState, payload)
	},
	addSingleItemData(state, payload) {
		Vue.set(state.singleItemDataState, payload.itemId, payload.itemDetails)
	},
	
	addCountryDataNew(state, payload) {
		Vue.set(state.countryData, payload.itemId, payload.itemDetails)
	},
	addBorderData(state, payload) {
		Vue.set(state.borderItem, payload.itemId, payload.itemDetails)
	},
	addBlogCountryData(state, payload) {
		Vue.set(state.blogDataCountry, payload.itemId,payload.itemDetails)

	},
	addVideoCountryData(state, payload) {
		Vue.set(state.videoDataCountry, payload.itemId,payload.itemDetails)

	},
	clearCountryData(state) {
		state.countryData={}
		state.singleItemDataState={}
		state.borderItem={}
	},
	
	addVisaData(state, payload){
		Vue.set(state.visaData, payload.itemId, payload.itemDetails)
	},

}

const actions = {
	firebaseGetCountryDataNew({ commit },countryKey){
		firebase.db.ref('Country_data/'+countryKey).on('child_added', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addCountryDataNew', {itemId,itemDetails})
		})
		firebase.db.ref('Country_data/'+countryKey).on('child_changed', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addCountryDataNew', {itemId,itemDetails})
		})
	},

	
	getVisaData({commit},countries){
	 	countries.forEach((itemId) => {
			firebase.db.ref('Country_data/'+itemId+'/Visa').once('value').then(( snapshot) => {
				let itemDetails = snapshot.val()
				commit('addVisaData', {itemId,itemDetails})
			})
		})
	},
	
	getVideoPosts({commit},countryId){
		firebase.db.ref('Video/'+countryId).on('child_added', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addVideoCountryData', {itemId,itemDetails})
		})
		firebase.db.ref('Video/'+countryId).on('child_changed', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addVideoCountryData', {itemId,itemDetails})
		})
		
	},
	getBlogPosts({commit},countryId){
		firebase.db.ref('Blog/'+countryId).on('child_added', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addBlogCountryData', {itemId,itemDetails})
		})
		firebase.db.ref('Blog/'+countryId).on('child_changed', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addBlogCountryData', {itemId,itemDetails})
		})
		
	},

	destroyData({ commit }) {
		commit('clearCountryData')
	},
	  
}

const getters = {
	countryData:(state)=>{
        return state.countryData
	},
	singleItemData:(state)=>{
        return state.singleItemData
	},
	blogPostsSortedCountry: (state) => {
		
		let blogPostsSortedCountry = {},
				keysOrdered = Object.keys(state.blogDataCountry)

		keysOrdered.sort((a,b) => {
			let AProp = (state.blogDataCountry[a].likes ? Object.keys(state.blogDataCountry[a].likes).length : 0 )
			let	BProp = (state.blogDataCountry[b].likes ? Object.keys(state.blogDataCountry[b].likes).length : 0 )

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			blogPostsSortedCountry[key] = state.blogDataCountry[key]
		})

		return blogPostsSortedCountry
	
	},
	blogPostsSortedByDateCountry: (state) => {
		let blogPostsSortedByDateCountry = {},
				keysOrdered = Object.keys(state.blogDataCountry)

		keysOrdered.sort((a,b) => {
			let AProp = state.blogDataCountry[a].date_created
			let	BProp = state.blogDataCountry[b].date_created

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			blogPostsSortedByDateCountry[key] = state.blogDataCountry[key]
		})

		return blogPostsSortedByDateCountry
	},
	videoPostsSortedCountry: (state) => {
		let videoPostsSortedCountry = {},
				keysOrdered = Object.keys(state.videoDataCountry)

		keysOrdered.sort((a,b) => {
			let AProp = (state.videoDataCountry[a].likes ? Object.keys(state.videoDataCountry[a].likes).length : 0 )
			let	BProp = (state.videoDataCountry[b].likes ? Object.keys(state.videoDataCountry[b].likes).length : 0 )

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			videoPostsSortedCountry[key] = state.videoDataCountry[key]
		})

		return videoPostsSortedCountry
	},
	videoPostsSortedByDateCountry: (state) => {
		let videoPostsSortedByDateCountry = {},
				keysOrdered = Object.keys(state.videoDataCountry)

		keysOrdered.sort((a,b) => {
			let AProp = state.videoDataCountry[a].date_created
			let	BProp = state.videoDataCountry[b].date_created

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			videoPostsSortedByDateCountry[key] = state.videoDataCountry[key]
		})

		return videoPostsSortedByDateCountry
	},

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}