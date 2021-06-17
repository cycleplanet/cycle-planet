<template>
<div class="q-pa-sm">
  <div class="text-h6">Account settings</div>

  <div class="row q-my-sm">
    <q-input disable outlined v-model="userData.email" label="Email" class=" col-xs-12 col-sm-6 col-md-4"/>
  </div>
  <div class=" q-gutter-sm">
    <q-btn  :style="buttonStyle"  icon="edit" label="change email" @click="editEmailMethod"/>
    <q-btn  :style="buttonStyle"  icon="edit" label="change password" @click="editPasswordMethod"/>
    <q-btn  color="red-3"  icon="delete_forever" label="delete account" @click="deleteAccount"/>
  </div>

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
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
export default {
    mixins: [mixinGeneral],
    props:['userData'],
      data() {
	  	return {
      newEmailDialog:false,
      newEmail:'',
	  }
  },
  
  
  components:{
    
  },
  computed:{
    
  },
  methods:{
    ...mapActions('auth', ['updateEmail','resetPassword','deleteUser']),

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
  },
}
</script>

<style>

</style>