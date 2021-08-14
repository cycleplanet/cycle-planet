<template>
  <div @click="clickedcountry(countryKey)">
    <img :src="('countryflags/Flag_of_'+countryKey+'.svg.png').split(' ').join('_')" >
  </div>
</template>

<script>

export default {
    props:['countryKey'],
    data(){
      return{
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