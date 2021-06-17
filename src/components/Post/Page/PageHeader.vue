<template>
  <div>
       <div v-if="postItemData.refKey==='Video'" >
            <video-embed :class="screenwidthbig?'big':'small'" :src="postItemData.link" sandbox="allow-popups allow-scripts"/>
        </div>
        <div v-if="postItemData.refKey==='Blog'" >
            <q-img class="full-width" :src="postItemData.image_url"  :ratio="16/9" @click="openUrl(postItemData.link)"/>
        </div>
        <div v-if="postItemData.refKey==='Route'">
            <gpx-track :postItemData="postItemData" style="height:500px"/>
        </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

	export default {
    props:['postItemData'],
    mixins: [ mixinGeneral],
    components:{
      'gpx-track': require('components/Post/GpxTrack.vue').default,
    },

}
</script>

<style>

</style>