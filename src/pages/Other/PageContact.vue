<template>
 <q-page   >
    <div class="q-pa-md">
        <div class="q-pa-md">
          <p class="text-h4">Contact</p>
          <q-separator class="q-mb-sm" />
          <p class="text-body1">Email <a class="link" @click="openUrl('mailto:info@cycleplanet.org')" >info@cycleplanet.org</a></p>
          <p class="text-body1">Website <a class="link" @click="openUrl('http://cycleplanet.org')">www.cycleplanet.org</a></p>
        </div>    
      </div>
  </q-page>
</template>


<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
export default {
mixins: [mixinGeneral],

}
</script>

<style>
.link{
  text-decoration: underline;
  color:#823dba;
}

</style>