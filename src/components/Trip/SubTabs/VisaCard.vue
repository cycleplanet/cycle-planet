<template>
  <div class="q-gutter-y-sm border">
      <!-- <div>{{itemData}}</div> -->
      <div v-if="itemData.onlineVisa" class="q-gutter-y-sm">
        <div class="text-h6">Get an e-visa</div>
        <q-separator></q-separator>
        <div v-if="itemData.onlineVisa"><b>Website:  </b>  <a :href="itemData.website" target="_blank">{{itemData.website}}</a></div>
      </div>

      <div v-if="!itemData.onlineVisa" class="q-gutter-y-sm">
        <div class="row"> 
        <div class="text-h6">Visa on the road</div>
        <q-space></q-space>        
        <add-button class="justify-end" :refKey="'Embassy'" :itemKey="itemKey"/>
        
        </div>
        <q-separator></q-separator>

        <div>You can apply for the visa of <b>{{countryKey}}</b> in <b>{{itemData.country_located}}, {{itemData.city}}</b></div>

      </div>

      <div><b>Description:</b></div>
      <div v-html="itemData.description"></div>
      <div v-if="itemData.visas">
        <div><b>Available visas:</b></div>
        <div v-for="(visa, visaKey) in itemData.visas" :key="visaKey">
            <div class="q-ml-sm">{{visa.title}} - {{visa.leng}} - {{visa.costs}}</div>

        </div>
      </div>
      <item-footer :singleItemData="itemDetailsGeneral" />
  </div>

</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    mixins: [mixinGeneral],
    props:['countryKey','itemKey'],
    components:{
			'add-button' : require('components/Trip/Modals/AddtoMap.vue').default,
		  'item-footer': 		require('components/Trip/Modals/itemfooter.vue').default,
    },
    computed:{
		...mapState('markers', ['embassyData']),

        itemDetailsGeneral(){
            return this.embassyData[this.itemKey]
        },
        
        itemData(){
            return this.embassyData[this.itemKey]
        },
        userId(){
          return this.$route.params.userId
        },
        tripId() {
          return this.$route.params.tripId
        },

    },
}
</script>

<style>
.border{
    border:1px solid black;
    margin-top:10px;
    border-radius: 5px;
    padding:3px
}
.description{
    width:20px;
}
</style>