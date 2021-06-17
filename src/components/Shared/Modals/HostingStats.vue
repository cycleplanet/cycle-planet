<template>
  <div>
    <q-item class="no-padding">
      <q-item-section>
            <q-item-label v-if="asHost||asGuest" class="text-green-9">Hosted {{asHost}} times / Guest {{asGuest}} times</q-item-label>
            <q-item-label v-else class="text-grey"></q-item-label>


            <q-item-label v-if="requestsReceived" :class="acceptRatio>75?'text-green-9':(acceptRatio>40?'text-orange':'text-red')">Accepted {{requestsAccepted}} of {{requestsReceived}} requests ({{acceptRatio}}%)</q-item-label>
            <q-item-label class="text-grey text-italic" v-if="!requestsReceived">No requests received yet.</q-item-label>

            <q-item-label v-if="feedbackReceived" :class="posFeedbackRatio>75?'text-green-9':(posFeedbackRatio>40?'text-orange':'text-red')">{{feedbackPos}} of {{feedbackReceived}} positive reviews ({{posFeedbackRatio}}%)</q-item-label>

            
           
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
   
    export default {
        mixins: [mixinGeneral],
        props:['data'],
        data(){
          return{
            requestsReceived:0,
            requestsAccepted:0,
            acceptRatio:0,

            feedbackReceived:0,
            feedbackPos:0,
            posFeedbackRatio:0,

            asHost:0,
            asGuest:0,
          }
        },
        computed:{

        },
        methods:{
          getHostNumbers(){
            if(this.data.hosting.requests){

            let refs=Object.keys(this.data.hosting.requests)
            // let requestsReceived=0
            refs.forEach((snapshot) => {
              let refKey = snapshot
              let days=this.daysToGo(this.data.hosting.requests[refKey].dateProposal)

              if(days<0){
                
                if(this.data.hosting.requests[refKey].from==='them'){
                  
                  this.requestsReceived++

                  if(this.data.hosting.requests[refKey].status==='accepted'){
                
                    this.requestsAccepted++
                    this.asHost++
                  }
                }else{
                  if(this.data.hosting.requests[refKey].status==='accepted'){
                    this.asGuest++
                  }
                }


                if(this.data.hosting.requests[refKey].wroteFeedback){
                  this.feedbackReceived++
                }
                
                if(this.data.hosting.requests[refKey].experience==='Good'){
                  this.feedbackPos++
                }

                this.acceptRatio=this.requestsAccepted/this.requestsReceived * 100

                this.posFeedbackRatio=this.feedbackPos/this.feedbackReceived * 100


              }

            })
            }

          }

        },
        mounted(){
          this.getHostNumbers()
        },
        


    }
</script>

<style>

</style>