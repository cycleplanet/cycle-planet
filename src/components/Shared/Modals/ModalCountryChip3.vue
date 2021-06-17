<template>
  <div  :style="screenwidthbig?'padding:2px':'padding:1px'" >
    <q-chip   :size="screenwidthbig?'15px':'12px'"  clickable outline class="text-subtitle1 ">
      <q-avatar rounded style="width:auto;" class="" clickable @click="clickedcountry(countryId)">
        <img style="border:1px solid black; margin-left:-1px" :src="('countryflags/Flag_of_'+countriesAll[countryId].name+'.svg.png').split(' ').join('_')" >
      </q-avatar>
      <div clickable @click="clickedcountry(countryId)">{{index+1}}. {{countryId}}</div>
      <q-icon v-if="last &&myProfile" name="clear" size="sm" color="grey" class="q-ml-sm" @click="$emit('delete')"/>
    </q-chip>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters  } from 'vuex'
// import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
  	// mixins: [mixinGeneral],
    props:['countryId','index','last','myProfile'],
    computed: {
		...mapGetters('countries', ['countriesAll','country_likes','countriesFiltered']),
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