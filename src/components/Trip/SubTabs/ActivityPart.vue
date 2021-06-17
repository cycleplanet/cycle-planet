<template>
  <div >
      <div v-for="(countryKey, index) in mySelectedCountriesComputed" :key="index">
        <div class="spacing">  
          <div class="cp-h2 underline">{{countryKey}}</div>
            <div v-if="Object.keys(markerToApply[countryKey]).length>0">
              <div v-for="(activity, itemKey) in markerToApply[countryKey]" :key="itemKey" class="border q-my-lg">
                <div class="row ">
                    <div class="text-h6">{{activity.title}}</div>
                    <q-space></q-space>
                  <add-button :refKey="'SeeDo'" :itemKey="activity.itemKey"/>

                </div>
                <div><b>Description:</b></div>
                <div v-html="activity.description"></div>
                <item-footer :singleItemData="activity" />

            </div>
          </div>
          <div v-else>
              We're sorry, there are no registered activities yet.
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    mixins: [mixinGeneral],
    props:['mySelectedCountriesComputed'],
    data(){
      return{
        validmarkers:{}
      }
    },
    
    components:{
			'add-button' : require('components/Trip/Modals/AddtoMap.vue').default,
      'item-footer': 		require('components/Trip/Modals/itemfooter.vue').default,
},
    
    computed:{
		...mapState('markers', ['seeDoData']), 

    markerToApply(){
      let countries=Object.keys(this.mySelectedCountriesComputed)

      countries.forEach((countrysnapshot) => {
        let countryKey = this.mySelectedCountriesComputed[countrysnapshot]
        this.validmarkers[countryKey]={}

        let markers=Object.keys(this.seeDoData)
        markers.forEach((snapshot) => {
          let itemKey = snapshot
          if(this.seeDoData[itemKey].countryKey===countryKey){
            this.validmarkers[countryKey][itemKey]=this.seeDoData[itemKey]
          }
        })
      })
      return this.validmarkers
    }

    },
    methods:{
      
    },
    created(){
    }

}
</script>

<style>

</style>