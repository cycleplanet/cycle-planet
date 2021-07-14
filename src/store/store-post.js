import Vue from 'vue'
import { uid, Notify } from 'quasar'
import { firebase } from 'boot/config'
import {showErrorMessage} from 'src/functions/function-show-error-message'
import { LocalStorage } from 'quasar'

const state = {
	routeCollectionData:{},
	routeData:{},
	blogData:{},
	videoData:{},
	postData:{},
	searchRoute:''
}

const mutations = {
	
	// addBlogCountryData(state, payload) {
	// 	Vue.set(state.blogData, payload.itemId, payload.itemDetails)
	// 	Vue.set(state.blogData[payload.itemId], 'country', payload.countryId)
	// },
	// addVideoCountryData(state, payload) {
	// 	Vue.set(state.videoData, payload.itemId, payload.itemDetails)
	// 	Vue.set(state.videoData[payload.itemId], 'country', payload.countryId)
	// },
	addPostsData(state, payload){
		Vue.set(state.postData, payload.itemId, payload.itemDetails)
	},
	addRouteCollectionData(state, payload){
		Vue.set(state.routeCollectionData, payload.itemId, payload.itemDetails)
	},
	addRoutePostsData(state, payload){
		Vue.set(state.routeData, payload.itemId, payload.itemDetails)
	},
	addVideoPostsData(state, payload){
		Vue.set(state.videoData, payload.itemId, payload.itemDetails)
	},
	addBlogPostsData(state, payload){
		Vue.set(state.blogData, payload.itemId, payload.itemDetails)
	},
	deleteBlogPost(state, payload) {
		Vue.delete(state.blogData, payload.itemId)
	},
	deleteVideoPost(state, payload) {
		Vue.delete(state.videoData, payload.itemId)
	},
	deleteRoutePost(state, payload) {
		Vue.delete(state.routeData, payload.itemId)
	},
	clearPostData(state) {
		state.blogData={}
		state.videoData={}
	},
	setSearch(state, value) {
		state.searchRoute = value
	},
	
}

const actions = {

	getSinglePosts({commit},postKey){
		let itemDetails = {}
		firebase.db.ref('Posts/'+postKey).on('child_added', snapshot => {
			let itemId = postKey
			itemDetails[snapshot.key]=snapshot.val()
			commit('addPostsData', {itemId,itemDetails})
		})
		firebase.db.ref('Posts/').on('child_changed', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addPostsData', {itemId,itemDetails})
		})
	},
	setSearch({ commit }, value) {
		commit('setSearch', value)
	},
	getRouteCollections({commit}){
		firebase.db.ref('RouteCollection/').on('child_added', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addRouteCollectionData', {itemId,itemDetails})
		})
		firebase.db.ref('RouteCollection/').on('child_changed', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			commit('addRouteCollectionData', {itemId,itemDetails})
		})
	},
	getPosts({commit}){
		firebase.db.ref('Posts/').on('child_added', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			let ref = itemDetails.refKey
			if(ref=='Route'){
				commit('addRoutePostsData', {itemId,itemDetails})
			}else if(ref=='Video'){
				commit('addVideoPostsData', {itemId,itemDetails})
			}else if(ref=='Blog'){
				commit('addBlogPostsData', {itemId,itemDetails})
			}
		})
		firebase.db.ref('Posts/').on('child_changed', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			let ref = itemDetails.refKey
			if(ref=='Route'){
				commit('addRoutePostsData', {itemId,itemDetails})
			}else if(ref=='Video'){
				commit('addVideoPostsData', {itemId,itemDetails})
			}else if(ref=='Blog'){
				commit('addBlogPostsData', {itemId,itemDetails})
			}
		})
		firebase.db.ref('Posts/').on('child_removed', snapshot => {
			let itemId = snapshot.key
			let itemDetails = snapshot.val()
			let ref = itemDetails.refKey
			if(ref=='Route'){
				commit('deleteRoutePost', {itemId})
			}else if(ref=='Video'){
				commit('deleteVideoPost', {itemId})
			}else if(ref=='Blog'){
				commit('deleteBlogPost', {itemId})
			}
		})
        LocalStorage.set('loadedPosts', true)

	},

	likePost({},payload){
		let userId = firebase.auth.currentUser.uid
		let ref = firebase.db.ref(payload.refKey+'/' + payload.countryKey+'/'+payload.itemKey+'/likes/'+userId+'/')
		if(payload.type==='liked'){
			ref.set(true)
		}else if(payload.type==='disliked'){
			ref.remove(error=>{
				if(error){
					showErrorMessage(error.message)
				}else{
					Notify.create('Disliked post')
				}
			})
		}

	},
	
	commentPost({},payload){
		let newKey = uid()
		let ref = firebase.db.ref(payload.id+'/' + payload.countryKey+'/'+payload.listItem+'/comments/'+newKey+'/')
		ref.set(payload.data)
		Notify.create('Comment posted')
	},
	reportPost({},payload){
		let newKey = uid()
		let ref = firebase.db.ref('Reports/'+newKey+'/')
		ref.set(payload.data)
		Notify.create('Thanks! Item is reported and we will have a look at it!')
	},
	deletePost({},payload){
		let ref = firebase.db.ref(payload.id+'/'+payload.countryKey+'/'+payload.itemKey)
		ref.remove(error=>{
			if(error){
				showErrorMessage(error.message)
			}else{
				Notify.create('Removed post succesfully!')
			}
		})
	},
	destroyData({ commit }) {
		commit('clearPostData')
	},
	  
}

const getters = {
	blogPostsSorted: (state) => {
		
		let blogPostsSorted = {},
				keysOrdered = Object.keys(state.blogData)

		keysOrdered.sort((a,b) => {
			let AProp = (state.blogData[a].likes ? Object.keys(state.blogData[a].likes).length : 0 )
			let	BProp = (state.blogData[b].likes ? Object.keys(state.blogData[b].likes).length : 0 )

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			blogPostsSorted[key] = state.blogData[key]
		})

		return blogPostsSorted
	
	},
	blogPostsSortedByDate: (state) => {
		let blogPostsSortedByDate = {},
				keysOrdered = Object.keys(state.blogData)

		keysOrdered.sort((a,b) => {
			let AProp = state.blogData[a].date_created
			let	BProp = state.blogData[b].date_created

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			blogPostsSortedByDate[key] = state.blogData[key]
		})

		return blogPostsSortedByDate
	},
	videoPostsSorted: (state) => {
		let videoPostsSorted = {},
		keysOrdered = Object.keys(state.videoData)

		keysOrdered.sort((a,b) => {
			let AProp = (state.videoData[a].likes ? Object.keys(state.videoData[a].likes).length : 0 )
			let	BProp = (state.videoData[b].likes ? Object.keys(state.videoData[b].likes).length : 0 )

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			videoPostsSorted[key] = state.videoData[key]
		})

		return videoPostsSorted
	},
	videoPostsSortedByDate: (state) => {
		let videoPostsSortedByDate = {},
				keysOrdered = Object.keys(state.videoData)

		keysOrdered.sort((a,b) => {
			let AProp = state.videoData[a].date_created
			let	BProp = state.videoData[b].date_created

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			videoPostsSortedByDate[key] = state.videoData[key]
		})

		return videoPostsSortedByDate
	},
	routePostsSorted: (state) => {
		
		let routePostsSorted = {},
				keysOrdered = Object.keys(state.routeData)

		keysOrdered.sort((a,b) => {
			let AProp = (state.routeData[a].likes?Object.keys(state.routeData[a].likes).length:0)
			let	BProp = (state.routeData[b].likes?Object.keys(state.routeData[b].likes).length:0)

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			routePostsSorted[key] = state.routeData[key]
		})

		return routePostsSorted
	},
	routePostsFiltered: (state, getters) => {
		let arraySorted = getters.routePostsSorted,
			arrayFiltered = {}

		if (state.searchRoute) {
			Object.keys(arraySorted).forEach((key)=> {
				let route = arraySorted[key]
				let routeName=route.title.toLowerCase()
				let searchstring=state.searchRoute.toLowerCase()
				let valid = routeName.includes(searchstring)
				if (valid) {
					arrayFiltered[key] = route
				}
			})
			return arrayFiltered		
		}
		return getters.routePostsSorted
	},
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}