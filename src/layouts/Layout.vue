<template>
  <q-layout view="hHh LpR fFf">
    <q-header  elevated v-if="$route.fullPath!=='/'">
      <q-toolbar class=" text-black constrain flex items-center">
        <div >
            <q-img @click="$router.push('/map')"  src="logo/logo_small.png" style="width:40px"></q-img>
        </div>

        <p class="text-h6 q-ml-md q-mb-none"> Cycle Planet</p>
        <q-space ></q-space>

          <q-tabs  v-model="tab" shrink v-if="screenwidthbig">
            <q-btn flat name="Map" label="Map" to="/map"/>
            <q-btn v-if="teamMember" flat name="Admin" label="Admin panel" to="/admin"/>
            <q-btn flat name="Trips" label="Trips" to="/trips" />
            <q-btn flat name="Chat" label="Chat" :to="Object.keys(this.userMessagesSortedByDate).length?'/chat/'+Object.keys(this.userMessagesSortedByDate)[0]:'/chat'" v-if="loggedIn">
              <q-badge v-if="Object.keys(unreadchatlistnew).length" color="red">{{Object.keys(unreadchatlistnew).length}}</q-badge>
            </q-btn>
             <q-btn-dropdown  stretch flat label="More">
               <q-list>
                 <div v-for="(item, index) in sections" :key="index">
                 <q-item clickable v-close-popup :to="item.to" v-if="item.apple?!isApple:true">
                   <q-item-section avatar >
                    <q-avatar :icon="item.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{item.title}}</q-item-label>
                  </q-item-section>
                 </q-item>
                 </div>
               </q-list>
             </q-btn-dropdown>

          </q-tabs>

          <q-btn v-if="!loggedIn" dense flat to="/auth" label="Login" icon-right="account_circle"/>

          <q-btn class="q-mx-md" v-if="loggedIn" dense flat round  >
            <q-avatar v-if="myUserDetails">
              <img :src="myUserDetails.imageurl">
            </q-avatar>
            <q-badge v-if="Object.keys(notifyRequest).length" color="red" floating rounded class="text-red">.</q-badge>

            <q-menu>
                  <q-list separator>
                    <q-item clickable v-close-popup :to="'/user/'+myUserId">
                      <q-item-section>View profile</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="myRequestsDialog=true">
                      <q-item-section>My host requests {{Object.keys(notifyRequest).length?'('+Object.keys(notifyRequest).length+')':''}}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="myMarkersDialog=true">
                      <q-item-section>My markers</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="checkMarkersDialog=true">
                      <q-item-section>Check markers</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="myTripsDialog=true">
                      <q-item-section>My trips (beta)</q-item-section>
                    </q-item>
                    <q-item  v-close-popup>
                      <q-item-section>
                        <q-btn dense :style="buttonStyle" label="Log out" @click="logoutUserMethod" to="/auth"/>
                      </q-item-section>
                    </q-item>
                  </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense flat round icon="menu" @click="rightDrawerOpen= !rightDrawerOpen" />
      </q-toolbar>
      <q-banner inline-actions dense rounded class="bg-secondary text-center cursor-pointer q-pa-xs" v-if="$route.fullPath==='/map'">
      <div class="no-padding" :style="isWebApp?'':'font-size:11px'" label="Learn more about Cycle Planet" @click="$router.push('/')" >Learn more about Cycle Planet</div>
      </q-banner>
    </q-header>

    <q-page-sticky v-if="isWebApp" position="right" :offset="[0, 0]" style="z-index:99999" class="justify-end">
      <q-btn @click="feedbackDialog=true" color="primary" label="feedback" class="rotate-270 text-black" style="margin-right:-40px"/>
    </q-page-sticky>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered content-class="bg-grey-2" :width="200">
      <drawer-right/>
    </q-drawer>


    <q-page-container :class="($route.fullPath==='/'||$route.fullPath==='/map')?'':'constrain'" class="bg-white">
       <router-view />
    </q-page-container>

    <Footer />

    <q-dialog :maximized="true" v-model="myMarkersDialog" v-if="myUserDetails">
      <markerlist-dialog :markersArray="myUserDetails.points.markers_added?Object.values(myUserDetails.points.markers_added):0" :title="'Added markers'"/>
    </q-dialog>

    <q-dialog v-model="checkMarkersDialog" >
      <check-markers style="min-width:50%;max-width:500px"/>
    </q-dialog>

    <q-dialog v-model="feedbackDialog">
      <feedback-dialog @close="feedbackDialog=false"/>
    </q-dialog>

    <q-dialog v-model="myRequestsDialog">
      <my-requests />
    </q-dialog>

    <q-dialog v-model="myTripsDialog">
      <trips-dialog />
    </q-dialog>


  </q-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import mixinHosting from 'src/mixins/mixin-hosting.js'

import meta from 'src/utils/meta.js'

export default {
  mixins: [mixinGeneral, mixinHosting],

  data () {
    return {
      rightDrawerOpen: false,
      myMarkersDialog:false,
      checkMarkersDialog:false,
      feedbackDialog:false,
      tab:'',
      myRequestsDialog:false,
      myTripsDialog:false,
      sections : {
        // {title: 'Donate', icon: 'fas fa-hand-holding-heart', to:'/donate',apple:true},
        "collections": {title: 'Collections', icon: 'collections', to:'/collections'},
        "resources":{title: 'Resources', icon: 'fas fa-rocket', to:'/resources'},
        "gear":{title: 'Gear', icon: 'fas fa-bicycle', to:'/gear'},
      },
    }
  },
  components: {
    'Footer' : require('layouts/Footer.vue').default,
		'feedback-dialog' : require('components/Shared/FeedbackDialog.vue').default,
    'drawer-right': require('src/layouts/DrawerRight.vue').default,
		// 'my-markers' : require('components/Marker/MyMarkers.vue').default,
		'check-markers' : require('components/Marker/CheckMarkers.vue').default,
    'map-all': require('components/Map/Map.vue').default,
    'markerlist-dialog' : require('components/Marker/MarkerListDialog.vue').default,
    'my-requests': require('src/components/Profile/MyRequests.vue').default,
    'trips-dialog': require('components/Profile/myTripsDialog.vue').default,
},
  computed:{
    ...mapState('auth',['loggedIn']),
		...mapGetters('chat', ['unreadchatlistnew']),
    ...mapState('admin', ['userFeedback','userReports']),

    otheruserId () {
      		return this.$route.params.otherUserId
    },
    otherUserDetails () {
			if (this.otheruserId) {
				return this.users[this.otherUserId]
			}
		},

    title() {
      let currentPath = this.$route.fullPath
      if (currentPath == '/'){
        return 'Cycle Planet'
      }
      else if (currentPath.includes('/country')) {
        return this.$route.params.countryKey
      }
      else{
        return 'Cycle Planet'
      }
    },

  },
  methods:{
    ...mapActions('auth',['logoutUser']),

    logoutUserMethod(){
      this.logoutUser()
    },


  },
  mounted() {
    if(this.isLoggedIn){
      this.updateAppVersion()
      if(this.$route.fullPath === '/'){
        this.$router.push('/map')
      }
    }
  },
  meta() {
		return{
			title: 'Cycle Planet',
			titleTemplate: title => `${title} | The bicycle touring guide`,

			// meta tags
			meta: {
				description: { name: 'description', content: 'Page 1' },
				keywords: { name: 'keywords', content: 'bicycle, bike, cycle, cycling, touring, visa, border, safe, information' },
				equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
				// note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
				ogTitle:  {
					name: 'og:title',
					// optional; similar to titleTemplate, but allows templating with other meta properties
					template (ogTitle) {
					return `${ogTitle}`
					}
				}
			},

			// CSS tags
			link: {
			material: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
			},

			// JS tags
			script: {
			ldJson: {
				type: 'application/ld+json',
				innerHTML: `{ "@context": "http://schema.org" }`
			}
			},

			// <html> attributes
			htmlAttr: {
			'xmlns:cc': 'http://creativecommons.org/ns#', // generates <html xmlns:cc="http://creativecommons.org/ns#">,
			empty: undefined // generates <html empty>
			},

			// <body> attributes
			bodyAttr: {
			'action-scope': 'xyz', // generates <body action-scope="xyz">
			empty: undefined // generates <body empty>
			},

			// <noscript> tags
			noscript: {
				default: 'This is content for browsers with no JS (or disabled JS)'
			}
		}
	}




}
</script>

<style >
@media screen and (min-width: 768px){
  .q-footer.layout{
    display: none;
  }
}



</style>

