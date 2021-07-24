<template>
<div>

      <q-list dark>
        <div class="row q-mt-md justify-center">
          <q-btn v-if="loggedIn"  :style="buttonStyle" label="Feedback"  @click="feedbackDialog=true"/>
        </div>
        <div>
          <q-item-label class="text-black" header>Contribute</q-item-label>
          <q-item class="bg-white text-black" clickable v-ripple v-if="isWebApp" @click="openUrl('https://opencollective.com/cycle-planet')">
            <q-item-section  avatar>
              <q-icon name="fas fa-hand-holding-heart" />
            </q-item-section>
            <q-item-section>Donate</q-item-section>
          </q-item>
          <q-separator  />
          <q-item class="bg-white text-black" clickable v-ripple @click="openUrl('https://join.slack.com/t/cycle-planet/shared_invite/zt-shfov7n9-c608GlSNiGPCbRTb8D5nQA')">
            <q-item-section  avatar>
              <q-avatar>
                <img src="social_icons/icon_slack.png">
              </q-avatar>
            </q-item-section>
            <q-item-section>Join our Slack</q-item-section>
          </q-item>
          <q-separator  />
        </div>

        <div v-if="isWebApp">
          <q-item-label class="text-black" header>Mobile App</q-item-label>
          <q-item clickable @click="android" class="bg-white">
            <q-img  style="width: 140px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"/>
          </q-item>
          <q-separator  />
          <q-item clickable @click="apple" class="bg-white">
            <q-img style="width: 140px" src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"/>
          </q-item>
          <q-separator  />
        </div>

        <div v-for="(section,key) in sections" :key="key" class="q-mt-md">
          <div v-if="(section.mobile? screenwidth : true)">
            <q-item-label class="text-black" header>
              {{section.name}}
            </q-item-label>
            <div :class="{'row':!section.list}" class="bg-white" >
              <div v-for="(item, itemId) in section.items" :key="itemId">
                <div v-if="section.list">
                  <div v-if="item.apple?isWebApp:true">
                  <q-item v-if="item.login?loggedIn:true"
                  clickable
                  v-ripple
                  class="text-black"
                  :class="{'q-mr-none q-pr-none':!section.list}"
                  :to="section.name==='Mobile apps'?'':item.to"
                  @click="section.name==='Mobile apps'?mobileAppDialog(item.title):''"

                  >
                    <q-item-section  avatar>
                      <q-icon v-if="item.icon" :name="item.icon" />
                      <q-avatar size="27px" rounded v-if="item.img">
                        <img :src="item.img">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section v-if="section.list" >{{item.title}}</q-item-section>
                  </q-item>
                  </div>
                </div>
                <div v-else >
                  <q-btn round flat @click="openUrl(item.url)" class="q-mx-md">
                    <q-avatar rounded class="q-ma-sm" size="34px" >
                      <q-img   :src="item.img"/>
                    </q-avatar>
                  </q-btn>
                </div>

            <q-separator  />
            </div>

          <q-separator  />
         </div>

        </div>

        </div>


        <div v-if="loggedIn" class="row q-mt-lg q-mb-md justify-center">
          <q-btn flat class="bg-red" label="Log out" @click="logoutUserMethod" to="/auth"/>
        </div>

        <div class="text-black text-center">version {{version}}</div>

      </q-list>
    <q-dialog v-model="feedbackDialog">
      <feedback-dialog @close="feedbackDialog=false"/>
    </q-dialog>


    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
  mixins: [mixinGeneral, ],
  components: {
		'feedback-dialog' : require('components/Shared/FeedbackDialog.vue').default,
  },
  data () {
    return {
      feedbackDialog:false,

            sections : [
               {name : 'Useful', list:true,mobile:true,items : [
                // {title: 'Donate', icon: 'fas fa-hand-holding-heart', to:'/donate',apple:true},
                {title: 'Collections', icon: 'collections', to:'/collections'},
                // {title: 'Get inspired', icon: 'far fa-lightbulb', to:'/get-inspired'},
                {title: 'Resources', icon: 'fas fa-rocket', to:'/resources'},
                {title: 'Gear', icon: 'fas fa-bicycle', to:'/gear'},
              ]},
              {name:'About', list:true,items:[
                    {title: 'House Rules', icon: 'speaker_notes', to:'/houserules' },
                    {title: 'Team', icon: 'groups', to:'/team' },
                    {title: 'Our story', icon: 'fas fa-book', to:'/our-story' },
                    {title: 'Credits', icon: 'favorite', to:'/credits' },
                ]},

                {name : 'Follow us', list:false,items : [
                    {title: 'Facebook', icon: '', img: 'social_icons/icon_facebook.png', url:'https://www.facebook.com/Cycle-Planet-100672311813208' },
                    {title: 'Instagram', icon: '',img:'social_icons/icon_instagram.png', url:'https://www.instagram.com/cycle.planet' },
                ]},
                 {name : 'General', list:true,items : [
                  {title: 'Settings', icon: 'settings', to:'/settings', login:true },
                  {title: 'Contact', icon: 'mail', to:'/contact' },
                  {title: 'FAQ', icon: 'help', to:'/faq' },

                ]},

                {name:'Legal', list:true,items:[
                    {title: 'Privacy Policy', icon: 'security', to:'/privacy-policy' },
                    {title: 'Terms of use', icon: 'security', to:'/terms-of-use' },
                    {title: 'Cookie policy', icon: 'fas fa-cookie-bite', to:'/cookie-policy' },
                ]},
            //     {name:'Mobile apps', list:true,items:[
            //         {title: 'iOs app', icon: 'fab fa-apple'},
            //         {title: 'Android app', icon: 'fab fa-android' },
            //     ]}
            ]
    }
  },
  computed:{
    screenwidth(){
      let screenWidth = screen.width
      if(screenWidth > 768){
              return false
           }
           else{return true}
    }
  },
  methods:{
    ...mapActions('auth',['logoutUser']),
    logoutUserMethod(){
      this.logoutUser()
    },

    android(){
        window.open('https://play.google.com/store/apps/details?id=com.cycleplanet.cycleplanet', '_blank');
    },
    apple(){
      window.open('https://apps.apple.com/app/cycle-planet/id1547132334', '_blank');
    },

  }
}
</script>

<style>
</style>
