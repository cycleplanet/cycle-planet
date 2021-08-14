<template>
  <l-map
    ref="map"
    :options="
      hasTouch
        ? { scrollWheelZoom: false }
        : { scrollWheelZoom: false, dragging: false, tap: false }
    "
    :zoom="zoom"
    :center="center"
    style="height: 100%;"
  >
    <l-tile-layer
      :url="mapsettings.url"
      :attribution="mapsettings.attribution"
    />
    <l-gpx
      :gpx-file="postItemData.file"
      :gpx-options="gpxOptions"
      @gpx-loaded="onGpxLoaded"
    />

    <l-control position="topright">
      <q-chip color="amber">{{ length ? length : "? " }} km</q-chip>
    </l-control>
  </l-map>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LControl } from "vue2-leaflet";
import LGpx from "vue2-leaflet-gpx";
import "leaflet/dist/leaflet.css";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["postItemData"],
  components: {
    LMap,
    LTileLayer,
    LGpx,
    LControl,
  },
  data() {
    return {
      length: 0,
      zoom: 2,
      center: [0, 0],
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      gpxOptions: {
        async: true,
        marker_options: {
          startIconUrl: "",
          endIconUrl: "",
          shadowUrl: "",
          wptIconUrls: "",
          wptIconTypeUrls: "",
        },
      },
    };
  },

  methods: {
    onGpxLoaded(loadedEvent) {
      const { mapObject } = this.$refs.map;
      const gpxMapObject = loadedEvent.target;
      this.length = Math.round(gpxMapObject.get_distance() / 1000);
      mapObject.fitBounds(gpxMapObject.getBounds());
    },
  },
};
</script>

<style></style>
