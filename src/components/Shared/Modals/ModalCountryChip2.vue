<template>
  <div >
    <q-chip :size="screenwidthbig?'10px':'8px'"  clickable  class="text-subtitle1 no-padding" >
      <q-avatar  style="width:auto;" clickable @click="clickedcountry(countryKey)">
        <img style="margin-left:-1px" :src="('countryflagsnew/'+countryCodes_rev[countryKey]+'.svg')" >
      </q-avatar>
      <div clickable @click="clickedcountry(countryKey)">{{countryKey}}</div>
    </q-chip>
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
    screenwidthbig(){
			let screenWidth = screen.width
			if(screenWidth < 768){
				return false
			}else{return true}
		},
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