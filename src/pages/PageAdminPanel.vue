<template>
  <q-page v-if="loggedIn && teamMember" class="q-pa-sm q-gutter-y-sm">
    <p class="q-mx-md text-h4">Admin panel</p>
    <q-btn @click="backupmarkers()">Backup markers</q-btn>


    <!-- General -->
    <q-card padding class="q-mb-md q-pa-md" v-if="loggedIn?admin:false">
      <div class="text-bold">This block is only shown for admins</div>
      <div>loggedIn:{{loggedIn}}</div>
      <div>isWebApp:{{isWebApp}}</div>
      <div>isCordova:{{isCordova}}</div>
      <div>timeStamp:{{timeStamp}}</div>

    </q-card>

    <!-- TEAM -->
    <q-card class="q-pa-sm">
        <div class="text-h4 q-mt-md">Team</div>
      <div>
        <div class="cp-h2 q-mt-md">Admin</div>
      </div>
      <div class="row q-mt-sm">
        <div v-for="(user, userId) in users" :key="userId">
          <div v-if="user.role==='admin'" >
            <modal-username3 :userId="userId"/>
          </div>
        </div>
      </div>

      <div>
        <div class="cp-h2 q-mt-md">Team members</div>
      </div>
      <div class="row q-mt-sm">
        <div v-for="(user, userId) in users" :key="userId">
          <div v-if="user.role==='team'" >
            <modal-username3 :userId="userId"/>
          </div>
        </div>
      </div>

      <div>
        <div class="cp-h2 q-mt-md">Editors</div>
      </div>
      <div class="row q-mt-sm">
        <div v-for="(user, userId) in users" :key="userId">
          <div v-if="user.role==='editor'" >
            <modal-username3 :userId="userId"/>
          </div>
        </div>
      </div>
    </q-card>

    <!-- NOTES -->
    <q-card >
      <q-list bordered padding>
        <q-item-label header class="text-black cp-h2 row">
          <div class="q-mr-md">
          Notes
          </div>
          
            <q-btn flat v-if="loggedIn ?teamMember:false" label="edit" @click="editPageMethod('Admin')"/>

        </q-item-label>
          <q-item >

            <q-item-section v-html="getPages.Admin.section1" >
              
          </q-item-section>
        </q-item>

      </q-list>
    </q-card>

    <!-- PAGES -->
    <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Pages ('+Object.keys(getPages).length+')'"
    >
      <q-card  class="q-my-md q-pa-md">
          <div v-for="(item, itemKey) in getPages" :key="itemKey">
             <q-list bordered separator :class="item.status?'bg-secondary-2':''">
              <q-item>
                <q-item-section>
                  <q-item-label>{{itemKey}}</q-item-label>
                  <!-- <q-item-label caption>{{users[item.user].fullname}}</q-item-label> -->
                  
                </q-item-section>
                <q-item-section side top>
                  <div class="row">
                    <q-btn  dense flat @click="editPageMethod(itemKey)"
                    icon="edit" />
                   
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
      </q-card>
    </q-expansion-item>

    <!-- FEDDBACK -->
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
                  
                </q-item-section>
                <q-item-section side top>
                  <div class="row">
                    <q-btn v-if="!item.status" dense flat @click="doneFeedbackAction({key:itemKey})"
                    icon="done" />
                    <q-btn v-if="item.status" dense flat @click="deleteFeedbackAction({key:itemKey})"
                    icon="delete" />
                    <q-btn flat dense @click="messageDialogMethod(item.user)"
                    icon="chat" />
                    <q-btn flat dense :to="/user/+item.user"
                    icon="fas fa-address-card" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
    </q-card>
    </q-expansion-item>

    <!-- APPLICATIONS -->
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
                  <q-item-label class="text-h6">{{users[item.user].fullname}}</q-item-label>
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
                  
                    <q-btn flat dense @click="messageDialogMethod(item.user)"
                    icon="chat" />
                    <q-btn flat dense :to="/user/+item.user"
                    icon="fas fa-address-card" />
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

    <!-- REPORTS -->
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
                    <q-btn v-if="!item.status" dense flat @click="doneReportAction({key:itemKey})"
                    icon="done" />
                    <q-btn v-if="item.status" dense flat @click="deleteReportAction({key:itemKey})"
                    icon="delete" />
                    <q-btn flat dense @click="messageDialogMethod(item.user)"
                    icon="chat" />
                    <q-btn flat dense :to="/user/+item.user"
                    icon="fas fa-address-card" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
    </q-card>
    </q-expansion-item>

    <!-- USERS -->
    <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Users ('+Object.keys(users).length+')'"
    >
    <q-card  class="q-my-md q-pa-md">
      Sorted by last login, red has no coordinates.
          <div v-for="(user, itemKey) in usersSortedByLastLogin" :key="itemKey" >
             <q-list bordered separator class="full-width" :class="!user.coordinates?'bg-red-2':'bg-green-2'">
               <q-expansion-item>
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="user.imageurl">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{user.fullname}}</q-item-label>
                    <q-item-label caption >{{user.userId}}</q-item-label>
                    <q-item-label caption >last login {{user.online_date}}</q-item-label>
                  </q-item-section>
                   <q-item-section side>
                    <q-btn flat icon="more_vert">
                      <q-menu>
                        <q-list style="min-width: 100px">
                          <q-item clickable v-close-popup>
                            <q-item-section> 
                              <modal-follow-button :otherUserId="user.userId"/>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup @click="messageDialogMethod(user.userId)">
                            <q-item-section>chat</q-item-section>
                          </q-item>
                          <q-separator />
                          <q-item clickable v-close-popup>
                            <q-item-section>Profile</q-item-section>
                          </q-item>
                        
                        </q-list>
                      </q-menu>

                    </q-btn>
                  </q-item-section>

                  
                </template>

                <q-card>
                  <q-card-section>
                    <div v-for="(item, key) in user">
                      <b>{{key}}:</b> {{item}}
                    </div>
                    <div class="row">
                    
                    <q-btn flat dense 
                    icon="chat" :to="/chat/+user.userId"/>
                    <q-btn flat dense :to="/user/+user.userId"
                    icon="fas fa-address-card" />
                     <q-btn flat dense 
                    icon="edit" @click=" editProfileMethod(user.userId)"/>
                  </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>


              
            </q-list>
          </div>
    </q-card>
    </q-expansion-item>
    
    <!-- COUNTRIES -->
     <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Countries ('+Object.keys(countriesAll).length+')'"
    >
    <q-card  class="q-my-md q-pa-md">
          <div v-for="(country, countryKey) in countriesAll" :key="countryKey" >
            <div :class="countryCodes_rev[countryKey]?'bg-green-2':'bg-red-2'">
              {{countryKey}} - {{countryCodes_rev[countryKey]}}
            </div>
          </div>
    </q-card>
    </q-expansion-item>

     <!-- MARKERS -->
     <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Markers ('+Object.keys(landMarkers).length+')'"
    >
      <div>The markers are sorted by date (newest first)</div>
   
      <q-card  class="q-my-md q-pa-md">
        <div v-for="(item, itemKey) in landMarkersSorted" :key="itemKey">
          {{item}}
          <q-expansion-item expand-separator 
                :label="item.refKey==='Border_item'?item.country1.country+' - '+item.country2.country:(item.refKey==='Embassy'?'visa '+item.countryKey+' - '+item.country_located:item.title)"
                :caption="markerlist[item.refKey].title"
                :class="item.coordinates&&(item.refKey==='Border_item'?true:countriesAll[item.countryKey])?'bg-green-2 text-green-10':'bg-red-2 text-red-10'"
                >
                <div class="bg-white text-black ">
                  <div>
                    <div class="row flex items-center">by <modal-username2 :userId="item.user_created"/></div>
                    <div class="text-h6">Checks</div>
                    <div>Has coordinates:{{item.coordinates?true:false}}</div>
                    <div>Country name correct?:{{(item.refKey==='Border_item'?true:countriesAll[item.countryKey])?true:false}}</div>
                   
                    <div v-if="item.refKey==='Border_item'?false:!countriesAll[item.countryKey]">
                      <q-select filled :options="Object.keys(countriesAll)" v-model="changeCountryKey"  behavior="menu" />
                      <q-btn @click="changeMarkerCountry(item.itemKey,changeCountryKey)" label="save"/>
                    </div>
                  </div>
                  <q-separator></q-separator>
                  <div class="row">
                    <div class="text-h6">Data</div>
                  </div>
                  
                  <div  v-for="(childitem,childitemKey) in item" :key="childitemKey" class="q-ma-sm">
                      <div><b>{{childitemKey}}:</b>{{childitem}}</div>
                  </div>
                  
               

                </div>
         
          </q-expansion-item>
        </div>
     
      </q-card>
    </q-expansion-item>

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

    <q-dialog v-model="editPage" :maximized="maximizedToggle">
      <edit-page :title="pageItemKey" :data="getPages[pageItemKey]" @close="editPage = false" />
    </q-dialog>

    <q-dialog v-model="editProfile">
      <edit-profile :userData="this.userData"  @close="editProfile = false" />
    </q-dialog>

  </q-page>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'
import { date, uid, Notify } from 'quasar'
import { firebase } from 'boot/config'

export default {
  	mixins: [mixinGeneral, ],
    props:[],
    data() {
	  	return {
        group: 'op1',
        optionsMarkers: [
        {
          label: 'Check coordinates',
          value: 'op1'
        },
        {
          label: 'Check country',
          value: 'op2'
        },
        
      ],
        
        editPage: false,
        editMarker:false,
        changeCountryKey:'',
        maximizedToggle: true,
        pageItemKey:'',
        messageDialog:false,
        userMessageId:'',
        message:'',
        editProfile:false,
        userData:{},
       
        
        }
    },
    components: {
      'edit-page': require('components/Shared/EditPage.vue').default,
      'modal-follow-button': require('components/Shared/Modals/FollowButton.vue').default,
      'edit-profile': require('components/Admin/EditProfile.vue').default,
    },
    computed:{
      ...mapState('admin', ['userFeedback','userReports','userApplication']),
      ...mapState('countries', ['countryCodes','countryCodes_rev']),

      ...mapGetters('auth', ['usersSortedByLastLogin']),
      ...mapGetters('other', ['getPages']),
      ...mapGetters('markers', ['landMarkersSorted']),
    },
    methods:{
        ...mapActions('admin', ['getFeedbackAction','getApplicationAction','getReportsAction','sendMessageAction','rejectEditorAction']),
        ...mapActions('markers', ['backupFirestoreMarkers']),

        doneFeedbackAction(payload){
          this.updateItemAction({
            path:'Feedback/'+payload.key,
            data:{
              status:'done', 
              checkedBy:this.userId
            }
          })
          Notify.create('Feedback marked ready')
      	},
        doneReportAction(payload){
          this.updateItemAction({
            path:'Reports/'+payload.key,
            data:{
              status:'done', 
              checkedBy:this.userId
            }
          })
          Notify.create('Report marked ready')
        },
        
        deleteFeedbackAction(payload){
          this.deleteItemAction({
            path:'Feedback/'+payload.key
          })
          Notify.create('Removed feedback succesfully!')
      	},

        deleteReportAction(payload){
          this.deleteItemAction({
            path:'Reports/'+payload.key
          })
          Notify.create('Removed report succesfully!')
        },

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
            path:'countries/' + data.country + '/contactperson/' +data.user,
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
       editPageMethod(itemKey){
         this.pageItemKey=itemKey
         this.editPage=true
       },
       editProfileMethod(userKey){
         this.userData=this.users[userKey]
         this.editProfile=true
       },
       backupmarkers(){
         this.backupFirestoreMarkers()
       },
       changeMarkerCountry(itemKey,countryKey){
         firebase.fs.collection('Markers').doc(itemKey).update({countryKey:countryKey})
         this.changeCountryKey=''
       }
        
    },
   
    created() {
      this.getFeedbackAction()
      this.getReportsAction()
      this.getApplicationAction()
    },
    destroyed() {//call a method when page is left
    
    },
    watch:{// the watch is triggered after each message
        
    },


}


</script>

<style>

</style>