<template>
    <div>
        <div v-if="admin" class="bg-blue-3">itemKey: {{itemKey}}</div>
        <item-header :singleItemData="landMarkers[itemKey]"/>
        <item-container :singleItemData="landMarkers[itemKey]"/>
        <item-footer :singleItemData="landMarkers[itemKey]"/>
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    props:['singleItemData'],
  	mixins: [mixinGeneral, ],

    computed:{
        itemKey(){
            return this.singleItemData.itemKey
        }
    },

    components:{
        'item-header': require('components/Marker/ItemHeader.vue').default,
        'item-container': require('components/Marker/ItemContainer.vue').default,
        'item-footer': require('components/Marker/ItemFooter.vue').default,
    }

}
</script>

<style>

</style>