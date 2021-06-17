<template>
    <div>
        <q-chip v-if="status==='tripFuture'" icon="eva-calendar-outline" class="bg-grey-3 ownfont" label="Future trip"/>
        
        <q-chip v-if="status==='tripActive'" outline label="Active" icon="fiber_manual_record" class="bg-grey-3" text-color="red-12"  >
           
        </q-chip>
        
        <q-chip v-else-if="status==='tripFinished'" icon="done" outline class="bg-grey-3 ownfont">Finished</q-chip>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import mixinTrip from 'src/mixins/mixin-trip.js'

export default {
    props:['status'],
    mixins: [mixinGeneral,mixinTrip],

}
</script>

<style>
.ownfont{
	font-family: 'customfont';
}

</style>