<template>
  <q-page class="q-pa-sm">
    <q-card class="auth-tabs">
      <q-tabs  v-model="tab" align="justify" active-color="secondary bg-teal-1" indicator-color="secondary">
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register"/>
      </q-tabs>

      <q-separator />

      <div class="row q-ma-md">
        <q-banner class="col bg-secondary text-white">
            <template v-slot:avatar>
                <q-icon name="account_circle" color="white" />
            </template>
            {{tab}} to access Cycle Planet
        </q-banner>
      </div>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <q-form @submit.prevent="submitForm" ref="myForm">
            
              
                <div class="row q-mb-md">
                  <q-input 
                  class="col" 
                  outlined 
                  type="email"
                  stack-label
                  no-caps
                  ref="email"
                  v-model="formData.email" 
                  label="Email" />
                </div>
                <div class="row q-mb-md">
                  <q-input 
                  class="col" 
                  outlined 
                  stack-label
                  
                  ref="password"
                  v-model="formData.password" 
                  type="password"
                  label="Password"
                  :rules="[ val => isValidEmailAddress || 'Please enter a valid email address']"
                  lazy-rules />
                </div>
                <div clickable class="q-ml-sm" @click="forgotPassword">
                        <p class="cursor-pointer text-blue-8">Forgot password?</p>
                    </div>
                <div class="row">
                    <div clickable class="q-ml-sm" @click="tab='register'">
                        <p class="cursor-pointer text-blue-8">No account yet? Register here</p>
                    </div>
                    
                    <q-space/>
                    
                    <q-btn
                    :style="buttonStyle"                 
                    :label="tab"
                    type="submitForm"
                    :rules="[ val => val.length >= 6 || 'Enter at least 6 characters']"
                    lazy-rules
                    >
                    </q-btn>
                </div>
            </q-form>  
        </q-tab-panel>

        <q-tab-panel name="register">
          <q-form @submit.prevent="submitForm" ref="myForm">
            
                  <q-input 
                  class="col q-mb-md" 
                  outlined 
                  type="name"
                  stack-label
                  no-caps
                  v-model="formData.name" 
                  label="Name" />
                <div class="row q-mb-md">
                  <q-input 
                  class="col" 
                  outlined 
                  type="email"
                  stack-label
                  no-caps
                  ref="email"
                  v-model="formData.email" 
                  label="Email" />
                </div>
                <div class="row q-mb-md">
                  <q-input 
                  class="col" 
                  outlined 
                  stack-label
                  
                  ref="password"
                  v-model="formData.password" 
                  type="password"
                  label="Password"
                  :rules="[ val => isValidEmailAddress || 'Please enter a valid email address']"
                  lazy-rules />
                </div>
                <div class="row items-center q-mb-md">
                  <q-toggle v-model="accept" class="col-2"/>
                  <div class="col-10">I agree to the <a v-bind:href="'/cookie-policy'" target="_blank">Cookie Policy</a> , <a v-bind:href="'/privacy-policy'">Privacy Policy</a> and <a v-bind:href="'/terms-of-use'">Terms of Use</a></div>
                </div>
               
                <div class="row">
                   
                    <q-space/>
                    <q-btn  
                    :style="buttonStyle"                  
                    :label="tab"
                    type="submitForm"
                    :rules="[ val => val.length >= 6 || 'Enter at least 6 characters']"
                    lazy-rules
                    >
                    </q-btn>
                </div>
            </q-form>  
        </q-tab-panel>
         <vue-recaptcha sitekey="6LcfDKobAAAAAJjKcuVB9_AhtU8O-IHIwLbLaUDW">
                  <button>Click me</button>
                </vue-recaptcha>
      </q-tab-panels>
    </q-card>

     <q-dialog v-model="forgotPasswordDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Uh oh, did you forget your password?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            Enter your email address below to reset your password.
        </q-card-section>
        <q-card-section class="q-pt-none">
            <q-input outlined v-model="formData.email" type="email" label="Email" />
        </q-card-section>
        <q-card-actions align="right">

          <q-btn flat label="Reset password" :style="buttonStyle" @click="sendResetPassword"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

 <q-dialog v-model="emailDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Check your email</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            We’ve sent an email to {{formData.email}} with a link to activate your account. Please also check your spam.
        </q-card-section>
        

        <q-card-actions align="right">
          <q-btn flat label="OK" :style="buttonStyle" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import {mapActions} from 'vuex'
import { date, uid, Notify } from 'quasar'
import VueRecaptcha from 'vue-recaptcha'

export default {
  	mixins: [mixinGeneral],
   
  data () {
    return {
      tab: 'register',
      emailDialog:false,
      forgotPasswordDialog:false,
      error: null,
      accept:false,
      formData:{
          email:'',
          password:'',
          name:''
      }
      
    }
  },
  components:{
    VueRecaptcha 
  },

  methods:{
      ...mapActions('auth',['registerUser','loginUser','resetPassword']),
      submitForm(){
          this.$refs.myForm.validate()
        
          if(!this.$refs.email.hasError && !this.$refs.password.hasError){
              if(this.tab=='login'){
                  this.loginUser(this.formData)
              }else{
                if (this.accept.value !== true) {
                  this.$q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message: 'You need to accept the Cookie Policy, Privacy Policy and Terms of Use'
                  })
                }else{
                  this.emailDialog=true
                  this.tab='login'
                  this.registerUser(this.formData)
                }
               
                  
              }
          }
      },
      isValidEmailAddress(email){
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(email).toLowerCase());
      },
      forgotPassword(){
          this.forgotPasswordDialog=true
      },
      sendResetPassword(){
          this.resetPassword(this.formData.email)
          this.forgotPasswordDialog=false
      }
    }
}
</script>

<style>
.auth-tabs{
    max-width: 600px;
    margin:0 auto;
}

</style>