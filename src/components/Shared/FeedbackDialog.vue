<template>
  <q-card style="min-width: 350px" class="no-padding">
      <modal-header>Feedback</modal-header>
        <q-card-section>
          <div class="">Please tell us what is on your mind. Try to describe the feedback as detailed as possible.</div>
          <q-banner v-if="!loggedIn" rounded class="bg-orange-2 text-orange-10">You're not logged in. You can still write some feedback for us, but we won't be able to respond to you. If you want to have a response, please log in first.</q-banner>
        </q-card-section>
        <q-card-section class="bg-blue-3 q-ma-md" v-if="admin">
          <div>Only visible for admins!</div>
          <div v-for="(value, key) in platformdata" :key="key"><b>{{key}}:</b> {{value}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input type="textarea" filled dense v-model="feedback"/>
        </q-card-section>

        <q-card-actions align="right" >
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Send feedback" class="bg-secondary text-white" @click="sendFeedbackMethod" />
        </q-card-actions>
      </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { Notify } from 'quasar'

export default {
  mixins: [mixinGeneral],
  data(){
    return{
      feedback:'',
      platformdata:{}
    }
  },
  methods:{
    sendFeedbackMethod(){
      this.setItemAction({
        data:{
            issue:this.feedback,
            date:this.timeStamp,
            user:this.myUserId,
            platformdata:this.platformdata
        },
        path:'Feedback/'+this.timeStamp
      }) 
      Notify.create({
          type: 'positive',
          color: 'positive',
          timeout: 3000,
          message: 'Thanks for your feedback! We will have a look at it!'
      })
      this.feedback=''
      this.$emit('close')
    },
  },
  mounted(){
    this.platformdata={
      route:this.$route.fullPath,
      version:this.version,
      desktop:this.isWebApp,
      ios:this.isApple,
      cordova:this.isCordova,
    }
  }
}
</script>

<style>

</style>