import Vue from 'vue'
import { uid, Notify } from 'quasar'
import { firebase } from 'boot/config'
import {showErrorMessage} from 'src/functions/function-show-error-message'

const state = {
	gear:{},
	gearUser:{},
	pages:{},
	statistics:{}
	  
}

const mutations = {
	
	addPage(state, payload) {
		Vue.set(state.pages, payload.itemId, payload.itemDetails)
	},
	addStatistics(state, payload) {
		Vue.set(state.statistics, payload.itemId, payload.itemDetails)
	},
	addGear(state, payload) {
		Vue.set(state.gear, payload.itemId, payload.itemDetails)
	},
	updateGear(state, payload) {
		Object.assign(state.gear[payload.itemId], payload.itemDetails)
	},
	addGearUser(state, payload) {
		Vue.set(state.gearUser, payload.itemId, payload.itemDetails)
	},
	updateGearUser(state, payload) {
		Object.assign(state.gearUser[payload.itemId], payload.itemDetails)
	},
	
}

const actions = {
	setItemAction({},payload){
		firebase.db.ref(payload.path).set(payload.data)
	},
	updateItemAction({},payload){
		firebase.db.ref(payload.path).update(payload.data)
	},
	deleteItemAction({},payload){
		firebase.db.ref(payload.path).remove()
	},
	setItemActionFs({},payload){
		firebase.fs.collection(payload.collection).doc(payload.doc).set(payload.data).then(() => {
		}).catch((error) => {
		});
	},
	setItemActionFs2({},payload){
		firebase.fs.collection(payload.path).set(Object.assign({}, payload.data)).then(() => {
		}).catch((error) => {
		});
	},
	updateItemActionFs({},payload){
		firebase.fs.collection(payload.collection).doc(payload.doc).update(Object.assign({}, payload.data)).then(() => {
		}).catch((error) => {
		});
	},
	deleteItemActionFs({},payload){
		firebase.fs.collection(payload.collection).doc(payload.doc).delete().catch((error) => {
		});
	},
	getStatistics({commit}, ){
		firebase.db.ref('Statistics').on('child_added', snapshot => {
			let itemDetails = snapshot.val()
			let itemId = snapshot.key
			commit('addStatistics', {itemId,itemDetails})
		})
		firebase.db.ref('Statistics').on('child_changed', snapshot => {
			let itemDetails = snapshot.val()
			let itemId = snapshot.key
			commit('addStatistics', {itemId,itemDetails})
		})
		
	},

	getPages({commit}, ){
		firebase.db.ref('Pages').on('child_added', snapshot => {
			
			let itemDetails = snapshot.val()
			let itemId = snapshot.key

			commit('addPage', {
				itemId,
				itemDetails
			})
		})
		firebase.db.ref('Pages').on('child_changed', snapshot => {
			let itemDetails = snapshot.val()
			let itemId = snapshot.key
			commit('addPage', {
				itemId,
				itemDetails
			})
		})
	},
	getAllGear({commit}, ){
		firebase.db.ref('Gear').on('child_added', snapshot => {
			
			let itemDetails = snapshot.val()
			let itemId = snapshot.key
			commit('addGear', {
				itemId,
				itemDetails
			})
		})
		firebase.db.ref('Gear').on('child_changed', snapshot => {
			let itemDetails = snapshot.val()
			let itemId = snapshot.key
			commit('updateGear', {
				itemId,
				itemDetails
			})
		})
	},
	getAllGearUser({commit}, ){
		firebase.db.ref('GearUser').on('child_added', snapshot => {
			
			let itemDetails = snapshot.val()
			let itemId = snapshot.key
			commit('addGearUser', {
				itemId,
				itemDetails
			})
		})
		firebase.db.ref('GearUser').on('child_changed', snapshot => {
			let itemDetails = snapshot.val()
			let itemId = snapshot.key
			commit('updateGearUser', {
				itemId,
				itemDetails
			})
		})
		
	},
	addGearUser({},payload){
		firebase.db.ref('GearUser/'+payload.path).update(payload.payload)
	},
	selectGearUser({},payload){
		let userId = firebase.auth.currentUser.uid
		let newuid=uid()
		firebase.db.ref('GearUser/'+payload.pathGear+'/users/'+userId).set(true)
		firebase.db.ref('Users/'+userId+'/gear_list_new/'+payload.pathUser+'/'+newuid).set(payload.string)
	},
	deleteGearUser({commit,dispatch},payload){
		let userId = firebase.auth.currentUser.uid
		firebase.db.ref('Users/'+userId+'/gear_list_new/'+payload.path).remove()
		dispatch('auth/deleteUserDetailAction', userId+'/gear_list_new/'+payload.path, { root: true })

	},
		
	likeGearItem({},payload){
		let userId = firebase.auth.currentUser.uid
		let ref = firebase.db.ref('Gear/'+payload.sectionId+'/' + payload.itemId+'/likes/'+userId)
		
		if(payload.type==='liked'){
			ref.set(true)

		}else{
			ref.remove(error=>{
			if(error){
				showErrorMessage(error.message)
			}
		})
		}
	},

	
}

const getters = {
	getPages: (state) => {
		return state.pages
	},
	gearItemsSortedByLikes: (state) => {
		let gearItemsSortedByLikes = {},
				keysOrdered = Object.keys(state.gear)

		keysOrdered.sort((a,b) => {
			let AProp = (state.gear[a].likes ? Object.keys(state.countryData.Video[a].likes).length : 0 )
			let	BProp = (state.countryData.Video[b].likes ? Object.keys(state.countryData.Video[b].likes).length : 0 )

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			gearItemsSortedByLikes[key] = state.countryData.Video[key]
		})

		return gearItemsSortedByLikes
	},
	// gearUserItemsSortedByLikes: (state) => {
	// 	let gearItemsSortedByLikes = {},
	// 	keysOrdered = Object.keys(state.gear)

		

	// 	keysOrdered.sort((a,b) => {
	// 		let Amessages=Object.keys(state.gear[a])
	// 		let Bmessages=Object.keys(state.chatlist[b])

	// 		let AProp = Amessages[Object.entries(state.chatlist[a]).length-1]
	// 		let	BProp = Bmessages[Object.entries(state.chatlist[b]).length-1]
			


	// 		if (AProp < BProp) return 1
	// 		else if (AProp > BProp) return -1
	// 		else return 0
	// 	})

	// 	keysOrdered.forEach((key) => {
	// 		gearItemsSortedByLikes[key] = state.chatlist[key]
	// 	})
	// 	return gearItemsSortedByLikes
	// },
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}