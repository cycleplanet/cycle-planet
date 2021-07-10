import Vue from 'vue'
import { firebase } from 'boot/config'
import { uid, Notify, date } from 'quasar'

let messagesRef

const state = {
  loggedIn: false,
  userDetails: {},
  users: {},
  chatlist: {},
  unreadchatlist: {},
  unreadchatlistNew:{},
  messages: {},
}

const mutations = {
  setLoggedIn(state, value) {
    state.loggedIn = value
  },
  setUserDetails(state, payload) {
    state.userDetails = payload
  },
  addUser(state, payload) {
    Vue.set(state.users, payload.userId, payload.userDetails)
  },
  addChatlist(state, payload) {
    Vue.set(state.chatlist, payload.userId, payload.messageDetails)
  },
  
  addUnreadChatlistNew(state, payload) {
		Vue.set(state.unreadchatlistNew, payload.userId,payload.undreadMessages)
  },
  removeUnreadChatlist(state,payload){
		Vue.delete(state.unreadchatlistNew, payload.otherUserId)
	},
  updateUser(state, payload) {
    Object.assign(state.users[payload.userId], payload.userDetails)
  },
  addMessage(state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails)
  },
  
  clearMessages(state) {
    state.messages = {}
  }
}

const actions = {
  firebaseGetUsers({ commit }) {

		if (firebase.auth.currentUser) {

			let myUserId = firebase.auth.currentUser.uid
			firebase.db.ref('Chats/'+myUserId).on('child_added', snapshot => {
				let messageDetails = snapshot.val()
				let userId = snapshot.key
				commit('addChatlist', {
					userId,
					messageDetails
				})
				
				let undreadMessages = {}
				
				firebase.db.ref('Chats/'+myUserId+'/'+snapshot.key).orderByChild('read').equalTo(false).on('child_added', childsnapshot => {

					let messageDetails = childsnapshot.val()
					let timestamp = childsnapshot.key
					undreadMessages[timestamp] = true
					
					commit('addUnreadChatlistNew', {
						userId,
						undreadMessages
					})
					
				})
				firebase.db.ref('Chats/'+myUserId+'/'+snapshot.key).orderByChild('read').equalTo(false).on('child_changed', childsnapshot => {
					let messageDetails = childsnapshot.val()
					let timestamp = childsnapshot.key
					if(messageDetails.read===false){
						commit('addUnreadChatlistNew', {
							userId,
							timestamp,
							
						})
					}
				})
				firebase.db.ref('Users/').on('child_added', childsnapshot => {
					if(snapshot.key===childsnapshot.key){
						let userDetails = childsnapshot.val()
						let userId = childsnapshot.key
						commit('addUser', {
							userId,
							userDetails
						})
					}
				})

			})
			firebase.db.ref('Chats/'+myUserId).on('child_changed', snapshot => {
				let messageDetails = snapshot.val()
				let userId = snapshot.key
				commit('addChatlist', {
					userId,
					messageDetails
				})
				
				let userDetails = snapshot.val()
				// let userId = snapshot.key
				commit('updateUser', {
					userId,
					userDetails
				})
			})
		}

	},
  firebaseGetMessages({commit},otherUserId){
		let myUserId = firebase.auth.currentUser.uid
		
		messagesRef = firebase.db.ref('Chats/' + myUserId + '/' + otherUserId)
		
		messagesRef.on('child_added',snapshot=>{
			
			let messageDetails = snapshot.val()
			let messageId=snapshot.key
			commit('addMessage',{
				messageId,
				messageDetails
			})
		})
		messagesRef.on('child_changed',snapshot=>{
			
			let messageDetails = snapshot.val()
			let messageId=snapshot.key
			commit('addMessage',{
				messageId,
				messageDetails
			})
		})
  },
  
  firebaseReadMessages({commit},otherUserId){
		let myUserId = firebase.auth.currentUser.uid
		
		messagesRef = firebase.db.ref('Chats/' + myUserId + '/' + otherUserId)
		messagesRef.on('child_added',snapshot=>{
			
			let messageDetails = snapshot.val()
			let messageId=snapshot.key

			if(messageDetails.read===false){
			firebase.db.ref('Chats/' + myUserId + '/' + otherUserId+ '/'+messageId).update({read:true})
			commit('removeUnreadChatlist', {
				otherUserId,
			})
			}
			
		})
	},

  firebaseStopGettingMessages({ commit }) {
    if (messagesRef) {
      messagesRef.off('child_added')
      commit('clearMessages')
    }
  },

  firebaseSendMessage({ }, payload) {
	let userId = firebase.auth.currentUser.uid
	let timeStampOriginal = Date.now()
	let timeStamp = date.formatDate(timeStampOriginal, 'YYYY-MM-DDTHH:mm:ss')
	payload.message.timestamp = timeStamp

    firebase.db.ref('Chats/' + userId + '/' + payload.otherUserId + '/' + timeStamp).set(payload.message)
    const axios = require('axios');
    // let apiUrl = "https://us-central1-cycle-planet-292f5.cloudfunctions.net/sendNotification?from=" + payload.message.from + "&text=" + payload.message.text + "&otheruserid=" + payload.otherUserId
    let apiUrl = "https://us-central1-cycle-planet-292f5.cloudfunctions.net/sendNotification?from=" + payload.senderName + "&text=" + payload.message.text + "&otheruserid=" + payload.otherUserId
    axios.get(apiUrl).then(result => {
    }).catch(err => {
	})

	payload.message.from = 'them'
	payload.message.read = false
	
    firebase.db.ref('Chats/' + payload.otherUserId + '/' + userId + '/' + timeStamp).set(payload.message).then(res => {
		console.log('Chat saved for other user')
	}).catch(err => {
		console.warn('Could not save chat for other user', err)
	})

  },
  firebaseSendHostRequest({dispatch }, payload) {
    let userId = firebase.auth.currentUser.uid;
	payload.message.sender=userId
    firebase.db.ref('Users/' + userId + '/hosting/requests/' + payload.message.timestamp).set(payload.message)
	payload.message.from = 'them'
	firebase.db.ref('Users/' + payload.otherUserId + '/hosting/requests/' + payload.message.timestamp).set(payload.message)
	payload.message.from = 'me'
	dispatch('firebaseSendMessage',payload)
  },
//   firebaseSendHostRequest({dispatch }, payload) {
//     let userId = firebaseAuth.currentUser.uid;
// 	payload.message.sender=userId
//     firebaseDb.ref('Host_requests/' + userId + '/' + payload.message.timestamp).set(payload.message)
// 	payload.message.from = 'them'
// 	firebaseDb.ref('Host_requests/' + payload.otherUserId + '/' + payload.message.timestamp).set(payload.message)
// 	payload.message.from = 'me'
// 	dispatch('firebaseSendMessage',payload)
//   },
  firebaseAcceptRequest({},payload){
  let userId = firebase.auth.currentUser.uid;
  let answer='accepted'
  firebase.db.ref('Users/' + userId + '/hosting/requests/'+ payload.timestamp).update({status:answer})
  firebase.db.ref('Users/' + payload.sender + '/hosting/requests/' + payload.timestamp).update({status:answer})
  firebase.db.ref('Chats/' + payload.sender + '/' + userId + '/' + payload.timestamp).update({status:answer})
  firebase.db.ref('Chats/' + userId + '/' + payload.sender + '/' + payload.timestamp).update({status:answer})
},
  firebaseRefuseRequest({},payload){
  let userId = firebase.auth.currentUser.uid;
  let answer='refused'
  firebase.db.ref('Users/' + userId + '/hosting/requests/' + payload.timestamp+ '/status/').update(answer)
  firebase.db.ref('Users/' + payload.sender + '/hosting/requests/' + payload.timestamp+ '/status/').update(answer)
  firebase.db.ref('Chats/' + payload.sender + '/' + userId + '/' + payload.timestamp+ '/status/').update(answer)
  firebase.db.ref('Chats/' + userId + '/' + payload.sender + '/' + payload.timestamp+ '/status/').update(answer)
},
}

const getters = {
unreadchatlistnew:(state)=>{
    return state.unreadchatlistNew
},


  userMessagesSortedByDate: (state) => {
    let userMessagesSortedByDate = {},
      keysOrdered = Object.keys(state.chatlist)

    keysOrdered.sort((a, b) => {
      let Amessages = Object.keys(state.chatlist[a])
      let Bmessages = Object.keys(state.chatlist[b])

      let AProp = Amessages[Object.entries(state.chatlist[a]).length - 1]
      let BProp = Bmessages[Object.entries(state.chatlist[b]).length - 1]

      if (AProp < BProp) return 1
      else if (AProp > BProp) return -1
      else return 0
    })

    keysOrdered.forEach((key) => {
      userMessagesSortedByDate[key] = state.chatlist[key]
    })
    return userMessagesSortedByDate
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
