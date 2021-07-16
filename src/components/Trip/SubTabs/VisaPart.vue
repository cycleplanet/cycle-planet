<template>
  <div>
      <div>
          <div v-for="(country, index) in mySelectedCountriesComputed" :key="index">
            <div class="q-my-md spacing">
                <div class="cp-h2 underline ">{{mySelectedCountriesComputed[index]}}</div>
              <div class="border">
                <div class="text-h6">
                Do you need a visa?
                </div>
              <q-separator></q-separator>

                <!-- {{checkVisaData(index)}} -->
                <div v-if="allCountryData[mySelectedCountriesComputed[index]].schengen">
                  You need a Schengen visa for this country.
                </div>
                <div v-else>
                  <div v-if="visaData[mySelectedCountriesComputed[index]]">
                    <div v-html="visaData[mySelectedCountriesComputed[index]].body"></div>
                  </div>
                  <div v-else>
                    We don't have experience with getting this visa. Please share yours if you have recent experience. 
                  </div>
                </div>
              </div>
              <div v-if="checkEVisaData(index)">
                <div v-for="(embassy, itemKey) in markerToApply[country]" :key="itemKey">
                  <div v-if="embassy.onlineVisa">
                    <visacard :countryKey="country" :itemKey="itemKey"/>

                  </div>
                </div>
              </div>
              <div v-if="checkVisaData(index)==='first'">
                <div v-for="(embassy, itemKey) in markerToApply[country]" :key="itemKey">
                  <div v-if="embassy.country_located===mySelectedCountriesComputed[index-1]">
                    <visacard :countryKey="country" :itemKey="itemKey"/>

                  </div>
                </div>
              </div>
              <div v-else-if="checkVisaData(index)==='second'">
                <div v-for="(embassy, itemKey) in markerToApply[country]" :key="itemKey">
                  <div v-if="embassy.country_located===mySelectedCountriesComputed[index-2]">
                    <visacard :countryKey="country" :itemKey="itemKey"/>

                  </div>
                </div>
              </div>
              <div v-else-if="checkVisaData(index)==='third'">
                <div v-for="(embassy, itemKey) in markerToApply[country]" :key="itemKey">
                  <div v-if="embassy.country_located===mySelectedCountriesComputed[index-3]">
                    <visacard :countryKey="country" :itemKey="itemKey"/>
                  </div>
                </div>
              </div>



              
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
			'visacard' : require('components/Trip/SubTabs/VisaCard.vue').default,

    },

    computed:{
		...mapState('country', ['visaData']),  
		...mapState('markers', ['embassyData']),  
    
    markerToApply(){
      let countries=Object.keys(this.mySelectedCountriesComputed)
      countries.forEach((countrysnapshot) => {
        let countryKey = this.mySelectedCountriesComputed[countrysnapshot]
        this.validmarkers[countryKey]={}

        let markers=Object.keys(this.embassyData)
        markers.forEach((snapshot) => {
          let itemKey = snapshot
          if(this.embassyData[itemKey].countryKey===countryKey){
            this.validmarkers[countryKey][itemKey]=this.embassyData[itemKey]
          }
        })
      })
      return this.validmarkers
    }

    },
    methods:{
		...mapActions('country', ['getVisaData',]),  

      checkEVisaData(index){
        let x=0
        if(this.validmarkers[this.mySelectedCountriesComputed[index]]){
          let keys=Object.keys(this.markerToApply[this.mySelectedCountriesComputed[index]])
          keys.forEach(element => {
            if(this.markerToApply[this.mySelectedCountriesComputed[index]][element].onlineVisa){
              x=x+1000
            }
          })
        }
        if(x>=1000){
          return true
        }else{
          return false
        }
      },

      checkVisaData(index){
      let x=0
      if(this.markerToApply[this.mySelectedCountriesComputed[index]]){
        let keys=Object.keys(this.markerToApply[this.mySelectedCountriesComputed[index]])
        keys.forEach(element => {
           if(this.markerToApply[this.mySelectedCountriesComputed[index]][element].onlineVisa){
            x=x+0

           }
          else if(this.markerToApply[this.mySelectedCountriesComputed[index]][element].country_located===this.mySelectedCountriesComputed[index-1]){
            x=x+1000
          }else if(this.markerToApply[this.mySelectedCountriesComputed[index]][element].country_located===this.mySelectedCountriesComputed[index-2]){
            x=x+100
          }else if(this.markerToApply[this.mySelectedCountriesComputed[index]][element].country_located===this.mySelectedCountriesComputed[index-3]){
            x=x+10
          }
        })
      }else{
        return false
      }
      if(x>=1000){
        return 'first'
      }else if(x>=100){
        return 'second'
      }else if(x>=10){
        return 'third'
      }else{
        return 'what happened?'
      }
    },
    },
    created(){
      this.getVisaData(this.mySelectedCountriesComputed)
    }

}
</script>

<style>
img{
  width:100%;
}

</style>