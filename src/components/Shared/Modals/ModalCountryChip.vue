<template>
  <div  :style="screenwidthbig?'padding:2px':'padding:1px'" >
    <q-chip   :size="screenwidthbig?'15px':'12px'"  clickable outline class="text-subtitle1 " >
      <q-avatar rounded style="width:auto;" class="" clickable @click="clickedcountry(countryId)">
        <img style="border:1px solid black; margin-left:-1px" :src="('countryflags/Flag_of_'+countryId+'.svg.png').split(' ').join('_')" >
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