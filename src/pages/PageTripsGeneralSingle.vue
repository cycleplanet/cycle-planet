<template>
  <div style="height:400px;" >
    <div>
      <div :style="screenwidthbig?'height:500px':'height:300px'">
        <map-trip-general :tripDetails="tripDetails" :showParts="true"/>
      </div>
      <q-card >
        <div class="q-pa-md q-gutter-y-sm">
          <div class="row q-mb-lg">
            <div :class="isWebApp?'text-h3':'text-h4'">{{tripDetails.title}}</div>
            <q-space v-if="screenwidthbig"/>
            <q-btn 
            :class="screenwidthbig?'':'q-mt-md'" 
            :size="screenwidthbig?'md':'sm'"
            icon="add" rounded label="add to my trips" :style="buttonStyle" @click="loggedIn?addToMyTrip():showLoginDialog()"/>
          </div>

          <div>{{tripDetails.summary}}</div>

          <div class="row" >
            <div v-for="(country, countryKey) in tripDetails.countries" :key="countryKey" >
              <modal-countrychip3 :countryId="country" :index="countryKey" :last="false" :myProfile="false"/>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <div>
       <q-tabs
          v-model="tab"
          class="bg-secondary text-white shadow-2"
          active-color="white"
          indicator-color="white"
          align="justify"
        >
          <q-tab name="visas" label="Visas" />
          <q-tab name="borders" label="Borders"/>
          <q-tab name="activities" label="Activities" />
          <q-tab name="more" label="More" />
          
        </q-tabs>
   
    <q-separator />

      <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="borders">
             <border-part-general :mySelectedCountriesComputed="mySelectedCountriesComputed"/>

          </q-tab-panel>

          <q-tab-panel name="visas">
              <visa-part :mySelectedCountriesComputed="mySelectedCountriesComputed"/>

          </q-tab-panel>

          <q-tab-panel name="activities">
            <activity-part :mySelectedCountriesComputed="mySelectedCountriesComputed"/>

          </q-tab-panel>

          <q-tab-panel name="more" class="bg-grey-2">
            <more-part :mySelectedCountriesComputed="mySelectedCountriesComputed"/>
          </q-tab-panel>

        </q-tab-panels>

  </div>
    
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'


export default {   
  mixins: [mixinGeneral ],

  components: {
  'map-trip-general' : require('components/Trip/MapTripGeneral.vue').default,
  'trip-header' : require('components/Trip/TripHeader.vue').default,
  'tab-information' : require('components/Trip/Tabs/TabInformation.vue').default,
  'tab-planner' : require('components/Trip/Tabs/TabPlanner.vue').default,
 	'border-part-general': require('components/Trip/SubTabs/BorderPartGeneral.vue').default,
  'visa-part': require('components/Trip/SubTabs/VisaPart.vue').default,
  'activity-part': require('components/Trip/SubTabs/ActivityPart.vue').default,
  'more-part': require('components/Trip/SubTabs/MorePart.vue').default,  },

  data () {
    return {
      editTripDialog:false,
      editTripDetails:{},
		  mySelectedCountries:[],
      tab:'visas',
      tripsData:{
            "cairo-capetown" : {
                "countries" : [ "Egypt", "Sudan", "Ethiopia", "Kenya", "Uganda", "Rwanda", "Burundi", "Tanzania", "Zambia", "Botswana", "South Africa" ],
                "image" : "https://cdn.pixabay.com/photo/2018/03/17/10/05/wildlife-3233525_960_720.jpg",
                "summary" : "Cycle East Africa between the wild animals, the savanne landscapes and the ancient cultures.",
                "title" : "Cairo to Cape Town"
            },
            "alaska-patagonia" : {
                "countries" : [ "Canada", "United States of America", "Mexico", "Guatemala", "Honduras", "Nicaragua", "Costa Rica", "Panama", "Colombia", "Ecuador", "Peru", "Bolivia", "Chile", "Argentina" ],
                "image" : "https://cdn.pixabay.com/photo/2020/09/17/12/44/landscape-5579077_960_720.jpg",
                "summary" : "Experience all the different climates in a single trip, and get dissolved in the fabulous nature of the Americas.",
                "title" : "Alaska to Patagonia"
            },
            "istanbul-singapore" : {
                "countries" : [ "Turkey", "Georgia", "Azerbaijan", "Iran", "Turkmenistan", "Uzbekistan", "Tajikistan", "Kyrgyzstan", "China", "Laos", "Thailand", "Malaysia", "Singapore" ],
                "image" : "https://cdn.pixabay.com/photo/2017/06/13/19/31/samarkand-2399796_960_720.jpg",
                "summary" : "Discover forgotten lands on the once so mighty Silk Road, and dive into the mysterious culture of the East.",
                "title" : "Istanbul to Singapore"
            },
            "tanger-capetown" : {
                "countries" : [ "Morocco", "Mauritania", "Senegal", "Gambia", "Senegal", "Guinea-Bissau", "Guinea", "Sierra Leone", "Liberia", "Cote d'Ivoire", "Ghana", "Togo", "Benin", "Nigeria", "Cameroon", "Gabon", "Congo, Republic", "Angola", "Namibia", "South Africa" ],
                "image" : "https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2FTrips%2F20190803110224_IMG_0810-01.jpeg?alt=media&token=750d7e91-7cc6-4479-aeac-e93fc404107d",
                "summary" : "Probably not the easiest route for beginners, but definetly one with character. Meet the incredible hospitality that one of the poorest regions in the world has to offer you.",
                "title" : "Tanger to Cape Town"
            }
        }
      }
  },

  

  computed: {
 
 tripDetails () {
			return this.tripsData[this.$route.params.tripId]
		},
 
  mySelectedCountriesComputed(){

			if(this.tripsData[this.$route.params.tripId]){
				this.mySelectedCountries=this.tripsData[this.$route.params.tripId].countries
				return this.mySelectedCountries
			}
		},
 },
  methods:{
    editTripMethod(){
        this.editTripDetails = Object.assign({}, this.tripDetails)
        this.editTripDialog=true
    },
    addToMyTrip(){
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to add this trip to your profile? It will create a new trip on your profile with the settings of this template. You can change the information of this trip in the settings later. ',
        cancel: true,
      }).onOk(() => {
        this.setItemAction({
        path:'Users/'+this.myUserId+'/trips/'+this.timeStamp,
        data:{
          countries:this.tripDetails.countries,
          title:this.tripDetails.title,
          summary:'',
          timeStamp:this.timeStamp,
          startdate:this.niceTimeStamp,
          enddate:'',

        }
      })
      setTimeout(() => {
        this.$q.notify({
          message: 'We created a new trip on your profile. You can adjust the information in the settings.',
          color: 'secondary'
        })
      }, 3000)
      this.$router.push('/trip/'+this.myUserId+'/'+this.timeStamp)
      }).onCancel(() => {
      })
      
    },
    
  },
  created(){
    this.tripDetails
  }

 
}


</script>

<style>


</style>