<template>
  <div>
 <q-card padding class="q-mb-md q-pa-md" v-if="loggedIn?admin:false">
      <div class="text-bold">This block is only shown for admins</div>
      <div>loggedIn:{{loggedIn}}</div>
      <div>isWebApp:{{isWebApp}}</div>
      <div>isCordova:{{isCordova}}</div>
      <div>timeStamp:{{timeStamp}}</div>

    </q-card>
  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    mixins:[mixinGeneral],

    data(){
        return{

        }
    }
}
</script>

<style>

</style>