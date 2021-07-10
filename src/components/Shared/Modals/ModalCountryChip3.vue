<template>
  <div  :style="screenwidthbig?'padding:2px':'padding:1px'" >
    <q-chip   :size="screenwidthbig?'15px':'12px'"  clickable outline class="text-subtitle1 ">
      <q-avatar rounded style="width:auto;" class="" clickable @click="clickedcountry(countryId)">
        <img style="border:1px solid black; margin-left:-1px" :src="('countryflags/Flag_of_'+countryId+'.svg.png').split(' ').join('_')" >
      </q-avatar>
      <div clickable @click="clickedcountry(countryId)">{{index+1}}. {{countryId}}</div>
      <q-icon v-if="last &&myProfile" name="clear" size="sm" color="grey" class="q-ml-sm" @click="$emit('delete')"/>
    </q-chip>
  </div>
</template>

<script>

export default {
    props:['countryId','index','last','myProfile'],
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