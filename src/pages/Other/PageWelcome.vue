<template>
<div class="bg-grey-3" >
  <div class="constrain">
    <div class=" row items-center " @click="$router.push('/map')">
        <img class="cursor-pointer" :class="isWebApp?'logobig':'logosmall'" src="https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2Fvectors%2Flogo_blank.png?alt=media&token=238ff7ca-e2a3-48dc-8184-1e588bd31838" alt="">
        <div class="text-bold" :class="isWebApp?'text-h6':''">Cycle Planet</div>
        <q-space></q-space>
            <q-btn to="/map" flat icon="home" :label="isWebApp?'home':''" class="q-ma-xs justify-end" :class="isWebApp?'borderbutton':''"/>
            <q-btn flat v-if="!loggedIn" to="/auth" label="Login" class="q-ma-xs" icon="account_circle" :class="isWebApp?'borderbutton':''"/>
    </div>
    </div>  
   
    <div class="imageclass image1 flex items-end " :style="'height:'+(screenHeight)+'px;margin-top:-50px'">
        <div class="constrain" style="width:100%">
            <div class=" text-white"  >
                <div class="text-h2 textblock1" >Your bicycle touring adventure starts here</div>
            </div>
            <div class="row " style="padding-bottom:10px" v-if="isWebApp">
                <img class="cursor-pointer" :class="screenwidthbig?'appimagedesktop':'appimage'" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"/>
                <img class="cursor-pointer" :class="screenwidthbig?'appimagedesktop':'appimage'" src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"/>
            </div>
            <div v-if="!isWebApp">
                <q-btn :style="buttonStyle" class="q-ma-md" to="/auth">Create account</q-btn>
            </div>
        </div>
    </div>
    
    <div class="imageclass image2 flex items-center " :style="'height:'+screenHeight+'px'">
        <div :class="screenwidthbig?'text-h2':'cp-h2'" class="q-ml-md">
            <mark>Plan your trip</mark><br/><br/>
            <mark>Discover new places</mark><br/><br/>
            <mark>Meet other cyclists</mark><br/><br/>
            <mark>Get hosted for free</mark><br/><br/>
        </div>
    </div>
    
    <div class="constrain2" style="margin-top:-100px">
        <div class="row justify-center " >
        <div v-for="card in cards" class="col-4 col-md-3 col-sm-5 col-xs-12 card text-center">
                <div class="titlecard">{{card.title}}</div>
                <div>- - - - - - - - - - - - - - - - - - - - - - - - - - </div>
                <div class="carddescription">{{card.description}}</div>
                <div v-if="!card.image2">
                    <img class="screenimg" :src="card.image" alt="">
                </div>
                <div v-if="card.image2">
                    <img class="screenimg2" :src="card.image" alt=""><br/>
                    <img  class="screenimg3" :src="card.image2" alt="">
                </div>
        </div>
        </div>

    </div>

   

    <div class=" justify-center image3 imageclass flex">
        <div class="text-center constrain items-center " style="margin-top:50px">
            <div class="text-h3">Register now!</div>
            <q-btn :style="buttonStyle" label="register" to="/auth" class="q-mt-lg"/>
        </div>
    </div>
    <div class="bg-secondary " >
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
            <div class="constrain justify-center row">
            <div v-for="(section,sectionKey) in sections">

                <q-list  style="width:200px">
                    <div class="text-bold text-h6 q-mt-md">{{section.name}}</div>
                    <div v-for="item in section.items" class="text-body1">

                        <q-item v-if="item.to!=='/'" class="underline" style="padding-left:0px" :to="item.to">{{item.title}}</q-item>
                        <!-- <q-item v-if="item.to==='/'" class="underline cursor-pointer" @click="openUrl('http://cycleplanet.org/')" style="padding-left:0px" >Home</q-item> -->
                    </div>

                </q-list>
            </div>
            <q-separator></q-separator>
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
    <q-dialog v-model="testDialog">
        hello
    </q-dialog>
    
    <q-dialog v-model="feedbackDialog">
        <q-card style="min-width: 350px">
      <modal-header>Feedback</modal-header>

        <q-card-section>
          <div class="">Please tell us what is on your mind. Try to describe the feedback as detailed as possible.</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input type="textarea" filled dense v-model="feedback"  @keyup.enter="sendFeedbackMethod" />
        </q-card-section>

        <q-card-actions align="right" >
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Send feedback" class="bg-secondary text-white" @click="sendFeedbackMethod" />
        </q-card-actions>
      </q-card>
    </q-dialog>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { Notify } from 'quasar'

export default {
  	mixins: [mixinGeneral, ],
    components: {
		'feedback-dialog' : require('components/Shared/FeedbackDialog.vue').default,
    },
    data() {
        return {
            testDialog:false,
            feedbackDialog:false,
            feedback:'',
            cards:[
                {title:'Fully interactive map',description:'With the fully interactive map you can find border crossings, embassies, activities, other users and much more',image:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210219-173429_Cycle%20Planet.jpg?alt=media&token=e2332a8f-3853-49d6-aa14-882dc1eb7a7c'},
                {title:'Plan your next trip',description:'Create a general route through the countries you want to cycle, and find the latests information about those pages on a single page.',image:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210330-163522_Cycle%20Planet.jpg?alt=media&token=60588d08-ea06-4232-b52f-2d1bdfd8b80b',image2:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210330-163621_Cycle%20Planet.jpg?alt=media&token=f46f116c-5c6b-4da1-9f27-b233818da916'},
                {title:'Information about all countries',description:'Every country has it`s page with only the most useful information for bicycle tourists.',image:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210330-163638_Cycle%20Planet.jpg?alt=media&token=54cbacb3-015b-4d6c-b9e8-9a44ea7c8041',image2:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210219-173649_Cycle%20Planet.jpg?alt=media&token=aaac3211-9256-46ea-ab52-9f2a8d6e709f'},
                {title:'Contribute to the community',description:'Every user can add new markers and country information, or edit existing information. This way, you can contribute to the tourbiking community',image:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210219-173444_Cycle%20Planet.jpg?alt=media&token=2dc8c2a7-0e3c-407e-8094-b851a3dcfda6',image2:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210219-173514_Cycle%20Planet.jpg?alt=media&token=45e30d79-3789-4c10-941c-47f2e451dab9'},
                {title:'Create your own profile',description:'With your own profile you can easily show others all the bike related information you have.',image:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210219-173826_Cycle%20Planet.jpg?alt=media&token=6721f8e8-162a-40a5-8b38-c0d40f387af5'},
                {title:'Get hosted for free',description:'In the map you can find hosts, and you can send chat messages to them. This allows you to get hosted during your trip for free. ',image:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FScreens%2FScreenshot_20210219-173808_Cycle%20Planet.jpg?alt=media&token=3ec5e5d1-a0d8-4c64-a331-61f7f5653ed4'},
            ],
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
    methods:{

        sendFeedbackMethod(){
            this.setItemAction({
                data:{
                    issue:this.feedback,
                    date:this.timeStamp,
                    user:this.myUserId
                },
                path:'Feedback/'+this.timeStamp
            }) 
            Notify.create({
                type: 'positive',
                color: 'positive',
                timeout: 3000,
                message: 'Thanks for your feedback! We will have a look at it!'
            })
            this.feedback=''
            this.feedbackDialog=false
        },
    }

}
</script>

<style>
.borderbutton{
    border:1px solid black;
}
.constrain2{
  max-width: 1675px;
  margin: 0 auto;
}
.screenimg{
    width:90%;
    border:1px solid grey;
    border-radius: 8px;

}
.screenimg2{
    width:70%;
    margin-left:-15%;
    border:1px solid grey;
    border-radius: 8px;

}
.screenimg3{
    width:70%;
    margin-top:-95%;
    margin-left:15%;
    border-radius: 8px;
    border:1px solid grey;
}
.bottom-left {
  bottom: 8px;
  left: 16px;
}

.card{
    background-color: white;
    border-radius: 5px;
    margin:8px 4px 0px 4px;
    padding-bottom: 12px;
}
.titlecard{
    font-size: 30px;
    padding:20px;
    
}
.carddescription{
    font-size: 15px;
    padding:20px;

}
.imageclass{
    width:100%;
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
}
.image1{
    /* background-image: url("https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2FIMG_9982.JPG?alt=media&token=1ac47a65-cfcd-4863-ad48-4e5540ff4363"); */
    background-image: url("https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FPictures%2F20190531214625_IMG_0152-01.jpeg?alt=media&token=906a5a50-074f-4df4-ad38-7ace76fc5dcd");
    
}
.image2{
    background-image: url("../../../public/images/map.png");
}
.image3{
    width:100%;
    height: 500px;
    background-image: url("https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/placeholder%2Fcamp-2650359_1280.jpg?alt=media&token=a0f4da1f-65ed-4572-8806-2b0e8941721a");
}
.logobig{
    height:30px;
    width:70px;
    margin:10px;
}
.logosmall{
    height:20px;
    width:50px;
    margin:10px;
}
.appimage{
    height:40px;
    max-width:135px;
    margin:10px;
}
.appimagedesktop{
    height:80px;
    max-width:270px;
    margin:10px;
}

.overlay{
    z-index:1;
    width:350px;
    align-self: flex-end;
    padding-bottom:20px
}

.background{
    background-color:#180c0c;
}
.textblock1{
    max-width:500px;
    padding:12px;
}
mark{
  padding: 0.1em 0.4em;
  border-radius: 0.8em 0.3em;
  background: transparent;
  background-image: linear-gradient(
    to right,
    rgba(255, 225, 0, 0.3),
    rgba(255, 225, 0, 0.7) 4%,
    rgba(255, 226, 7, 0.533)
  );
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;

}





</style>