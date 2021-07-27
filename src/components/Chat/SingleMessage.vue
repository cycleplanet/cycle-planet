<template>
    <div :style="messageItem.from === 'me'?'margin-left:30%':'margin-right:30%'">
        <q-chat-message
            :text="message"
            :sent="messageItem.from === 'me' ? true : false"
            :bg-color="messageItem.type==='request'?'amber':(messageItem.from == 'me' ? 'white' : 'light-green-2')"	
            :stamp="niceDate"
        >
        
        <div v-if="messageItem.type==='request'">
            <div v-if="messageItem.from === 'them'">
                <div v-if="messageItem.status==='unanswered'">
                    <modal-response :requestkey="messageItem.timestamp" :showEdit="false"/>
                </div>
                <div v-else-if="messageItem.status!=='deleted'">
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

    components:{
        'modal-response': require('components/Profile/Requests/ModalResponse.vue').default,
    },

    

    computed: {
		niceDate(){
            return this.niceDateMethod(this.messageItem.timestamp)
        },

        message(){
            if(this.messageItem.type==='request'){
                if(this.messageItem.status==='deleted'){
                    if(this.messageItem.from === 'me'){
                        return ['You deleted this host request']
                    }else{
                        return ['User deleted this host request']
                    }
                }else{
                    return ['HOST REQUEST: '+this.messageItem.text, 'Date: '+this.messageItem.dateProposal]
                }
            }else{
                return [this.messageItem.text]
            }
        }
    },
    methods:{
	
    }

}
</script>

<style>

</style>