<template>
<div class="bg-white">
    <modal-header>My requests</modal-header>
    <!-- {{requestsNeedFeedback}} -->
    <div>Requests received ({{Object.keys(requestsReceived).length}})</div>
<div class="q-pa-md q-mt-md" v-if=" myUserDetails.hosting.requests?(Object.keys(requestsSend).length||Object.keys(requestsReceived).length||Object.keys(requestsNeedFeedback).length):false">
<div class="text-italic">Only you can see the data in this field.</div>
    
    <div class="cp-h2 q-my-md" v-if="Object.keys(requestsReceived).length">Host requests received ({{Object.keys(requestsReceived).length}})</div>
    <q-list v-for="(bool, key) in requestsReceived" :key="key">
        <div >
            <div v-if="requestsReceived&& myUserDetails.hosting.requests[key].from==='them'">
                    <div  :class="myUserDetails.hosting.requests[key].status==='accepted'?'bg-green-2':(myUserDetails.hosting.requests[key].status==='refused'?'bg-red-2':'bg-orange-2')">
                        <q-item>
                            <q-item-section avatar>
                                <q-avatar size="md">
                                    <img :src="users[myUserDetails.hosting.requests[key].sender].imageurl">
                                </q-avatar>
                            </q-item-section>
                            <q-item-section class="text-bold">
                                <q-item-label>
                                    <modal-username :userId="myUserDetails.hosting.requests[key].sender"/>
                                </q-item-label>
                                <q-item-label caption>{{myUserDetails.hosting.requests[key].dateProposal}} (Happens in {{daysToGo(myUserDetails.hosting.requests[key].dateProposal)}} {{daysToGo(myUserDetails.hosting.requests[key].dateProposal)>1?'days':'day'}})</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <div>Status: {{myUserDetails.hosting.requests[key].status}}</div>
                            </q-item-section>
                        </q-item>
                            <q-item v-if="myUserDetails.hosting.requests[key].status==='unanswered'" class="q-gutter-y-sm">
                                <q-item-section style="max-width:150px">
                                        <q-btn color="green" icon="done" label="accept" @click="acceptRequest(myUserDetails.hosting.requests[key])"/>  
                                </q-item-section >
                                <q-item-section style="max-width:150px">
                                        <q-btn color="red" icon="clear" label="refuse" @click="refuseRequest(myUserDetails.hosting.requests[key])"/>  
                                </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{myUserDetails.hosting.requests[key].text}}</q-item-section>
                        </q-item>
                    </div>
                    <q-separator color="black"/>
				</div>
        </div>
    </q-list>

    <div class="cp-h2 q-my-md" v-if="Object.keys(requestsSend).length">Requests sent ({{Object.keys(requestsSend).length}})</div>
   
    <q-list v-for="(bool, key) in requestsSend" :key="key">
        <div>
            <div v-if="requestsSend && myUserDetails.hosting.requests[key].from==='me'" >
                <div :class="myUserDetails.hosting.requests[key].status==='accepted'?'bg-green-2':(myUserDetails.hosting.requests[key].status==='refused'?'bg-red-2':'bg-orange-2')">
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar size="md">
                                <img :src="users[myUserDetails.hosting.requests[key].receiver].imageurl">
                            </q-avatar>
                        </q-item-section>
                        <q-item-section class="text-bold">
                            <q-item-label>
                                <modal-username :userId="myUserDetails.hosting.requests[key].receiver"/>
                            </q-item-label>
                                <q-item-label caption>{{myUserDetails.hosting.requests[key].dateProposal}} (Happens in {{daysToGo(myUserDetails.hosting.requests[key].dateProposal)}} {{daysToGo(myUserDetails.hosting.requests[key].dateProposal)>1?'days':'day'}})</q-item-label>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Status: {{myUserDetails.hosting.requests[key].status}}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>{{myUserDetails.hosting.requests[key].text}}</q-item-section>
                        <q-item-section side>
                            <q-item-label>
                                <q-btn flat round dense icon="edit" @click="editRequest(requestKey)"/>
                                <q-btn flat round dense icon="delete" @click="deleteRequest(requestKey)"/>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
                <q-separator color="black"/>
            </div>
        </div>
    </q-list>

    <div class="cp-h2 q-my-md" v-if="Object.keys(requestsNeedFeedback).length">Waiting for feedback ({{Object.keys(requestsNeedFeedback).length}})</div>
    <q-list v-for="(bool, key) in requestsNeedFeedback" :key="key">
        <div >
            <div v-if="requestsNeedFeedback&&daysToGo(myUserDetails.hosting.requests[key].dateProposal)<0&&myUserDetails.hosting.requests[key].status==='accepted'&&!myUserDetails.hosting.requests[key].wroteFeedback" class="q-mt-md">
                <q-item >
                    <q-item-section avatar>
                        <q-avatar size="md">
                            <img :src="myUserDetails.hosting.requests[key].from==='me'?users[myUserDetails.hosting.requests[key].receiver].imageurl:users[myUserDetails.hosting.requests[key].sender].imageurl">
                        </q-avatar>
                    </q-item-section>
                    <q-item-section class="text-bold">
                        <q-item-label>
                            <modal-username :userId="myUserDetails.hosting.requests[key].from==='me'?myUserDetails.hosting.requests[key].receiver:myUserDetails.hosting.requests[key].sender"/>
                        </q-item-label>
                            <q-item-label caption>{{myUserDetails.hosting.requests[key].dateProposal}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn :style="buttonStyle" style="max-width:100px" @click="addFeedbackMethod(myUserDetails.hosting.requests[key])">feedback</q-btn>
                    </q-item-section>
                </q-item>
                <q-separator color="black"/>
            </div>
        </div>
    </q-list>

        <q-dialog v-model="addFeedbackDialog" >
			<add-feedback :feedbackData="feedbackData"
			@close="addFeedbackDialog = false" 
			/>
		</q-dialog>

        <q-dialog v-model="editRequestDialog">
            <q-card v-if="editDate">
                <modal-header>Edit date</modal-header>
                <div class="q-pa-sm">
                <div >
                    <modal-due-date class="q-mt-md" :dueDate.sync="editDate" />
                </div>
                <div class="row">
                    <q-space></q-space>
                    <q-btn label="save" :style="buttonStyle" @click="saveEditDate"/>
                </div>
                </div>
            </q-card>
        </q-dialog>

	</div>
   </div>
</template>

<script>
import { date } from 'quasar'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'


export default {
	mixins: [mixinGeneral],
    data() {
	  	return {
			addFeedbackDialog:false,
            feedbackData:{},
            editRequestDialog:false,
            editDate:'',
	  	}
	},
    components:{
		'add-feedback': require('components/Profile/AddFeedback.vue').default,
		'modal-due-date': require('components/Shared/Modals/ModalDueDate.vue').default,

    },

    computed:{
        requestsReceived(){
            let totalRequests = Object.keys(this.myUserDetails.hosting.requests)
            let requestKeys={}
            totalRequests.forEach(element => {
                let days=this.daysToGo(this.myUserDetails.hosting.requests[element].dateProposal)
                if(this.myUserDetails.hosting.requests[element].from==='them'&&days>-1){
                    requestKeys[element]=true
                }
            })
            return requestKeys
        },
        requestsSend(){
            let totalRequests = Object.keys(this.myUserDetails.hosting.requests)
            let requestKeys={}
            totalRequests.forEach(element => {
                let days=this.daysToGo(this.myUserDetails.hosting.requests[element].dateProposal)
                if(this.myUserDetails.hosting.requests[element].from==='me'&&days>-1){
                    requestKeys[element]=true
                }
            })
            return requestKeys
        },
        requestsNeedFeedback(){
            let totalRequests = Object.keys(this.myUserDetails.hosting.requests)
            let requestKeys={}
            totalRequests.forEach(element => {
                let days=this.daysToGo(this.myUserDetails.hosting.requests[element].dateProposal)
                if(this.myUserDetails.hosting.requests[element].status==='accepted' && days<0 && !this.myUserDetails.hosting.requests[element].wroteFeedback){
                    requestKeys[element]=true
                }
            })
            return requestKeys
        },
        
    },
    methods:{
        ...mapActions('chat',['firebaseAcceptRequest', 'firebaseRefuseRequest']),
      
        
        addFeedbackMethod(requestData){
            this.feedbackData=requestData
            this.addFeedbackDialog=true
        },
       
       acceptRequest(requestData){
            this.firebaseAcceptRequest(requestData)
        },
        refuseRequest(requestData){
            this.firebaseRefuseRequest(requestData)
        },
        editRequest(requestKey){
            this.editRequestDialog=true
            this.editDate=this.users[this.myUserId].hosting.requests[requestKey].dateProposal
            this.editRequestKey=requestKey
        },
        saveEditDate(){
            this.updateItemAction({
                path:'Users/'+this.myUserId+'/hosting/requests/'+this.editRequestKey,
                data:{
                    dateProposal:this.editDate
                }
            })
            let otherId=this.users[this.myUserId].hosting.requests[this.editRequestKey].receiver
            this.updateItemAction({
                path:'Users/'+otherId+'/hosting/requests/'+this.editRequestKey,
                data:{
                    dateProposal:this.editDate
                }
            })
            this.editRequestDialog=false
            this.editRequestKey=''
        },
        deleteRequest(requestKey){
            this.$q.dialog({
                title: 'Delete request',
                message: 'Are you sure you want to delete this request?'
            }).onOk(() => {
                this.deleteItemAction({
                    path:'Users/'+this.myUserId+'/hosting/requests/'+requestKey,
                })
                let otherId=this.users[this.myUserId].hosting.requests[this.editRequestKey].receiver
                this.deleteItemAction({
                    path:'Users/'+otherId+'/hosting/requests/'+requestKey,
                })
            }).onCancel(() => {
            }).onDismiss(() => {
            })
        },
    }

}
</script>

<style>

</style>