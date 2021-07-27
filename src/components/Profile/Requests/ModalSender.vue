<template>
 <q-item class="row">
    <q-space v-if="requestData.sender===myUserId"/>
    

    <q-item-section class="q-pa-xs bg-blue-2" style="border-radius:10px; max-width:80%">
        <div class="row">
            <modal-username2 :userId="requestData.sender"/>
        </div>
        <div class="q-ma-md">
            <div class="text-italic q-my-sm">{{requestData.text}}</div>
        </div>
        <div class="row" v-if="requestData.sender===myUserId">
            <q-space/>
            <q-btn flat round dense icon="edit" @click="editRequest()"/>
            <q-btn flat round dense icon="delete" @click="deleteRequestDialog=true"/>
        </div>
    </q-item-section>
    
    

    <q-dialog v-model="editRequestDialog">
        <q-card>
            <modal-header>Edit request</modal-header>
            <div class="q-pa-sm">
                <q-input filled autogrow v-model="editMessage" type="text" label="Message" />
                <modal-due-date class="q-mt-md" :dueDate.sync="editDate" />
                <div class="row">
                    <q-space></q-space>
                    <q-btn label="save" :style="buttonStyle" @click="saveEditRequest"/>
                </div>
            </div>
        </q-card>
    </q-dialog>

    <q-dialog v-model="deleteRequestDialog">
        <q-card>
            <modal-header>Delete request</modal-header>
            <div class="q-pa-md">
                <div>Are you sure you want to delete this request?</div>
                <div class="row q-mt-md">
                    <q-space></q-space>
                    <q-btn flat label="cancel" color="teal" @click="deleteRequestDialog=false" class="q-mr-sm"/>
                    <q-btn label="delete" :style="buttonStyle" @click="deleteRequest"/>
                </div>
            </div>
        </q-card>
    </q-dialog>
</q-item>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    mixins: [mixinGeneral],
    props:['requestkey'],
    data() {
        return {
            deleteRequestDialog:false,
            editRequestDialog:false,
            editDate:'',
            editMessage:'',
            requestData:{},
        }
    },
    components:{
        'modal-due-date': require('components/Shared/Modals/ModalDueDate.vue').default,
    },
    computed:{
       
    },
    

    methods:{
        editRequest(){
            this.editRequestDialog=true
            this.editDate=this.requestData.dateProposal
            this.editMessage=this.requestData.text
        },
        deleteRequest(){
            let otherId=this.requestData.receiver
            
            this.deleteItemAction({
                path:'Users/'+this.myUserId+'/hosting/requests/'+this.requestkey,
            })
            this.deleteItemAction({
                path:'Users/'+otherId+'/hosting/requests/'+this.requestkey,
            })
            this.updateItemAction({
                path:'Chats/'+this.myUserId+'/'+otherId+'/'+this.requestkey,
                data:{
                    status:'deleted'
                }
            })
            this.updateItemAction({
                path:'Chats/'+otherId+'/'+this.myUserId+'/'+this.requestkey,
                data:{
                    status:'deleted'
                }
            })
            this.deleteRequestDialog=false
           
        },
        saveEditRequest(){
            let otherId=this.requestData.receiver
          
          this.updateItemAction({
                path:'Users/'+this.myUserId+'/hosting/requests/'+this.requestkey,
                data:{
                    dateProposal:this.editDate,
                    text:this.editMessage+' (edited)'
                }
            })
            this.updateItemAction({
                path:'Chats/'+this.myUserId+'/'+otherId+'/'+this.requestkey,
                data:{
                    dateProposal:this.editDate,
                    text:this.editMessage+' (edited)'
                }
            })
            this.updateItemAction({
                path:'Users/'+otherId+'/hosting/requests/'+this.requestkey,
                data:{
                    dateProposal:this.editDate,
                    text:this.editMessage+' (edited)'
                }
            })
            this.updateItemAction({
                path:'Chats/'+otherId+'/'+this.myUserId+'/'+this.requestkey,
                data:{
                    dateProposal:this.editDate,
                    text:this.editMessage+' (edited)'
                }
            })
            this.editRequestDialog=false
        },
    },
    mounted() {
        if(this.myUserDetails.hosting.requests[this.requestkey]){
            this.requestData = Object.assign({}, this.myUserDetails.hosting.requests[this.requestkey])
        }
    }

}
</script>

<style>

</style>