<template>
  <div>
   <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Applications ('+Object.keys(userApplication).length+')'"
    >
      <q-card  class="q-my-md q-pa-md">
          <div v-for="(item, itemKey) in userApplication" :key="itemKey">
             <q-list bordered separator >
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{item.user?users[item.user].fullname:'no userid'}}</q-item-label>
                  <q-item-label class="text-bold">Date:</q-item-label>
                  <q-item-label>{{item.date}}</q-item-label>
                  <q-item-label class="text-bold">Country:</q-item-label>
                  <q-item-label>{{item.country}}</q-item-label>
                  <q-item-label class="text-bold">motivation:</q-item-label>
                  <q-item-label>{{item.motivation}}</q-item-label>
                  <q-item-label class="text-bold">experience:</q-item-label>
                  <q-item-label>{{item.experience}}</q-item-label>
                  <q-item-label class="text-bold">role:</q-item-label>
                  <q-item-label>{{item.role}}</q-item-label>
                  
                </q-item-section>
                <q-item-section side top>
                  <div class="row">
                    <message-user :userId="item.user"/>
                    <q-btn flat dense :to="/user/+item.user" icon="fas fa-address-card" />
                   
                  </div>
                    <q-btn dense flat @click="acceptEditorAction(itemKey)"
                    icon="done" label="accept" class="bg-green-2 text-green q-ma-xs" />
                    <q-btn dense flat @click="rejectEditorAction(itemKey)"
                    icon="delete" label="reject" class="bg-red-2 text-red q-ma-xs"/>
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
      ...mapState('admin', ['userApplication']),
    },
    methods:{
        ...mapActions('admin', ['getApplicationAction']),
      acceptEditorAction(itemKey){
          let data=this.userApplication[itemKey]
		      let message="Hello, we just reviewed your application and we want to let you know that we accepted your application, so congratulations! ;) From now on you have more edit options. Please make sure to not abuse this role, see also our guidelines. If you have any questions, please let us know. Welcome to the team, together we can make something beautiful! Best, the Cycle Planet team"
          this.updateItemAction({
            path:'Users/'+data.user,
            data:{role:data.role}
          })
          this.setItemAction({
            path:'Chats/' + this.myUserId + '/' +data.user+'/'+this.timeStamp,
            data:{
              text:message,
              from:"me",
              read:true,
              timestamp:this.timeStamp
            }
          })
          this.setItemAction({
            path:'Chats/' + data.user + '/' +this.myUserId+'/'+this.timeStamp,
            data:{
              text:message,
              from:"them",
              read:false,
              timestamp:this.timeStamp
            }
          })
          this.setItemAction({
            path:'Country_data/' + data.country +'countries/contactperson/' +data.user,
            data:true
          })
          this.deleteItemAction({
            path:'Application/'+itemKey
          })
        },
        rejectEditorAction(itemKey){
           let data=this.userApplication[itemKey]
          this.deleteItemAction({
            path:'Application/'+itemKey
          })
          
          let message="Hello, we just reviewed your application and we want to let you know that we rejected your application. Unfortunately we're not convinced (yet) that you can contribute useful information for our platform. Feel free to ask us for more explaination, and perhaps we can give it another try. Best, the Cycle Planet team"
          this.setItemAction({
            path:'Chats/' + this.myUserId + '/' +data.user+'/'+this.timeStamp,
            data:{
              text:message,
              from:"me",
              read:true,
              timestamp:this.timeStamp
            }
          })
          this.setItemAction({
            path:'Chats/' + data.user + '/' +this.myUserId+'/'+this.timeStamp,
            data:{
              text:message,
              from:"them",
              read:false,
              timestamp:this.timeStamp
            }
          })
      },
    },
    created() {
      this.getApplicationAction()
    },
}
</script>

<style>

</style>