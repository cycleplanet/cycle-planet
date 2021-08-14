<template>
<div clickable class="cursor-pointer row ">
  <q-chip class="justify-center" size="md" >
    <q-avatar @click="clickedcountry">
      <img :src="('countryflags/Flag_of_'+countryKey+'.svg.png').split(' ').join('_')"  >
      <q-tooltip content-class="">{{countryKey}}</q-tooltip>
    </q-avatar>
     <q-avatar @click="clickuser">
      <img :src="users[userIdChecked].imageurl"  >
    </q-avatar>
    <div class="underline-hover" @click="clickuser">{{users[userIdChecked].fullname}}</div>
  </q-chip>
</div>
  
</template>

<script>
import { mapState, mapActions, mapGetters  } from 'vuex'

export default {
    props:['userId','countryKey'],
    data(){
      return{

      }
    },
    computed: {
		...mapGetters('auth', ['users']),
     userIdChecked(){
      if(this.users[this.userId]){
        return this.userId
      }else{
        return 'RYFRjpH3DfdWPpRfG9MIFBSPzH33'
      }
    }
    },
    methods:{

      clickuser(){
        this.$router.push('/user/'+this.userId)
      },
      clickedcountry(){
        this.$router.push('/country/'+this.countryKey)
      },
    }

}

</script>

<style>

</style>