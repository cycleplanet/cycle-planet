<template>
  <q-card style="min-width: 350px" class="no-padding">
      <modal-header>Feedback</modal-header>

        <q-card-section>
          <div class="">Please tell us what is on your mind. Try to describe the feedback as detailed as possible.</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input type="textarea" filled dense v-model="feedback"  @keyup.enter="sendFeedbackMethod" />
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

      }
  },

    methods:{

   
    sendFeedbackMethod(){
            this.setItemAction({
                data:{
                    issue:this.feedback,
                    date:this.timeStamp,
                    user:this.myUserId
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
    
  }

}
</script>

<style>

</style>