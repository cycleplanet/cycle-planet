<template>
  <div>
    <q-tabs
        v-model="tab"
        no-caps
        class="bg-secondary text-white shadow-2 justify-center"
        
      >
      <div>
        <div class="text-center q-my-sm text-italic">The planner tab is only visible for you</div>
        <div class="row">
          <q-tab name="visas" label="Visas" />
          <q-tab name="borders" label="Borders"/>
          <q-tab name="activities" label="Activities" />
          <q-tab name="more" label="More" />
        </div>

      </div>

      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="visas">
                <visa-part :mySelectedCountriesComputed="mySelectedCountriesComputed"/>
          </q-tab-panel>
          
          <q-tab-panel name="borders">
              <border-part />
          </q-tab-panel>

          <q-tab-panel name="activities">
            <activity-part :userId="userId" :tripId="tripId" :mySelectedCountriesComputed="mySelectedCountriesComputed"/>

          </q-tab-panel>

          <q-tab-panel name="more" class="bg-grey-2">
            <more-part :userId="userId" :tripId="tripId" :mySelectedCountriesComputed="mySelectedCountriesComputed"/>
          </q-tab-panel>

        </q-tab-panels>

  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import mixinTrip from 'src/mixins/mixin-trip.js'

export default {   
  mixins: [mixinGeneral, mixinTrip],

  data () {
    return {
      mySelectedCountries:[],
      tab:'borders',
      editTripDialog:false,
      tripData:{}

    }
  },
  components: {
			'map-trip' : require('components/Trip/MapTrip.vue').default,
    	'border-part': require('components/Trip/SubTabs/BorderPart.vue').default,
    	'visa-part': require('components/Trip/SubTabs/VisaPart.vue').default,
    	'activity-part': require('components/Trip/SubTabs/ActivityPart.vue').default,
    	'more-part': require('components/Trip/SubTabs/MorePart.vue').default,
  },

  computed: {

  },
 

  methods:{
    ...mapActions('country', ['getVisaData']),
    ...mapActions('markers', ['getMainMarkersData']),
  },
  created(){
    this.getMainMarkersData()
    this.getVisaData()
  },
 
}


</script>

<style>
.spacing{
  margin-bottom:50px;
}

</style>