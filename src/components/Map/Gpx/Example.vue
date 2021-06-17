<template>
<div>
  <div style="height:200px">
    <!-- <l-map ref="map" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-gpx
        :gpx-file="postItemData.file"
        @gpx-loaded="onGpxLoaded" />
    </l-map> -->
  </div>
</div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer } from 'vue2-leaflet';
import LGpx from 'vue2-leaflet-gpx';
import 'leaflet/dist/leaflet.css';
export default {
  props:['postItemData'],
  components: {
    LMap,
    LTileLayer,
    LGpx,
  },
  data () {
    return {
      zoom: 2,
      center: [0, 0],
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  },
  methods: {
    onGpxLoaded (loadedEvent) {
      const { mapObject } = this.$refs.map;
      const gpxMapObject = loadedEvent.target;
      mapObject.fitBounds(gpxMapObject.getBounds());
    },
   
  }
}
</script>

<style>

</style>