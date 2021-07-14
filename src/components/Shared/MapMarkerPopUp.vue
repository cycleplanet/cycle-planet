<template>
        <l-popup :options="{offset:[0,-40]}"  style="min-width:150px;">
            <div v-if="refKey==='Embassy'">
                <embassy-popup :singleItemData="singleItemData" @markerclick="markermethod" />
            </div>
            <div v-else-if="refKey==='Border_item'">
                <border-popup :singleItemData="singleItemData" @markerclick="markermethod" />
            </div>
            <div v-else>
                <other-popup :singleItemData="singleItemData" @markerclick="markermethod" />
            </div>
        </l-popup>
</template>

<script>
// import { mapState, mapActions, mapGetters } from 'vuex'
// import { LMap, LTileLayer, LControl, LMarker, LIcon, LPopup, LFeatureGroup } from 'vue2-leaflet'
// import L from 'leaflet'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { LPopup } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import { latLng, Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
    mixins: [mixinGeneral, ],
    props: ['singleItemData'],
    components: {
        // LMap,
        // LTileLayer,
        // LControl,
        // LMarker,
        // LIcon,
        LPopup,
        // LFeatureGroup,

        'embassy-popup': require('components/Map/Modals/Popup/EmbassyPopup.vue').default,
        'border-popup': require('components/Map/Modals/Popup/BorderPopup.vue').default,
        'other-popup': require('components/Map/Modals/Popup/OtherPopup.vue').default,
    },
    computed: {

        refKey() {
            return this.singleItemData.refKey
        },
    },

    methods: {
        markermethod() {
            this.$emit('markerClick', this.singleItemData.itemKey)
        }
    },

    mounted() {
        this.$root.$on('showAddTask', () => {
            this.showAddTask = true
        })
    },
}
</script>
