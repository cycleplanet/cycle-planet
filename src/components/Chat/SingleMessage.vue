<template>
    <div :style="messageItem.from === 'me'?'margin-left:30%':'margin-right:30%'">
        <q-chat-message
            :text="messageItem.type==='request'?['HOST REQUEST: '+messageItem.text, 'Date: '+messageItem.dateProposal] : [messageItem.text]"
            :sent="messageItem.from === 'me' ? true : false"
            :bg-color="messageItem.type==='request'?'amber':(messageItem.from == 'me' ? 'white' : 'light-green-2')"	
            :stamp="niceDate"
        >
        <div v-if="messageItem.type==='request'">

            <div v-if="messageItem.from === 'them'">
                <div v-if="messageItem.status==='unanswered'">
                    <q-btn color="green" icon="done" label="accept" class="q-mr-sm" @click="acceptRequest()"/>  
                    <q-btn color="red" icon="clear" label="refuse" @click="refuseRequest()"/>  
                </div>
                <div v-else>
                    <div>Status: {{messageItem.status}}</div>
                </div>
                
            </div>
            <div v-if="messageItem.from === 'me'">
                <div>Status: {{messageItem.status}}</div>
            </div>
        </div>

        </q-chat-message>
       
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    mixins: [ mixinGeneral],
    props:['messageItem'],

    

    computed: {
		niceDate(){
            return this.niceDateMethod(this.messageItem.timestamp)
            
        }
    },
    methods:{
		...mapActions('chat',['firebaseAcceptRequest', 'firebaseRefuseRequest']),
       
       acceptRequest(){
            this.firebaseAcceptRequest(this.messageItem)
        },
        refuseRequest(){
            this.firebaseRefuseRequest(this.messageItem)
        }
    }

}
</script>

<style>

</style>