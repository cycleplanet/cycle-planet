<template>
  <div>
    <q-btn @click="updateCyclePlanet()" :style="buttonStyle"
      >Update Cycle Planet</q-btn
    >

    <q-dialog v-model="updateCyclePlanetDialog">
      <div class="bg-white" style="width: 400px;">
        <q-btn @click="startBackup">Update markers</q-btn>
        <div>
          <div>Backup markers ({{ loadingLength }}) - {{ currentItem }}</div>
          <q-linear-progress
            v-if="backupMarkersStatus"
            :value="progress"
            class="q-my-md"
          />
        </div>
        <div>
          <div>
            Assign markers to users ({{ loadingLength }}) - {{ currentItem }}
          </div>
          <q-linear-progress
            v-if="assignMarkersStatus"
            :value="progress"
            class="q-my-md"
          />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],

  data() {
    return {
      updateCyclePlanetDialog: false,
      loadingLength: 0,
      progress: 0,
      currentItem: "",
      backupMarkersStatus: false,
      assignMarkersStatus: false,
    };
  },

  methods: {
    ...mapActions("markers", ["backupFirestoreMarkers"]),
    updateCyclePlanet() {
      this.updateCyclePlanetDialog = true;
    },
    startBackup() {
      // this.backupMarkers()
      // this.assignMarkers()
      this.calculatePoints();
    },
    resetvalues() {
      this.loadingLength = 0;
      this.progress = 0;
      this.currentItem = "";
    },

    backupMarkers() {
      this.backupMarkersStatus = true;
      let markerKeys = Object.keys(this.landMarkers);
      this.loadingLength = Object.keys(this.landMarkers).length;
      let itemIndex = 0;
      markerKeys.forEach((element) => {
        console.log("backupMarkers 1", element);
        // itemIndex=itemIndex+1
        this.progress = itemIndex++ / this.loadingLength;
        console.log("backupMarkers 2", this.progress);
        this.currentItem = this.landMarkers[element].title;
        this.updateItemAction({
          path: "MarkersBackup/" + element,
          data: this.landMarkers[element],
        });
      });
      this.backupMarkersStatus = true;
      this.resetvalues();
    },
    assignMarkers() {
      let markerKeys = Object.keys(this.landMarkers);
      this.loadingLength = Object.keys(this.landMarkers).length;
      let itemIndex = 0;
      markerKeys.forEach((element) => {
        console.log("backupMarkers 1", element);
        // itemIndex=itemIndex+1
        this.progress = itemIndex++ / this.loadingLength;
        console.log("backupMarkers 2", this.progress);
        this.currentItem = this.landMarkers[element].title;
        this.updateItemAction({
          path:
            "Users/" +
            this.landMarkers[element].user_created +
            "/points/markers_added",
          data: {
            [this.landMarkers[element].date_created]: element,
          },
        });
      });
      this.assignMarkersStatus = true;
      this.resetvalues();
    },
    calculatePoints() {
      let userKeys = Object.keys(this.users);
      let userPoints = 0;

      userKeys.forEach((element) => {
        if (this.users[element].points) {
          if (this.users[element].points.markers_added) {
            let totalMarkersAdded = Object.keys(
              this.users[element].points.markers_added
            ).length;
            userPoints = totalMarkersAdded * 10;
          }
        }
        console.log("calculatePoints 1", element);
        console.log("calculatePoints 2", userPoints);
        this.updateItemAction({
          path: "Users/" + element + "/points",
          data: {
            score: userPoints,
          },
        });
        userPoints = 0;
      });
    },
  },
};
</script>

<style></style>
