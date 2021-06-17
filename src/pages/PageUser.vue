<template>
  <div>
	  <user-page :userData="users[userId]"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

	computed:{
		...mapState('auth', ['users']),

		userId(){
			return this.$route.params.otherUserId
		}
	},
	
	components:{
		'user-page': require('components/Profile/UserPage.vue').default,
    },


}
</script>

<style>

</style>