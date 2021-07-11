<template>
  <div>
 <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Countries ('+Object.keys(allCountries).length+')'"
    >
    <q-card  class="q-my-md q-pa-md">
          <div v-for="(country, countryKey) in allCountries" :key="countryKey" >
            <div :class="countryCodes_rev[countryKey]?'bg-green-2':'bg-red-2'">
              {{countryKey}} - {{countryCodes_rev[countryKey]}}
            </div>
          </div>
    </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { countryCodes_rev } from 'app/firebase-functions/shared/src/country-constants.js'

export default {
    mixins:[mixinGeneral],
    data(){
        return{

        }
    },
    computed:{
      countryCodes_rev: countryCodes_rev
    }
}
</script>

<style>

</style>