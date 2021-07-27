<template>
<div>
    <q-item class="row">
        <q-space v-if="this.myUserDetails.hosting.requests[this.requestkey].receiver===myUserId"/>
        <q-item-section class="q-pa-xs bg-blue-2" style="border-radius:10px; max-width:80%">
            <div class="row">
                <modal-username2 :userId="this.myUserDetails.hosting.requests[this.requestkey].receiver"/>
            </div>
            <div class="q-ma-md">
                
                <div v-if="this.myUserDetails.hosting.requests[this.requestkey].status!=='unanswered'" class="text-italic q-my-sm">{{this.myUserDetails.hosting.requests[this.requestkey].response?this.myUserDetails.hosting.requests[this.requestkey].response:'No response'}}</div>
            </div>

            <modal-response :requestkey="requestkey" :showEdit="true"/>

            
        </q-item-section>

    </q-item>
    

</div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    mixins: [mixinGeneral],
    props:['requestkey'],
    data() {
        return {
            response:'',
            noResponse:false,
            answer:'',
            requestData:{},
            // editRequestDialog:false,
            // editDate:'',
            editResponse:false,
        }
    },
    components:{
        'modal-response': require('components/Profile/Requests/ModalResponse.vue').default,
    },
    computed:{
      
    },
    methods:{
        ...mapActions('chat',['firebaseAnswerRequest','firebaseSendMessage']),

        answerRequest(){
            console.log('X answerRequest 1',this.requestData);
            console.log('X answerRequest 2',this.answer);
            this.requestData.response=this.response
            if(this.answer==='accept'){
                 this.requestData.status='accepted'
            }else{
                 this.requestData.status='refused'
            }
            console.log('answerRequest 3',this.requestData);

            this.firebaseAnswerRequest(this.requestData)

            this.firebaseSendMessage({
				message:{
					read:true,
					text: this.response,
					from: 'me'
				},
                otherUserId:this.requestData.sender,
                senderName:this.myUserDetails.fullname
            })
            this.editResponse=false

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