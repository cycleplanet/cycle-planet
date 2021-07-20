<template>
  <div>
   <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Feedback ('+Object.keys(userFeedback).length+')'"
    >
      <q-card  class="q-my-md q-pa-md">
          <div v-for="(item, itemKey) in userFeedback" :key="itemKey">
             <q-list bordered separator :class="item.status?'bg-secondary-2':''">
              <q-item>
                <q-item-section>
                  <q-item-label>{{item.issue}}</q-item-label>
                  <q-item-label caption>{{item.user?users[item.user].fullname:'no user id'}}</q-item-label>
                  <q-item-label v-if="item.platformdata">
                    <div v-for="(value, key) in item.platformdata" :key="key"><b>{{key}}:</b> {{value}}</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <div class="row">
                    <q-btn v-if="!item.status" dense flat @click="doneFeedbackAction({key:itemKey})" icon="done" />
                    <q-btn v-if="item.status" dense flat @click="deleteFeedbackAction({key:itemKey})" icon="delete" />
                    <q-btn flat dense :to="/user/+item.user" icon="fas fa-address-card" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
    </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'
import { date, uid, Notify } from 'quasar'

export default {
    mixins:[mixinGeneral],
    data(){
        return{

        }
    },
    computed:{
      ...mapState('admin', ['userFeedback']),
    },

    methods:{
        ...mapActions('admin', ['getFeedbackAction']),
       doneFeedbackAction(payload){
          this.updateItemAction({
            path:'Feedback/'+payload.key,
            data:{
              status:'done', 
              checkedBy:this.myUserId
            }
          })
          Notify.create('Feedback marked ready')
      },
      deleteFeedbackAction(payload){
          this.deleteItemAction({
            path:'Feedback/'+payload.key
          })
          Notify.create('Removed feedback succesfully!')
      },
    },
    created() {
      this.getFeedbackAction()
    },
}
</script>

<style>

</style>