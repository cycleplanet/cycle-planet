<template>
  <div class="row items-center">
    <q-btn :style="buttonStyle" @click="creategpx()"
      >Download markers to gpx ({{ Object.keys(markersArray).length }})</q-btn
    >
    <q-icon size="md" name="info" class="text-grey">
      <q-tooltip>
        Works very well with OSMAnd Offline Map for mobile
      </q-tooltip>
    </q-icon>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
export default {
  mixins: [mixinGeneral],
  props: ["markersArray"],
  data() {
    return {};
  },
  methods: {
    creategpx() {
      console.log("creategpx 1");
      let result =
        '<?xml version="1.0" encoding="utf-8" standalone="yes"?><gpx version="1.1" creator="GPS Visualizer https://www.gpsvisualizer.com/"   xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/WaypointExtension/v1 http://www8.garmin.com/xmlschemas/WaypointExtensionv1.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www8.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/CreationTimeExtensions/v1 http://www.garmin.com/xmlschemas/CreationTimeExtensionsv1.xsd" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:wptx1="http://www.garmin.com/xmlschemas/WaypointExtension/v1" xmlns:gpxtrx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:ctx="http://www.garmin.com/xmlschemas/CreationTimeExtension/v1">';
      console.log("creategpx 2", result);
      console.log("creategpx 3", this.markersArray);
      this.markersArray.forEach((element) => {
        console.log("creategpx 4", this.landMarkers[element]);

        let segmentTag =
          '<wpt lat="' +
          this.landMarkers[element].coordinates.lat +
          '" lon="' +
          this.landMarkers[element].coordinates.lng +
          '">';
        if (this.landMarkers[element].refKey === "Border_item") {
          segmentTag +=
            "<name>" +
            this.landMarkers[element].country1.country +
            " (" +
            this.landMarkers[element].country1.city +
            ") - " +
            this.landMarkers[element].country2.country +
            " (" +
            this.landMarkers[element].country2.city +
            ")";
        } else if (this.landMarkers[element].refKey === "Embassy") {
          if (this.landMarkers[element].onlineVisa) {
            segmentTag +=
              "<name> E-visa for " + this.landMarkers[element].countryKey;
          } else {
            segmentTag +=
              "<name> Embassy for " +
              this.landMarkers[element].countryKey +
              " in " +
              this.landMarkers[element].country_located +
              " (" +
              this.landMarkers[element].city +
              ")";
          }
        } else {
          segmentTag += "<name>" + this.landMarkers[element].title;
        }
        segmentTag += "</name><sym>Flag, Blue</sym></wpt>";
        result += segmentTag;
      });
      result += "</gpx>";
      console.log("creategpx 5", result);
      this.downloadGpxFile(result);
    },
    downloadGpxFile(result) {
      const url = "data:text/json;charset=utf-8," + result;
      const link = document.createElement("a");
      link.download =
        "Cycle Planet - markers - " +
        `${this.myUserDetails.fullname} - ${this.timeStamp}.gpx`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>

<style></style>
