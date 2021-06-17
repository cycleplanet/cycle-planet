<template>
  <div style="height:400px;" >
    
    <trip-header/>

    <q-tabs
        v-model="tab"
        no-caps
        class="bg-amber text-black shadow-2"
        align="justify"
      >
        <q-tab v-if="!myProfile" name="stories" label="Stories" class="row"/>
        <q-tab name="info" label="Countries" class="col-4"/>
        <q-tab v-if="myProfile" name="planner" label="Planner" class="col-4"/>
        <q-tab v-if="myProfile" name="stories" label="Stories" class="col-4" />
     
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated style="min-height:200px">
      <q-tab-panel name="stories" style="min-height:400px">
         <tab-stories/>
      </q-tab-panel>

      <q-tab-panel name="info" >
         <tab-information/>
      </q-tab-panel>

      <q-tab-panel name="planner" class="no-padding" >
        <tab-planner/>
      </q-tab-panel>

    </q-tab-panels>
      

    
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import mixinTrip from 'src/mixins/mixin-trip.js'


export default {   
  mixins: [mixinGeneral,mixinTrip ],

  components: {
  'trip-header' : require('components/Trip/TripHeader.vue').default,
  'tab-stories' : require('components/Trip/Tabs/TabStories.vue').default,
  'tab-information' : require('components/Trip/Tabs/TabInformation.vue').default,
  'tab-planner' : require('components/Trip/Tabs/TabPlanner.vue').default,

  },

  data () {
    return {
      tab:'',
      }
  },

  mounted() {
    this.setTab
  },

  computed: {
    setTab(){
      if(this.myProfile){
        this.tab='info'
      }else{
        this.tab='stories'
      }
    }
  },
}


</script>

<style>


</style>