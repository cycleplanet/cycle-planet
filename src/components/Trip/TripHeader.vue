<template>
<div>
    <div v-if="userId" :style="screenwidthbig?'height:500px':'height:300px'">
        <map-trip :userId="userId" :tripKey="tripId" :showParts="true"/>
    </div>
    

    <q-card >
        <div class="q-pa-md q-gutter-y-sm">
           
            <div class="row">
                <q-btn size="sm" round :style="buttonStyle" icon="arrow_back" :to="'/user/'+userId"/>
                <q-space></q-space>
                <q-btn round icon="edit" size="sm" :style="buttonStyle" @click="editTripMethod" v-if="myProfile"/>
            </div>
            <div :class="isWebApp?'text-h4':'cp-h2'">{{tripDetails.title}}</div>
            <div class="text-grey row items-center">
            <div>by</div>  
            <modal-username2 :userId="userId"/>
            <div class="q-mx-sm">•</div>
            <div >
                <chip-status :status="tripFuture?'tripFuture':(tripActive?'tripActive':(tripFinished?'tripFinished':false))"/>
            </div>
            </div>
            <div class="text-body1 q-mt-md">{{tripDetails.summary}}</div>
        </div>
        
    </q-card>

    <q-dialog v-model="editTripDialog">
        <q-card class="no-padding" style="width:90%;max-width:400px">
        <modal-header>Edit trip</modal-header>
        <div class="q-pa-md q-gutter-y-sm" v-if="editTripDetails">
            <q-input label="title" filled v-model="editTripDetails.title"/>
            <q-input label="Summary" filled type="textarea" v-model="editTripDetails.summary"/>
            
            <div>Start date</div>
            <modal-due-date class="q-mt-md" :dueDate.sync="editTripDetails.startdate" />
           
            <div>End date</div>
            <modal-due-date class="q-mt-md" :dueDate.sync="editTripDetails.enddate" />

          
            
            <div class="row q-mt-md">
                <q-btn @click="deleteTripAction"  class="text-white bg-red" icon="delete" label="delelte trip"/>

                <q-space></q-space>
                <q-btn :style="buttonStyle" label="save" @click="saveTripAction"/>
            </div>

        </div>
        
        </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import mixinTrip from 'src/mixins/mixin-trip.js'

export default {
    mixins: [mixinGeneral,mixinTrip ],

    data () {
        return {
            editTripDialog:false,
            editTripDetails:{}
        
        }
    },

    components:{
        'map-trip' : require('components/Trip/MapTrip.vue').default,
		'modal-due-date': require('components/Shared/Modals/ModalDueDate.vue').default,
		'chip-status' : require('components/Trip/ChipStatus.vue').default,
    },
    methods:{
        editTripMethod(){
            this.editTripDetails = Object.assign({}, this.tripDetails)
            this.editTripDialog=true
        },
        deleteTripAction(){
            this.$q.dialog({
                title: 'Confirm',
                message: 'Are you sure you want to delete this trip?',
                cancel: true,
            }).onOk(() => {
                this.deleteItemAction('Users/'+this.userId+'/trips/'+this.tripId)
                this.editTripDialog=false
                this.$router.push('/user/'+this.userId)
            }).onCancel(() => {
                this.editTripDialog=false
            })
            

        }
    },
   
      

    
}
</script>

<style>

</style>