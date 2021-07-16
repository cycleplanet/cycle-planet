<template>
  <transition
  appear
  enter-active-class="animated zoomIn"
  leave-active-class="animated zoomOut absolute-top"
	>
    <q-card class="no-padding" style="width:100% ">
      <modal-header>Add route post</modal-header>
        <q-card-section class="q-gutter-y-sm">
          <q-banner rounded class="bg-orange-2 text-orange-10">All logged in users can add their own blog posts, but please make sure to follow our <span class="underline cursor-pointer" @click="clickGuidelines()">guidelines</span>.
          </q-banner>
          <q-select filled v-model="countriesSelected" multiple :options="countryKeys" use-chips stack-label label="Select countries" behavior="menu"/>

          <q-input outlined  filled v-model="title" label="Route title *" lazy-rules :rules="[ val => val && val.length > 0 || 'Please type something']"/>
          <q-input outlined  filled v-model="description" label="Route description*" lazy-rules :rules="[ val => val && val.length > 0 || 'Please type something']"/>
        
          <div class="cp-h2">Select gpx file</div>
          <input id="image-file" type="file" @change="onFileChange" accept=".gpx"/>
          
        </q-card-section>

        <q-card-actions v-if="downloadURL" align="right" class="q-ml-sm">
          <q-btn label="Submit" :style="buttonStyle" @click="onSubmit" />        
        </q-card-actions >

    
    </q-card>
  </transition>       
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import firebase from 'firebase'
import { uid } from 'quasar'

export default {
  mixins: [mixinGeneral],
    
  data() {
    return {
      countriesSelected:[],
      title:'',
      description:'',
      downloadURL:'',
      url2:'',
      uploadValue:'',
    }
  },

  computed:{

  },

  components:{

},

  methods:{

    onFileChange(e) {
      this.fileData = e.target.files[0]
      this.downloadURL = URL.createObjectURL(this.fileData);
    },

  
    onSubmit(){
    let countriessorted={}
    this.countriesSelected.forEach(element => {
      countriessorted[element]=true
    })
    let pathStorage = 'routes/'+this.myUserId+'/'+this.fileData.name
    const storageRef=firebase.storage().ref(pathStorage).put(this.fileData)
      storageRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error=>{
      },
      ()=>{
        this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url)=>{
          this.url2 =url;
					let postuid=uid()
          this.setItemAction({
            path:'Posts/'+postuid,
            data:{
              file:url,
              refKey:'Route',
              countries:countriessorted,
              date_created:this.timeStamp,
              postKey:postuid,
              title:this.title,
              description:this.description,
              user_created:this.myUserId


            }
          })
          this.$emit('close')

        })
        })
        }
  }
}
</script>

<style>

</style>