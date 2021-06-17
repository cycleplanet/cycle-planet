<template>
<div>
    <q-card style="min-width:90%;max-width:400px;width:500px">
        <modal-header>My markers</modal-header>
        <q-list bordered class="rounded-borders">
            <div v-for="(marker, itemKey) in userMarkerData" :key="itemKey">
                <q-expansion-item expand-separator 
                :label="marker.refKey==='Border_item'?marker.country1.country+' - '+marker.country2.country:(marker.refKey==='Embassy'?'visa '+marker.countryKey+' - '+marker.country_located:marker.title)+' ('+(marker.checked_by?Object.keys(marker.checked_by).length:0)+'/3)'"
                :caption="markerlist[marker.refKey].title"
                :icon="marker.status==='approved'?'check_circle':(marker.status==='disapproved'?'remove_circle_outline':'pending')"
                :class="marker.status==='approved'?'bg-green-2 text-green-10':(marker.status==='disapproved'?'bg-red-2 text-red-10':'bg-orange-2 text-orange-10')"
                >
                <div class="bg-white text-black q-pa-sm">
                    <div><b>Description:</b>{{marker.description}}</div>
                </div>
                </q-expansion-item>

            </div>
        </q-list>

    </q-card>
      
      
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'


export default {
	mixins: [mixinGeneral],
	
	data() {
	  	return {
          }
    },

    computed:{
		...mapState('markers', ['userMarkerData']),


    },
    methods:{
		...mapActions('markers', ['getUserMarkerData']),
        
    },

    created(){
		this.getUserMarkerData(this.myUserId)

    }


}
</script>

<style>

</style>