<template>
  <div @click="clickedcountry(countryKey)">
    <img :src="('countryflags/Flag_of_'+countryKey+'.svg.png').split(' ').join('_')" >
  </div>
</template>

<script>
import { countryCodes_rev } from 'app/firebase-functions/shared/src/country-constants.js'

export default {
    props:['countryKey'],
    data(){
      return{
        countryCodes_rev:countryCodes_rev
      }
    },
    computed: {
  
    },
    methods:{
      clickedcountry(countryKey){
        this.$router.push('/country/'+countryKey)
      },
    }

}

</script>

<style>

</style>