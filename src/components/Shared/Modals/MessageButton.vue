<template>
  <div v-if="loggedIn">
  
				<q-btn  
        :size="screenwidthbig?'md':'sm'"
        :to="/chat/+otherUserId" 
        :style="buttonStyle" 
        label="Message" 
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

    methods:{
       
    }
}
</script>

<style>

</style>