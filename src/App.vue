<template>
  <div id="q-app" class="ownfont bg-white" >
    <router-view />
  </div>
</template>


<script>
//test2
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