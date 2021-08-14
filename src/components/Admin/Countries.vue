<template>
  <div>
  <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Countries ('+Object.keys(countryConstants).length+')'"
    >
    <q-card  class="q-my-md q-pa-md">
          <div v-for="countryCode in countryConstants" :key="countryKey" >
            <div :class="getCountryData(countryCode).fullName?'bg-green-2':'bg-red-2'">
              {{countryCode}} - {{getCountryData(countryCode).fullName}}
            </div>
          </div>
    </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { countryConstants, getCountryData } from 'app/firebase-functions/shared/src/country-constants.js'

export default {
    mixins:[mixinGeneral],
    data(){
        return{
          countryConstants: countryConstants,
          getCountryData: getCountryData
        }
    },
    computed:{

    },
   
}
</script>

<style>

</style>