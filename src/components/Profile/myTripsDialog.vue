<template>
  <div class="bg-white">
      <modal-header>My trips</modal-header>
      <q-banner class="bg-orange-2 text-orange-10 q-ma-sm">The trip section is a beta feature and is still being developed. You might notice errors or slow loading time. Sorry for the inconvenience.</q-banner>
      <q-list v-if="myUserDetails.trips"  >
        <div  v-for="(tripDetails,tripKey) in myUserDetails.trips" :key="tripKey">
            <q-item clickable v-ripple @click="$router.push({path: '/trip/'+myUserId+'/'+tripKey})">
            <q-item-section>
                <q-item-label>{{tripDetails.title}}</q-item-label>
                <q-item-label caption  lines="2">{{tripDetails.summary}}</q-item-label>
                <q-item-label>
                    <q-chip>{{tripDetails.countries?Object.keys(tripDetails.countries).length:0}} countries</q-chip>
                    <q-chip>{{tripDetails.stories?Object.keys(tripDetails.stories).length:0}} stories</q-chip>
                    </q-item-label>
            </q-item-section>
            <q-item-section side>
                <q-icon name="arrow_forward"/>
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
            </div>
      </q-list>
      <div v-else class="q-ma-md">
          <div>There are no trips to display</div>

      </div>
      <div class="justify-center flex items-center q-ma-md q-gutter-x-sm">
          <q-btn :style="buttonStyle" rounded @click="$router.push({path: '/trips'})">Get inspiration</q-btn>
          <div>or</div>
          <q-btn :style="buttonStyle" rounded  @click="createTripDialog=true">create new trip</q-btn>

      </div>
       
    <q-dialog v-model="createTripDialog">
      <create-trip-dialog @close="createTripDialog=false"/>
    </q-dialog>
      
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
  mixins: [mixinGeneral],
  data(){
      return{
          createTripDialog:false,

      }
  },

  components:{
    'create-trip-dialog' : require('components/Profile/CreateTrip.vue').default,

  },

  methods:{

  }

}
</script>

<style>

</style>