<template>
<div>
  <div v-if="users&&Object.keys(userMessagesSortedByDate).length>0" class="bg-white">
      <q-list  v-for="(userSorted, key) in userMessagesSortedByDate" 
        :key="key">  
        <q-item clickable v-ripple v-if="users[key]" :to="/chat/+key">
          <q-item-section avatar >
            <q-avatar :style="buttonStyle" text-color="white">
              <img :src="users[key].imageurl">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="row">
              <q-item-label>{{users[key].fullname }}</q-item-label>
              <q-space></q-space>
              <nice-date-short class="q-ml-xs text-grey" :dateprop="userSorted[Object.keys(userSorted)[Object.keys(userSorted).length-1]].timestamp"/>
            </div>
            <div class="row">
              <q-item-label caption lines="2">{{userSorted[Object.keys(userSorted)[Object.keys(userSorted).length-1]].text}}</q-item-label>
              <q-space></q-space>
              <q-btn v-if="unreadchatlistnew?unreadchatlistnew[key]:false" class="q-mt-xs" round color="red" :label="Object.keys(unreadchatlistnew[key]).length" size="xs"/>
            </div>
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
      </q-list>

      <div v-if="Object.keys(userMessagesSortedByDate).length===0">
        <q-card class="q-mb-md q-pa-md bg-green-3" >
          <p>Messages with other users will appear in this list. With messages, you can send host requests to other users.</p>
        </q-card>
        <q-list >
          <q-item clickable v-ripple to="/chat/RYFRjpH3DfdWPpRfG9MIFBSPzH33">
            <q-item-section avatar>
              <q-avatar :style="buttonStyle" text-color="white">
                <img :src="users['RYFRjpH3DfdWPpRfG9MIFBSPzH33'].imageurl">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{users['RYFRjpH3DfdWPpRfG9MIFBSPzH33'].fullname }}</q-item-label>
              <q-item-label caption lines="2">Write your first message to Cycle Planet and let us know what you think of the platform ;)</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
  </div>
  <div v-else class="bg-white absolute-full text-center">
    <div class="constrain">
      <img   style="max-width: 100%; margin-top:20px " src="https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/Admin%2Fvectors%2FMessages.png?alt=media&token=c0c226ee-2aa8-4597-93ee-3a15a9afdc4a">
      <div class="text-center bg-white" style="font-size: 35px;" >
      Uh oh, it looks like you don't have any messages yet...
      </div>
    </div>
    
  </div>
</div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapGetters } from 'vuex'

	export default {
    mixins: [mixinGeneral],
    data () {
      return {

      }
    },
  
    computed: {
		...mapGetters('chat', ['unreadchatlistnew','userMessagesSortedByDate']),

      messagepresentcomputed: function () {
        if(Object.keys(this.userMessagesSortedByDate).length>0){
          return true
        }else{
          return false
        }
		  },

    },
  
     mounted() {
        this.$store.dispatch("chat/firebaseGetUsers").then(response => {
        }, error => {
      })
    },

	}
</script>

<style>
</style>
