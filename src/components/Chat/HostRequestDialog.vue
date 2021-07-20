<template>
  <q-card class="no-padding" style="max-width: 400px">
    <form @submit.prevent="sendMessage">
      <modal-header>Host request </modal-header>
        <q-card-section class="">
          <q-banner inline-actions class="text-white bg-red" v-if="otherStatus">
            <template v-slot:avatar>
              <q-icon name="warning"/>
            </template>
            <div v-if="users[otherUserId].hosting.status!=='Available for hosting'">This user is {{users[otherUserId].hosting.status}}</div>
          </q-banner>

          <p>By sending a host request, an email will be send to the other user. The message will also appear in the chat.</p>
            <q-input dense 
            v-model="newMessage" 
            filled
            label="Description"
            type="textarea"
            name="message"
            color="teal"
            />
           	<modal-due-date class="q-mt-md"
					:dueDate.sync="dateProposal" 
					/>

          
            <div style="height:0px">
              <q-input style="width:0px" dense v-model="otherEmail" name="to_email"/>
              <q-input style="width:0px" dense v-model="myEmail" name="from_email"/>
              <q-input style="width:0px" dense v-model="myName" name="from_name"/>
              <q-input style="width:0px" dense v-model="myEmail" name="reply_to"/>
              <q-input style="width:0px" dense v-model="otherName" name="to_name"/>
              <q-input style="width:0px" dense v-model="myProfile" name="from_user"/>
              <q-input style="width:0px" dense v-model="otherProfile" name="to_user"/>
            </div>

        </q-card-section>

        <q-card-actions align="right" class="text-bg-secondary">
          <q-btn :style="buttonStyle" label="Send" type="submit"/>
        </q-card-actions>
    </form>
  </q-card>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'
import emailjs from 'emailjs-com';
import { emailjskey } from 'src/boot/config.js'

export default {
  	mixins: [mixinGeneral, ],

    props:[],

    data() {
	  	return {
            newMessage:'',
            dateProposal: '',
	  	}
    },
    components:{
		'modal-due-date': require('components/Shared/Modals/ModalDueDate.vue').default,

    },
    mounted(){
      emailjs.init(emailjskey.userkey);
    },

    computed:{
      myEmail: function () {
        return this.users[this.myUserId].email
      },
      myName: function () {
        return this.users[this.myUserId].fullname
      },
      myProfile: function () {
        return 'http://cycleplanet.org/user/'+this.myUserId
      },
      otherProfile: function () {
        return 'http://cycleplanet.org/user/'+this.$route.params.otherUserId
      },
      otherEmail: function () {
        return this.users[this.$route.params.otherUserId].email
      },
      otherName: function () {
        return this.users[this.$route.params.otherUserId].fullname
      },
      otherStatus: function () {
        let status=this.users[this.$route.params.otherUserId].hosting.status
        if(status==='Touring'){
          return 'This user is touring and is not able to host'
        }else if(status==='Not available for hosting'){
          return 'This user is not available for hosting'
        }else{
          return false
        }
      },
      otherUserId(){
        return this.$route.params.otherUserId
      }
       
    },

    methods:{
		...mapActions('chat',['firebaseGetMessages', 'firebaseStopGettingMessages','firebaseSendHostRequest']),

	    sendMessage(e) {
        const timestamp=this.timeStamp
           
          this.firebaseSendHostRequest({
              message:{
                type:'request',
                text: this.newMessage,
                from: 'me',
                timestamp:timestamp,
                read:false,
                dateProposal:this.dateProposal,
                status:'unanswered',
                response:'',
                sender:this.myUserId,
                receiver:this.$route.params.otherUserId
              },
              otherUserId:this.$route.params.otherUserId,
              senderName:this.myUserDetails.fullname,
          })
         this.newMessage=''
         this.sendEmail(e)
					this.$emit('close')
         
      },
     
      sendEmail(e) {

        try {
          emailjs.sendForm(emailjskey.servicekey, emailjskey.templatekey_hostrequest, e.target,emailjskey.userkey, )

        } catch(error) {
        }
      
      },


    }

}
</script>

<style>

</style>