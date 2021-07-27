<template>
<div class="bg-grey-3" >
  <header>
    <div class="constrain">
      <div class=" row items-center " @click="$router.push('/map')">
        <div >
          <q-img @click="$router.push('/map')"  src="logo/logo_small.png" style="width:40px"></q-img>
        </div>
        <p class="text-h6 q-ml-md q-mb-none"> Cycle Planet</p>
        <q-space></q-space>
        <q-btn to="/map" flat icon="home" :label="isWebApp?'home':''" class="q-ma-xs justify-end"/>
        <q-btn flat v-if="!loggedIn" to="/auth" label="Login" class="q-ma-xs" icon="account_circle"/>
      </div>
    </div>
  </header>
    <div class="imageclass image1 flex items-end " style="min-height: 100vh;">
        <div class="constrain" style="width:100%">
            <div class=" text-white"  >
                <div class="text-h2 textblock1" >Your bicycle touring adventure starts here</div>
            </div>
            <div class="row " style="padding-bottom:20px" v-if="isWebApp">
                <img class="cursor-pointer" :class="screenwidthbig?'appimagedesktop':'appimage'" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"/>
                <img class="cursor-pointer" :class="screenwidthbig?'appimagedesktop':'appimage'" src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"/>
            </div>
            <div v-if="!isWebApp">
                <q-btn :style="buttonStyle" class="q-ma-md" to="/auth">Create account</q-btn>
            </div>
        </div>
    </div>

    <div class="imageclass image2 flex items-center " style="min-height: 100vh">
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
                <div class="cardicon">
                  <q-icon :name="card.image" />
                </div>
                <div class="titlecard">{{card.title}}</div>
                <div>- - - - - - - - - - - - - - - - - - - - - - - - - - </div>
                <div class="carddescription">{{card.description}}</div>
        </div>
        </div>

    </div>



    <div class=" justify-center image3 imageclass flex">
        <div class="text-center constrain items-center " style="margin-top:50px">
            <div class="text-h3">Register now!</div>
            <q-btn :style="buttonStyle" label="register" to="/auth" class="q-mt-lg"/>
        </div>
    </div>

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
              {title:'Get hosted for free',description:'In the map you can find hosts, and you can send chat messages to them. This allows you to get hosted during your trip for free. ', image: 'eva-home-outline'},
              {title:'Fully interactive map',description:'With the fully interactive map you can find border crossings, embassies, activities, other users and much more', image: 'eva-map-outline'},
              {title:'Plan your next trip',description:'Create a general route through the countries you want to cycle, and find the latests information about those pages on a single page.', image: 'eva-globe-2-outline'},
              {title:'Information about all countries',description:'Every country has it`s page with only the most useful information for bicycle tourists.', image: 'eva-info-outline'},
              {title:'Contribute to the community',description:'Every user can add new markers and country information, or edit existing information. This way, you can contribute to the tourbiking community', image: 'eva-cloud-upload-outline'},
              {title:'Create your own profile',description:'With your own profile you can easily show others all the bike related information you have.', image: 'eva-person-add-outline'},
            ],
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
header{
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  background: #fcba03;
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
.cardicon{
  background: #fcba03;
  color: #FFF;
  padding: 30px;
  font-size: 100px;
}
.imageclass{
    width:100%;
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
}
.image1{
    background-image: url("https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FPictures%2F20190531214625_IMG_0152-01.jpeg?alt=media&token=906a5a50-074f-4df4-ad38-7ace76fc5dcd");
    position: relative;
}
.image1::before{
  content: '';
  position: absolute;
  background: linear-gradient(180deg, rgba(252,186,3,0.75) 0%, rgba(255,255,255,0) 100%);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.image1 .constrain{
  position: relative;
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
    width:150px;
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
    max-width:66.66%;
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
