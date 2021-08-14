<template>
  <div>
      <p class="text-h6">About me</p>
			<div v-if="userData.bio">{{userData.bio}}</div>
			<q-separator class="q-my-lg"/>

			<p class="text-h6">Interests</p>
			<p>{{userData.interests}}</p>
			<q-separator class="q-my-lg"/>
			<p class="text-h6">Countries cycled</p>		
			<div class="row no-margin">
				<div v-for="(country, countryKey) in userData.countries_cycled_new" class="no-margin" :key="countryKey">
					<modal-countrychip :countryKey="country" class="no-margin"/>
				</div>
			</div>
			<q-separator class="q-my-lg"/>

  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { firebase as firebaseConfig } from 'boot/config'

export default {
	mixins: [mixinGeneral],
	props:['userData'],
    data() {
	  	return {
	  	}
	},
    components:{
    },
	
    computed:{
      
        userId: function () {
      		return this.userData.userId
		},
		
		myProfile () {
			if(this.userId===this.myUserId){
	      		return true
			}else{
				return false
			}
		},
	
    },
    methods:{
		...mapActions('post', ['destroyData']),

    },
    
    destroyed() {//call a method when page is left
		this.destroyData()
	
    },
	created(){
		
	}

}
</script>

<style>

</style>