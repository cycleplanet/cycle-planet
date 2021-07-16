<template>
  <div>
 <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Reports ('+Object.keys(userReports).length+')'"
    >
    <q-card  class="q-my-md q-pa-md">
          <div v-for="(item, itemKey) in userReports" :key="itemKey" >
             <q-list bordered separator :class="item.status?'bg-secondary-2':''">
              <q-item >
                <q-item-section >
                      <p>{{item.date}}</p>
                      <div >
                        <p >by {{users[item.user].fullname}}</p>
                      </div>
                  <q-item-label>
                      <p><b>Item:</b>{{item.markerId}}</p>
                  </q-item-label>
                    <q-item-label>
                      <p><b>Issue: </b> {{item.issue}}</p>
                    </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <div class="row">
                    <q-btn v-if="!item.status" dense flat @click="doneReportAction({key:itemKey})" icon="done" />
                    <q-btn v-if="item.status" dense flat @click="deleteReportAction({key:itemKey})" icon="delete" />
                    <message-user :userId="item.user"/>
                    <!-- <q-btn flat dense @click="messageDialogMethod(item.user)" icon="chat" /> -->
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
     components:{
      'message-user': require('components/Admin/Modals/MessageUser.vue').default,
    },
    computed:{
      ...mapState('admin', ['userReports']),
    },
    methods:{
      ...mapActions('admin', ['getReportsAction']),
      doneReportAction(payload){
          this.updateItemAction({
            path:'Reports/'+payload.key,
            data:{
              status:'done', 
              checkedBy:this.myUserId
            }
          })
          Notify.create('Report marked ready')
        },
      deleteReportAction(payload){
        this.deleteItemAction({
          path:'Reports/'+payload.key
        })
        Notify.create('Removed report succesfully!')
      },
    },
    
    created() {
      this.getReportsAction()
    },
}
</script>

<style>

</style>