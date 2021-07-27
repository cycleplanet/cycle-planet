<template>
  <div id="q-app" class="ownfont bg-grey-2" >
    <router-view />
  </div>
</template>


<script>
import {mapActions} from 'vuex'

export default {
  methods:{
    ...mapActions('auth',['handleAuthStateChange','loadBaseData','loadSecondaryData'])
  },
  mounted(){
    this.handleAuthStateChange()
    this.loadBaseData()
    this.loadSecondaryData()

    
  }
}
</script> 

<style >
.ownfont{
	font-family: 'customfont';
}
.text-strikethrough{
  text-decoration: line-through;
}
</style>