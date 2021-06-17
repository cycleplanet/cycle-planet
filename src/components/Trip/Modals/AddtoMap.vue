<template>
  <div>
        <q-btn icon="add" rounded :style="buttonStyle" :size="screenwidthbig?'md':'sm'" :label="screenwidthbig?'add to map':''" class="justify-right q-mr-sm" @click="addToMapMethod" v-if="users[userId].trips[tripId].markers?!users[userId].trips[tripId].markers[itemKey]:true" />
        <q-btn icon="done" outline rounded :size="screenwidthbig?'md':'sm'" :label="screenwidthbig?'added':''" class="justify-right text-secondary bg-green-2 q-mr-sm" @click="deleteFromMapMethod" v-if="users[userId].trips[tripId].markers?users[userId].trips[tripId].markers[itemKey]:false"/>

  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import mixinTrip from 'src/mixins/mixin-trip.js'

export default {
    mixins: [mixinGeneral, mixinTrip],
    props:['refKey','itemKey'],
    methods:{

        addToMapMethod(){
        this.setItemAction({
          data:{
            refKey:this.refKey,
            itemKey:this.itemKey
          },
          path:'Users/'+this.userId+'/trips/'+this.tripId+'/markers/'+this.itemKey
        })
      },
      deleteFromMapMethod(){
        this.deleteItemAction({
          path:'Users/'+this.userId+'/trips/'+this.tripId+'/markers/'+this.itemKey
        })
      },
    }

}
</script>

<style>

</style>