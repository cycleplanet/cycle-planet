<template>
  <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut absolute-top"
    >
    <q-layout view="Lhh lpR fff" container class="bg-white">
        
      <div style=" height:75%">
        <form @submit.prevent="editProfileSubmit">
          <q-header class="bg-secondary">
             <q-toolbar>
            <q-toolbar-title >Edit profile</q-toolbar-title>
            <q-btn class="q-mr-md" label="Save" type="submit" />
            <q-btn flat v-close-popup round dense icon="close" />
        
          </q-toolbar>

          <q-tabs
              v-model="edit_tab"
              dense
              class="text-grey"
              active-color="black"
              indicator-:style="buttonStyle"
              align="justify"
              
            >
              <q-tab name="edit_about" label="About"/>
              <q-tab name="edit_hosting" label="Hosting" />
            </q-tabs>

          </q-header>
          <q-page-container>
            <q-page class="q-pa-sm">
           
            <q-tab-panels v-model="edit_tab" animated>
              <q-tab-panel name="edit_about" class="q-gutter-y-md q-gutter-y-md " >

                <p class="text-h6 q-mb-none q-mt-md">General</p>
                  <div class="row">
                    <p class="q-mb-none q-mt-md">Background image</p>
                    <q-btn flat round icon="edit" @click="editimage('background')"/>
                  </div>
                  <q-img v-if="userData.backgroundimageurl" :src="userData.backgroundimageurl"  :ratio="16/9"/>
                  <div class="row">
                    <p class="q-mb-none q-mt-md">Profile image</p>
                    <q-btn flat round icon="edit" @click="editimage('profile')"/>
                  </div>          
                  <q-avatar size="94px">
                    <q-img v-if="userData.imageurl" :src="userData.imageurl"/>
                  </q-avatar>
                <q-input filled v-model="userData.fullname" label="Name"  />
                <q-input filled v-model="userData.phonenumber" type="tel" label="Phone number" />
                <q-input disable filled v-model="userData.email" label="Email" />
                <div class="row q-gutter-sm">
                  <q-btn :style="buttonStyle" icon="edit" label="change email" @click="editEmailMethod"/>
                  <q-btn :style="buttonStyle"  icon="edit" label="change password" @click="editPasswordMethod"/>
                  <q-btn color="red-3"  icon="delete_forever" label="delete account" @click="deleteAccount"/>
                </div>

                <p class="text-h6 q-mb-none q-mt-md">About</p>
                <q-input filled type="textarea" autogrow v-model="userData.bio" label="About me" />
                <q-input filled type="textarea" autogrow v-model="userData.interests" label="Interests" />
                <q-input filled type="textarea" autogrow v-model="userData.countries_cycled" label="Countries cycled" />
                <q-select
                  filled
                  v-model="userData.countries_cycled_new"
                  multiple
                  :options="countryKeys"
                  use-chips
                  stack-label
                  label="Countries cycled"
                />
                <q-input filled type="textarea" autogrow v-model="userData.gear_list" label="Gear" />
              
                <p class="text-h6 q-mb-none q-mt-md">Social links</p>
                <q-input filled v-model="userData.website" label="Website" hint="https://www.yourblog.com/..."/>
                <q-input filled v-model="userData.facebook" label="Facebook" hint="https://www.facebook.com/..." />
                <q-input filled v-model="userData.instagram" label="Instagram username"/>
                <q-input filled v-model="userData.youtube" label="Youtube" hint="https://www.youtube.com/..."/>
              </q-tab-panel>


              <q-tab-panel name="edit_hosting" class="q-gutter-y-md" style="max-width: 450px">
                  <q-select filled outlined v-model="userData.hosting.status" :options="options" label="Status" use-input behavior="menu" />
                  <p class="text-h6 q-mb-none q-mt-md">Describe your home</p>
                  <q-input filled autogrow v-model="userData.hosting.description" label="Describe what guests can expect" type="textarea" />
                  <q-input filled v-model="userData.hosting.max_guests" label="Max. guests" />
                  <q-toggle v-model="userData.hosting.pets_allowed" label="Pets allowed?" />
                  <q-toggle v-model="userData.hosting.bike_inside" label="Bike can be stored inside?" />
              </q-tab-panel>

            </q-tab-panels>
            </q-page>
          </q-page-container>
          
        </form>

        <q-dialog v-model="editBackgroundForm">
          <edit-background :type="type" :userData="userData" @close="editBackgroundForm = false" />
        </q-dialog>

        <q-dialog v-model="newEmailDialog" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Your new email address</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input filled dense v-model="newEmail" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-actions align="right" class="text-bg-secondary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Update" @click="editEmailMethod2" />
            </q-card-actions>
          </q-card>
        </q-dialog>
    
        
    </div>
    </q-layout>
  </transition>       
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
  props:['userData'],
    mixins: [mixinGeneral],
    
     data() {
	  	return {
      edit_tab: 'edit_about',
      editBackgroundForm:false,
      newEmailDialog:false,
      newEmail:'',
      inputOtherUserDetails:{},
      model: null,
      type:'',
      options: [
          'Available for hosting', 'Not available for hosting', 'Touring'
      ]
	  }
  },
  computed:{
    initialimage () {
      this.userData.backgroundimageurl
		},
  },
  
  components:{

  },
  methods:{
    ...mapActions('auth', ['updateEmail','resetPassword','deleteUser']),
    editProfileSubmit() {
      
      this.updateItemAction({
          data:this.userData,
          path:'Users/'+this.myUserId
      })
      this.$emit('close')
    },
    editimage(type){
        this.type=type
        this.editBackgroundForm=true
    },
    editPasswordMethod(){
      this.$q.dialog({
                title: 'Reset password',
                message: 'Are you sure you want to reset your password?',
                ok: {
                    push: true,
                    label:'Yes'
                },
                cancel: true,
                persistent: true
            }).onOk(data => {
            this.resetPassword(this.userData.email)
            })
    },
    editEmailMethod(){
      this.$q.dialog({
                title: 'Confirm',
                message: 'Are you sure you want to change your email? You will be logged out, so make sure you saved your last changes.',
                ok: {
                    push: true,
                    label:'Yes'
                },
                cancel: true,
                persistent: true
            }).onOk(data => {
            this.newEmailDialog=true
            })
    },
    editEmailMethod2(){
      this.updateEmail({
        newEmail:this.newEmail
      })
      this.newEmailDialog=false
      this.newEmail=''
      this.$router.push({path: '/auth'})
    },
    deleteAccount(){
       this.$q.dialog({
                title: 'Confirm',
                message: 'Are you sure you want to delete your account permanently? All your data will be deleted.',
                ok: {
                    push: true,
                    label:'Yes'
                },
                cancel: true,
                persistent: true
            }).onOk(data => {
            this.deleteUser()
            })
    },
  }
}
</script>

<style>
</style>