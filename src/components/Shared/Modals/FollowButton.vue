<template>
  <div>
    <q-btn  clickable 
    :style="screenwidthbig?'width:100px':'width:80px'"
    :size="screenwidthbig?'md':'sm'"
    :class="myFollowData?(myFollowData.following?(myFollowData.following[otherUserId]?'bg-white text-secondary':'bg-secondary text-white'):'bg-secondary text-white'):'bg-secondary text-white'"
    
    :label="myFollowData?(myFollowData.following?(myFollowData.following[otherUserId]?'Following':'Follow'):'Follow'):'Follow'" 
    @click="loggedIn?
              (myFollowData?
                (myFollowData.following?
                  (myFollowData.following[otherUserId]?
                    clickUnfollow():
                    clickFollow()):
                  clickFollow()):
                clickFollow()):
             showLoginDialog()" 
    />

  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
	mixins: [mixinGeneral],
    props:['otherUserId'],
    data() {
	  	return {
	  	}
	},

    components:{

    },
    computed:{
      myFollowData (){
        return this.followData[this.myUserId]
      },
    },

    methods:{
	  	...mapActions('auth', ['setFollow','setUnfollow']),

        clickFollow(){
            this.setFollow(this.otherUserId)
        },
        clickUnfollow(){
            this.setUnfollow(this.otherUserId)
        },
    }
}
</script>

<style>

</style>