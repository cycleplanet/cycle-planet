<template>
  <div>
    <q-btn flat dense @click="messageDialogMethod(item.user)" icon="chat" />

      <q-dialog v-model="messageDialog" v-if="messageDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Send message to {{users[userMessageId].fullname}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="message" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-bg-secondary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Send message" @click="sendMessageMethod" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    mixins:[mixinGeneral],
    props:['userId'],
    data(){
        return{
            message:'',
            messageDialog:false,
            userMessageId:'',
        }
    },

    methods:{
        ...mapActions('admin', ['sendMessageAction']),
      
        messageDialogMethod(userId){
         this.userMessageId=userId
         this.messageDialog=true
        },
       sendMessageMethod(){
        this.sendMessageAction({
          message:{
						text: this.message,
						from: 'me',
						timestamp:this.timeStamp
				  	},
         
          otherUserId:this.userMessageId
        })
        this.messageDialog=false

       },
    }

}
</script>

<style>

</style>