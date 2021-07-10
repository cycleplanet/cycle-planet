<template>
  <div >
    <q-chip :size="screenwidthbig?'10px':'8px'"  clickable  class="text-subtitle1 no-padding" >
      <q-avatar  style="width:auto;" clickable @click="clickedcountry(countryId)">
        <img style="margin-left:-1px" :src="('countryflags/Flag_of_'+countryId+'.svg.png').split(' ').join('_')" >
      </q-avatar>
      <div clickable @click="clickedcountry(countryId)">{{countryId}}</div>
    </q-chip>
  </div>
</template>

<script>

export default {
    props:['countryId'],
    computed: {
    screenwidthbig(){
			let screenWidth = screen.width
			if(screenWidth < 768){
				return false
			}else{return true}
		},
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