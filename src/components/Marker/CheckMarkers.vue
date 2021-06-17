<template>
<div>
    <q-card v-if="randomItemData">
        <modal-header>Check markers</modal-header>
        <div class="q-pa-md q-gutter-y-md" v-if="randomItemData.refKey">
          <!-- randomItem:{{randomItemData}} -->
          <q-banner class="bg-secondary text-white">
            A random marker is shown to you to check.
          </q-banner>

          <div><b>Category:</b>{{markerlist[randomItemData.refKey].title}}</div>
          <div class="row"><b>Title: </b>
            <div v-if="randomItemData.refKey==='Border_item'">{{randomItemData.country1.country}} ({{randomItemData.country1.city}}) - {{randomItemData.country2.country}} ({{randomItemData.country2.city}})</div>
            <div v-else-if="randomItemData.refKey==='Embassy'">
              <div v-if="randomItemData.onlineVisa">Online visa for {{randomItemData.countryKey}}</div>
              <div v-else>Visa for {{randomItemData.countryKey}} in {{randomItemData.country_located}}</div>
              </div>
            <div v-else>{{randomItemData.title}}</div>
          </div>
          <div><b>Description:</b><div v-html="randomItemData.description?randomItemData.description:'No description'"/></div>
          <div>
            <map-single-item :singleItemData="singleItemData" :draggable="false"/>
          </div>
          <div class="row">
            <div>{{randomItemData.comments?Object.keys(randomItemData.comments).length:0}} comments</div>
            <div>/{{randomItemData.likes?Object.keys(randomItemData.likes).length:0}} likes</div>
          </div>


          <q-separator></q-separator>
          <div >
            <div class="text-h6 q-mb-sm">Logbook</div>
            <div class="q-my-md">
              <nice-date2 class="text-bold" :dateprop="randomItemData.date_created"/>
              <div class="row "><modal-username class="q-mr-sm" :userId="randomItemData.user_created"/> created this item</div>
            </div>
            <div v-if="randomItemData.date_edited" class="q-my-md">
              <nice-date2 class="text-bold" :dateprop="randomItemData.date_edited"/>
              <div class="row "><modal-username class="q-mr-sm" :userId="randomItemData.user_edited"/> edited this item</div>
            </div>
            <div v-if="randomItemData.logbook">
              <div v-for="(log,logKey) in randomItemData.logbook" :key="logKey" class="q-my-md">
                <nice-date2 class="text-bold" :dateprop="logKey"/>
                <div class="row "><modal-username class="q-mr-sm" :userId="log.user"/>{{log.description}}</div>
                <div v-if="log.checks" class="row flex items-center"><b>⤷ Reason:</b>
                  <div v-for="(chip, chipKey) in log.checks" :key="chipKey">
                    <q-chip :label="chip"/>
                  </div>
                </div>

              </div>
            </div>

          </div>
          <q-separator></q-separator>
          <div v-if="!randomItemData.checked_by" class="flex justify-evenly ">
            <q-icon name="circle" color="grey"/>
            <q-icon name="circle" color="grey"/>
            <q-icon name="circle" color="grey"/>
          </div>
          <div v-if="randomItemData.checked_by" class="flex justify-evenly ">
              <q-icon :name="Object.keys(randomItemData.checked_by).length>0?(randomItemData.checked_by[Object.keys(randomItemData.checked_by)[0]]?'check_circle':'cancel'):'circle'" :color="Object.keys(randomItemData.checked_by).length>0?(randomItemData.checked_by[Object.keys(randomItemData.checked_by)[0]]?'green':'red'):'grey'"/>
              <q-icon :name="Object.keys(randomItemData.checked_by).length>1?(randomItemData.checked_by[Object.keys(randomItemData.checked_by)[1]]?'check_circle':'cancel'):'circle'" :color="Object.keys(randomItemData.checked_by).length>1?(randomItemData.checked_by[Object.keys(randomItemData.checked_by)[1]]?'green':'red'):'grey'"/>
              <q-icon :name="Object.keys(randomItemData.checked_by).length>2?(randomItemData.checked_by[Object.keys(randomItemData.checked_by)[2]]?'check_circle':'cancel'):'circle'" :color="Object.keys(randomItemData.checked_by).length>2?(randomItemData.checked_by[Object.keys(randomItemData.checked_by)[2]]?'green':'red'):'grey'"/>

          </div>
          <q-separator></q-separator>

          <div class="q-gutter-md flex justify-center" v-if="!disapproved">
            <q-btn rounded size="sm" icon="done" label="approve" color="green" @click="approveMarkerMethod(randomItemData.itemKey)"/>
            <q-btn rounded size="sm" icon="close" label="disapprove" color="red" @click="disapproveMarkerMethod(randomItemData.itemKey)"/>
            <q-btn flat label="skip"  @click="getRandomMarker()"/>
          </div>
          <div v-if="disapproved">
            <div class="text-blue underline cursor-pointer" @click="disapproved=false">Return</div>
              <div>Please specify why you want to disapprove this marker</div>
              <q-select filled v-model="checkChips" use-input use-chips multiple input-debounce="0" @new-value="createValue" :options="filterOptions" @filter="filterFn" style="width: 350px" class="q-mb-sm" label="select or write something (press enter)"/>
          </div>
          <div class="row" v-if="disapproved">
            <q-space></q-space>
            <q-btn :style="buttonStyle" @click="disapproveMarkerMethod2(randomItemData.itemKey)">Sumbit</q-btn>
          </div>
        </div>



    </q-card>


</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
const stringOptions = [
  'Wrong category', 'Title is not clear', 'Description is not clear', 'Coordinates are wrong', 'Not relevant to bicycle touring'
]

export default {
	mixins: [mixinGeneral],

	data() {
	  	return {
        randomItem:'',
        randomItemData:{},
        disapproved:false,
        filterOptions: stringOptions,
        checkChips: null,
      }
    },
    components:{
      'comment': require('components/Shared/Modals/Comment.vue').default,
      'map-single-item': require('components/Shared/MapSingleItem.vue').default,
    },

    computed:{
		...mapState('markers', ['checkMarkerData']),



    },
    methods:{
		...mapActions('markers', ['getCheckMarkerData']),

      createValue (val, done) {
        if (val.length > 0) {
          if (!stringOptions.includes(val)) {
            stringOptions.push(val)
          }
          done(val, 'toggle')
        }
      },

      filterFn (val, update) {
        update(() => {
          if (val === '') {
            this.filterOptions = stringOptions
          }
          else {
            const needle = val.toLowerCase()
            this.filterOptions = stringOptions.filter(
              v => v.toLowerCase().indexOf(needle) > -1
            )
          }
        })
      },
      getRandomMarker(){
        this.randomItemData = this.landMarkers[Object.keys(this.landMarkers)[Math.floor(Math.random() * Object.keys(this.landMarkers).length)]]
      },
      approveMarkerMethod(itemKey){
        let logbookData={
          user:this.myUserId,
          description:'approved marker',
          date:this.timeStamp,

        }
        if(this.randomItemData.logbook){
          this.randomItemData.logbook[this.timeStamp]=logbookData
        }else{
          let logbook2={}
          logbook2[this.timeStamp]=logbookData
          this.randomItemData.logbook=logbook2
        }

        let status2='pending'
        if(this.randomItemData.checked_by){
          if(Object.keys(this.randomItemData.checked_by).length===2){
            if(Object.values(this.randomItemData.checked_by)[0]||Object.values(this.randomItemData.checked_by)[1])
            status2='approved'
          }
        }
        if(this.randomItemData.checked_by){
          this.randomItemData.checked_by[this.myUserId]=true
        }else{
          let checkedby2={}
          checkedby2[this.myUserId]=true
          this.randomItemData.checked_by=checkedby2
        }

        this.updateMarkerAction({
          doc:itemKey,
          data:{
            logbook:this.randomItemData.logbook,
            status:status2,
            checked_by:this.randomItemData.checked_by
          }
        })

        let newEntry={}
        newEntry[this.timeStamp]=itemKey
        this.updateItemAction({
          path:'Users/'+this.myUserId+'/checked_markers',
          data:newEntry
        })
        this.getRandomMarker()


      },
      disapproveMarkerMethod(itemKey){
        this.disapproved=true
      },
      disapproveMarkerMethod2(itemKey){
         let logbookData={
          user:this.myUserId,
          description:'disapproved marker',
          date:this.timeStamp,
          checks:this.checkChips,
        }
        if(this.randomItemData.logbook){
          this.randomItemData.logbook[this.timeStamp]=logbookData
        }else{
          let logbook2={}
          logbook2[this.timeStamp]=logbookData
          this.randomItemData.logbook=logbook2
        }

        let status2='pending'
        if(this.randomItemData.checked_by){
          if(Object.keys(this.randomItemData.checked_by).length===2){
            if(!Object.values(this.randomItemData.checked_by)[0]||!Object.values(this.randomItemData.checked_by)[1])
            status2='disapproved'
          }
        }
        if(this.randomItemData.checked_by){
          this.randomItemData.checked_by[this.myUserId]=false
        }else{
          let checkedby2={}
          checkedby2[this.myUserId]=false
          this.randomItemData.checked_by=checkedby2
        }

        this.updateMarkerAction({
          doc:itemKey,
          data:{
            logbook:this.randomItemData.logbook,
            status:status2,
            checked_by:this.randomItemData.checked_by
          }
        })

        let newEntry={}
        newEntry[this.timeStamp]=itemKey
        this.updateItemAction({
          path:'Users/'+this.myUserId+'/checked_markers',
          data:newEntry
        })
        this.disapproved=false
        this.checkChips=null
        this.getRandomMarker()


      },

    },

    created(){
      this.getRandomMarker()
    }


}
</script>
