<template>
  <div >
    <q-chip :size="screenwidthbig?'10px':'8px'"  clickable  class="text-subtitle1 no-padding" >
      <q-avatar  style="width:auto;" clickable @click="clickedcountry(countryId)">
        <img style="margin-left:-1px" :src="('countryflags/Flag_of_'+countriesAll[countryId].name+'.svg.png').split(' ').join('_')" >
      </q-avatar>
      <div clickable @click="clickedcountry(countryId)">{{countryId}}</div>
    </q-chip>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters  } from 'vuex'

export default {
    props:['countryId'],
    computed: {
		...mapGetters('countries', ['countriesAll','countriesFiltered']),
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