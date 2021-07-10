<template>
<div>
    <q-card style="min-width:90%;max-width:400px;width:500px">
        <modal-header>My markers</modal-header>
        <q-list bordered class="rounded-borders">
            <div v-for="(marker, itemKey) in userMarkerData" :key="itemKey">
                <q-expansion-item expand-separator 
                :class="marker.status==='approved'?'bg-green-2 text-green-10':(marker.status==='disapproved'?'bg-red-2 text-red-10':'bg-orange-2 text-orange-10')"
                >
                <template v-slot:header>
                    <q-item-section avatar>
                        <q-avatar :icon="marker.status==='approved'?'check_circle':(marker.status==='disapproved'?'remove_circle_outline':'pending')">
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <div class="row"> 
                        <marker-title :singleItemData="marker"/>
                        {{' ('+(marker.checked_by?Object.keys(marker.checked_by).length:0)+'/3)'}}</div>
                      
                      <div class="row">
                        <modal-countrychip2 :countryId="marker.countryKey"/>
                        <div>{{markerlist[marker.refKey].title}}</div>
                      </div>
                    </q-item-section>
                </template>
                <div class="bg-white text-black q-pa-sm">
                    <div><b>Status: </b>{{marker.status?marker.status:'Pending (but visible)'}}</div>
                    <div v-if="marker.countryKey" class="row items-center"><b>Country:</b> <modal-countrychip2 :countryId="marker.countryKey" class="q-ml-sm"/></div>
                    <div><b>Description:</b><div v-html="marker.description"></div></div>
                    <q-btn :style="buttonStyle" @click="openItem(marker)">See more</q-btn>
                </div>
                </q-expansion-item>

            </div>
        </q-list>

    </q-card>

    <q-dialog :maximized="!isWebApp" v-model="itemDialog">
			<item-dialog  v-if="itemDetails"
			:singleItemData="itemDetails"
			@close="itemDialog = false" 
			/>
		</q-dialog>
      
      
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'


export default {
	mixins: [mixinGeneral],
	
	data() {
	  	return {
        itemDialog:false,
        itemDetails:{},
      }
    },

    components:{
		  'item-dialog':		require('components/Marker/ItemDialog.vue').default,
    },

    computed:{
		...mapState('markers', ['userMarkerData']),


    },
    methods:{
		...mapActions('markers', ['getUserMarkerData']),

      openItem(listItem){
          this.itemDetails=listItem
          this.itemDialog=true
      },
    },

    created(){
		this.getUserMarkerData(this.myUserId)

    }


}
</script>

<style>

</style>