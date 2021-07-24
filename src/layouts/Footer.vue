<template>
  <div>
    <div class="bg-secondary" v-if="isWebApp && !$route.fullPath.includes('/map') && !$route.fullPath.includes('/chat/')">
      <div class="text-center constrain" style="padding-top:50px">
        <div class="cp-h2">Follow us</div>
        <q-btn round class="bg-white" flat @click="openUrl('https://www.instagram.com/cycle.planet')">
          <q-avatar rounded class="q-ma-sm" size="34px" >
            <img :src="('social_icons/icon_instagram.png')">
          </q-avatar>
        </q-btn>
        <q-btn round class="bg-white q-ml-sm" flat @click="openUrl('https://www.facebook.com/Cycle-Planet-100672311813208')">
          <q-avatar rounded class="q-ma-sm" size="34px" >
            <img :src="('social_icons/icon_facebook.png')">
          </q-avatar>
        </q-btn>
      </div>
      <div class="constrain justify-center row" style="padding-bottom: 40px;">
        <q-list v-for="(section,sectionKey) in sections" :key="sectionKey" style="width: 25%">
          <div class="text-bold text-h6 q-mt-md">{{section.name}}</div>
          <router-link v-for="item in section.items" class="quicklink" :to="item.to">
            {{item.title}}
          </router-link>
        </q-list>
      </div>
      <div class="bg-grey-3" style="padding-bottom:40px">
        <div class="constrain text-center">
          <div class="q-pa-md ">Cycle Planet is a non-profit organization. This website is made by volunteers with love for the bicycle touring community.</div>
          <div class="row q-gutter-x-sm justify-center">
            <q-btn v-if="isWebApp" :style="buttonStyle" label="donate" to="/donate"/>
            <q-btn :style="buttonStyle" label="join us" to="/team"/>
            <q-btn :style="buttonStyle" label="feedback" @click="feedbackDialog=true"/>
          </div>
        </div>
      </div>
    </div>
    <q-footer class="layout" v-if="!$route.fullPath.includes('/chat/')">
      <q-tabs indicator-color="transparent" active-:style="buttonStyle"  class="bg-white text-grey shadow-2" align="justify" :breakpoint="0">
        <q-tab name="map" icon="map"   @click="$router.push('/map')" />
        <q-tab name="trips" icon="alt_route"  @click="$router.push('/trips')"/>
        <q-tab v-if="loggedIn" icon="chat" @click="$router.push('/chat')">
          <q-badge color="red" v-if="Object.keys(unreadchatlistnew).length" floating>{{Object.keys(unreadchatlistnew).length}}</q-badge>
        </q-tab>
        <q-tab v-if="loggedIn?teamMember:false" icon="star"  @click="$router.push('/admin')">
          <q-badge color="red" v-if="Object.keys(userReports).length" floating>{{Object.keys(userReports).length}}</q-badge>
          <q-badge color="amber" style="margin-top:20px" v-if="Object.keys(userFeedback).length" floating>{{Object.keys(userFeedback).length}}</q-badge>
        </q-tab>
      </q-tabs>
    </q-footer>
  </div>
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
      sections : [
        {name : 'Main', list:true,items : [
            {title: 'Home', to:'/'},
            {title: 'Trips', icon: 'alt_route', to:'/trips'},
            {title: 'Countries', icon: 'public', to:'/countries'},
          ]},
        {name : 'Useful', list:true,mobile:true,items : [
            {title: 'Get inspired', icon: 'far fa-lightbulb', to:'/get-inspired'},
            {title: 'Resources', icon: 'fas fa-rocket', to:'/resources'},
            {title: 'Gear', icon: 'fas fa-bicycle', to:'/gear'},
          ]},
        {name:'About', list:true,items:[
            {title: 'House Rules', icon: 'speaker_notes', to:'/houserules' },
            {title: 'Team', icon: 'groups', to:'/team' },
            {title: 'Our story', icon: 'fas fa-book', to:'/our-story' },
            {title: 'FAQ', icon: 'help', to:'/faq' },
          ]},
        {name:'Legal', list:true,items:[
            {title: 'Privacy Policy', icon: 'security', to:'/privacy-policy' },
            {title: 'Terms of use', icon: 'security', to:'/terms-of-use' },
            {title: 'Cookie policy', icon: 'fas fa-cookie-bite', to:'/cookie-policy' },
            {title: 'Contact', icon: 'mail', to:'/contact' },
          ]},
      ]
    }
  },
}
</script>

<style>
.quicklink{
  color: #000;
  text-decoration: underline;
  display: block;
  margin: 10px 0;
}
@media screen and (min-width: 768px){
  .q-footer.layout{
    display: none;
  }
}
</style>

