<template>
  <div  :style="screenwidthbig?'padding:2px':'padding:1px'" >
    <q-chip   :size="screenwidthbig?'15px':'12px'"  clickable outline class="text-subtitle1 ">
      <q-avatar rounded style="width:auto;" class="" clickable @click="clickedcountry(countryKey)">
        <img style="border:1px solid black; margin-left:-1px" :src="('countryflags/Flag_of_'+countryKey+'.svg.png').split(' ').join('_')" >
      </q-avatar>
      <div clickable @click="clickedcountry(countryKey)">{{index+1}}. {{countryKey}}</div>
      <q-icon v-if="last &&myProfile" name="clear" size="sm" color="grey" class="q-ml-sm" @click="$emit('delete')"/>
    </q-chip>
  </div>
</template>

<script>

export default {
    props:['countryKey','index','last','myProfile'],
    data(){
      return{
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