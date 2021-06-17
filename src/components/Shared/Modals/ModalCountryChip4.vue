<template>
  <div>
    <img :src="('countryflags/Flag_of_'+countryKey+'.svg.png').split(' ').join('_')" >
  </div>
</template>

<script>

export default {
    props:['countryKey'],
    computed: {
  
    },
    methods:{
      clickedcountry(countryId){
        this.$router.push('/country/'+countryId)
      },
    }

}

</script>

<style>

</style>