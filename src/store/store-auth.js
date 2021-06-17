import Vue from 'vue'
import { LocalStorage, Loading } from 'quasar'
import { firebase } from 'boot/config'
import { showErrorMessage } from 'src/functions/function-show-error-message'
import { uid, Notify, date } from 'quasar'
import FCM from 'cordova-plugin-fcm-with-dependecy-updated';

let messagesRef

const state = {
  handleAuthStateChangeFinished: false,
  loggedIn: false,
  myUserIdState: '',
  users: {},
  usersWithMapLocation:{},
	followData:{},
  messages: {},
  otherUserFollow: {},
  loggedInUserFollow: {},
  backgroundimageurl: [
    'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2Fbicycle-1839005_1280.jpg?alt=media&token=0f4a804b-0d9f-4443-bde1-bffc3e5d7bd0',
    'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2Fcamp-2650359_1280.jpg?alt=media&token=a0f4da1f-65ed-4572-8806-2b0e8941721a',
    'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2Flandscape-1858602_1280.jpg?alt=media&token=9216cb11-7a57-4d47-8111-4d135cdb0a69',
    'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2Flandscape-5362157_1280.jpg?alt=media&token=e5d57ebb-654f-44f7-9e3a-27ffa646a8b7',
    'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2Fmountain-range-1246273_1280.jpg?alt=media&token=1fe4e095-fe2d-4cdd-8311-96f7ac0228cb',
    'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2Fwheat-865152_1280.jpg?alt=media&token=a992edeb-8e73-4f9c-8cbd-1be4ec6fdbe9',
    'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2FIMG_9983-01.jpeg?alt=media&token=37e62cc0-2589-466a-8d49-2a61f25ce2c3',
  ]
}

const mutations = {
  setHandleAuthStateChangeFinished(state, value) {
		state.handleAuthStateChangeFinished = value
	},
	setLoggedIn(state, value) {
		state.loggedIn = value
	},
	myUserId(state, payload) {
		state.myUserIdState = payload.userId
	},
  delelteMyUserId(state, payload) {
		state.myUserIdState =''
	},
  
	addUser(state, payload) {
		Vue.set(state.users, payload.userId, payload.userDetails)
	},
	addUserWithMapLocation(state, payload) {
		Vue.set(state.usersWithMapLocation, payload.userId,payload.userDetails)
	},
	updateUser(state, payload) {
		Object.assign(state.users[payload.userId], payload.userDetails)
	},

	addFollowData(state, payload) {
		Vue.set(state.followData, payload.userId, payload.userDetails)
	},
	addLoggedInUserFollowData(state, payload) {
		Vue.set(state.loggedInUserFollow, payload.itemId, payload.itemDetails)
	},

	clearMessages(state) {
		state.messages = {}
	},
	logout(state){
		state.myUserIdState=''
	},

	setShowLocation(state, value) {
		state.settings.showLocation = value
	},
  setSendNotifications(state, value) {
		state.settings.sendNotifications = value
	},
	setSettings(state, settings) {
		Object.assign(state.settings, settings)
	},
  deleteUserDetail(state, path) {
		Vue.delete(state.users, path)
	},
}

const actions = {
  loadBaseData({dispatch}){
		dispatch('firebaseGetUsers')
    dispatch('countries/firebasegetCountries', null, { root: true })
    dispatch('markers/getAllLandMarkersFs', null, { root: true })
    // dispatch('post/getPosts', null, { root: true })
		firebase.db.ref('PostsVideo').remove()

    LocalStorage.set('loadedBaseData', true)
  },
  loadSecondaryData({dispatch}){
    dispatch('chat/firebaseGetUsers', null, { root: true })
    dispatch('admin/getAdminData', null, { root: true })
    dispatch('other/getPages', null, { root: true })
    LocalStorage.set('loadedBaseData', false)
  },

  handleAuthStateChange({ commit, dispatch }) {
    firebase.auth.onAuthStateChanged(user => {
      Loading.hide()
      if (user && user.emailVerified === true) {
        // User is logged in.
        commit('setLoggedIn', true)
        LocalStorage.set('loggedIn', true)

        let userId = firebase.auth.currentUser.uid
        firebase.db.ref('Users/' + userId).once('value', snapshot => {
          let userDetails = snapshot.val()
          commit('myUserId', {
            userId: userId
          })
        })
        let timeStamp = Date.now()
        let formattedString = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss')
       
    		firebase.db.ref('Users/'+userId).update({
          online: true,
          online_date: formattedString,
        })

        dispatch('chat/firebaseGetUsers', null, { root: true })
      }
      else {
        
        commit('delelteMyUserId', )
        commit('setLoggedIn', false)
        LocalStorage.set('loggedIn', false)

      }
    })
    commit('setHandleAuthStateChangeFinished', true)

  },

  registerUser({dispatch, state }, payload) {
    this.error = null;

    firebase.auth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(() => {
        const user = firebase.auth.currentUser;
        if (user && user.emailVerified === false) {

          var actionCodeSettings = { url: 'https://cycleplanet.org/auth' }
          user.sendEmailVerification().then(function () {
          })

          let userId = firebase.auth.currentUser.uid
          const idx = Math.floor(Math.random() * Object.keys(state.backgroundimageurl).length);
          firebase.db.ref('Users/' + userId).set({
            userId: userId,
            fullname: payload.name,
            public_profile: false,
            email: payload.email,
            backgroundimageurl: state.backgroundimageurl[idx],
            imageurl: 'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2Fplaceholder_profile.jpg?alt=media&token=898d4a24-3791-4baf-8b93-4aaadbd4a94a',
            hosting:{
              bike_inside:false,
              max_guests:0,
              pets_allowed:false,
              status:'Available for hosting'
            },
            settings:{
              showLocation:true,
              publicProfile:false,
              sendNotifications:true,
            },
            role: 'user'
          })

          firebase.auth.signOut()
        }
      })
      .catch(error => {
        Notify.create({
          type: 'negative',
          color: 'negative',
          timeout: 5000,
          message: error.message

        })

        // this.error = error.message;
      })

  },

  resetPassword({dispatch }, payload) {

    firebase.auth.sendPasswordResetEmail(payload).then(function () {
      // Email sent.
      Notify.create({
        type: 'positive',
        color: 'positive',
        timeout: 5000,
        message: 'Check your email, click the link to reset your password.'

      })
    }).catch(function (error) {
      // An error happened.
      Notify.create({
        type: 'negative',
        color: 'negative',
        timeout: 2000,
        message: 'Something went wrong, please contact us to solve the problem.'

      })
    })

  },

  loginUser({ dispatch}, payload) {
    Loading.show()
    firebase.auth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        const user = firebase.auth.currentUser;
        let userId = firebase.auth.currentUser.uid

        if (user && user.emailVerified === false) {

          var actionCodeSettings = { url: 'https://cycleplanet.org/auth' }
          user.sendEmailVerification(actionCodeSettings).then(function () {
          })

          Notify.create({
            type: 'negative',
            color: 'negative',
            timeout: 4000,
            message: 'Please verify your email before you continue'
          })
          firebase.auth.signOut()
        } else if (user && user.emailVerified === true) {
        this.$router.push('/map')

          Notify.create({
            type: 'positive',
            color: 'positive',
            timeout: 4000,
            message: 'Logged in succesfully'

          })
        }

      })
      .catch(error => {
        showErrorMessage(error.message)
      })
  },

  async logoutUser({ commit, dispatch }) {
    
    commit('logout')
    commit('setLoggedIn', false)
    firebase.db.ref('Users/' + firebase.auth.currentUser.uid).once('value', async snapshot => {
      let userDetails = snapshot.val()
      const fcmToken = await FCM.getToken()
      let tokenArray = [];
      if (userDetails.token) {
        tokenArray = userDetails.token;
        let tokenexists = tokenArray.includes(fcmToken);
        if (tokenexists) {
          tokenArray = tokenArray.filter((item) => item != fcmToken);

          firebase.db.ref('Users/'+userId).update({
            online: false,
            token: tokenArray,
          })
          
        }
      } else {
        firebase.db.ref('Users/'+userId).update({
          online: false,
        })
      }
    })
    firebase.db.signOut()

  },


  firebaseUpdateToken({ }, payload) {
    let userId = firebase.auth.currentUser.uid
    firebase.db.ref('Users/' + userId).once('value', snapshot => {
      let userDetails = snapshot.val()
      let tokenArray = [];
      if (userDetails.token) {
        tokenArray = userDetails.token;
        let tokenexists = tokenArray.includes(payload.updates.token);
        if (!tokenexists) {
          tokenArray.push(payload.updates.token);
        }
      } else {
        tokenArray.push(payload.updates.token);

      }
      let token = {
        token: tokenArray
      };

      firebase.db.ref('Users/' + userId).update(token).then((data) => {
      }).catch((err) => {
      })
    });


  },
  firebaseGetUsers({ commit }) {
		firebase.db.ref('Users/').on('child_added', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('addUser', {userId,userDetails})
      if (userDetails.coordinates) {
        commit('addUserWithMapLocation', {userId,userDetails})
      }
		})

    firebase.db.ref('Users/').on('child_changed', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('addUser', {userId,userDetails})
     
		})
	},

  deleteUserDetailAction({commit},path){
    commit('deleteUserDetail', {
      path
    })
  },

  firebaseGetFollowers({ commit }) {

		firebase.db.ref('Follow').on('child_added', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('addFollowData', {
				userId,
				userDetails
			})
		})
		firebase.db.ref('Follow').on('child_changed', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('addFollowData', {
				userId,
				userDetails
			})
		})
  },

  clearFollowers({commit}){
		commit('clearFollowData')
	},

  getLoggedInUsersFollowers({ commit }, userId) {
    firebase.db.ref('Follow/' + userId).on('child_added', snapshot => {
      let itemId = snapshot.key
      let itemDetails = snapshot.val()
      commit('addLoggedInUserFollowData', {
        itemId,
        itemDetails,
      })
    })
    firebase.db.ref('Follow/' + userId).on('child_changed', snapshot => {
      let itemId = snapshot.key
      let itemDetails = snapshot.val()
      commit('addLoggedInUserFollowData', {
        itemId,
        itemDetails,
      })
    })
  },

  setFollow({ }, payload) {
    let userId = firebase.auth.currentUser.uid
    let ref = firebase.db.ref('Follow/' + payload + '/followers/' + userId + '/')
    ref.set(true)
    let ref2 = firebase.db.ref('Follow/' + userId + '/following/' + payload + '/')
    ref2.set(true)
  },

  setUnfollow({ }, payload) {
    let userId = firebase.auth.currentUser.uid
    let ref = firebase.db.ref('Follow/' + payload + '/followers/' + userId + '/')
    ref.remove()

    let ref2 = firebase.db.ref('Follow/' + userId + '/following/' + payload + '/')
    ref2.remove()
  },

  updateEmail({ }, payload) {
    var user = firebase.auth.currentUser;
    let userId = firebase.auth.currentUser.uid

    user.updateEmail(payload.newEmail).then(function () {
      // Update successful.

      var actionCodeSettings = { url: 'https://cycleplanet.org/auth' }
      user.sendEmailVerification(actionCodeSettings).then(function () {
      })

      firebase.db.ref('Users/' + userId).update({ email: payload.newEmail })
      Notify.create({
        type: 'positive',
        color: 'positive',
        timeout: 7000,
        message: 'Your email address is updated! A verification email has been send. You will now be logged out.'
      })
      firebase.auth.signOut()
      // this.router.push('/auth')
    }).catch(function (error) {
      Notify.create({
        type: 'negative',
        color: 'negative',
        timeout: 5000,
        message: error.message
      })
    })
  },
}

const getters = {

	users: state => {
		return state.users
	},

	usersWithMapLocation:(state)=>{
        return state.usersWithMapLocation
	},

  usersSortedByLastLogin: (state) => {
		let usersSortedByLastLogin = {},
				keysOrdered = Object.keys(state.users)

		keysOrdered.sort((a,b) => {
			let AProp = (state.users[a].online_date)
			let	BProp = (state.users[b].online_date)

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			usersSortedByLastLogin[key] = state.users[key]
		})

		return usersSortedByLastLogin
	},

  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
