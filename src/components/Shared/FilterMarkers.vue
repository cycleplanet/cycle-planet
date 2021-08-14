<template>
  <div>
    <q-btn-dropdown
      split
      push
      text-color="white"
      color="secondary"
      no-caps
      icon="fas fa-filter"
      label="Filter"
      :size="screenwidthbig ? 'md' : 'sm'"
    >
      <q-list>
        <q-item>
          <!-- <q-item-section avatar>
          </q-item-section> -->
          <q-item-section>
            <q-item-label class="text-h6">All markers</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="allMarkers" @click="allMarkersState" />
          </q-item-section>
        </q-item>
        <q-separator />

        <div v-for="(marker, markerId, index) in markerlist" :key="index">
          <q-item v-if="index > 2">
            <q-item-section avatar>
              <q-avatar size="40px">
                <img :src="marker.iconurl" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label
                ><p class="text-body1">{{ marker.title }}</p></q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="marker.active" label="" />
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
// import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      allMarkers: true,
      otherMarkers: true,
    };
  },
  computed: {
    allMarkersState() {
      if (this.allMarkers) {
        this.otherMarkers = true;

        this.markerlist["Wildcamping"].active = true;
        this.markerlist["FormalCamping"].active = true;
        this.markerlist["Campsites"].active = true;
        this.markerlist["Hostels"].active = true;
        this.markerlist["BikeShop"].active = true;
        this.markerlist["SeeDo"].active = true;
        this.markerlist["Embassy"].active = true;
        this.markerlist["Border_item"].active = true;
        this.markerlist["Shop"].active = true;
        this.markerlist["Ferry"].active = true;
        this.markerlist["Water"].active = true;
        this.markerlist["ATM"].active = true;
        this.markerlist["Warning"].active = true;
        this.markerlist["OtherMarker"].active = true;
      } else {
        this.otherMarkers = false;

        this.markerlist["Wildcamping"].active = false;
        this.markerlist["FormalCamping"].active = false;
        this.markerlist["Campsites"].active = false;
        this.markerlist["Hostels"].active = false;
        this.markerlist["BikeShop"].active = false;
        this.markerlist["SeeDo"].active = false;
        this.markerlist["Embassy"].active = false;
        this.markerlist["Border_item"].active = false;
        this.markerlist["Shop"].active = false;
        this.markerlist["Ferry"].active = false;
        this.markerlist["Water"].active = false;
        this.markerlist["ATM"].active = false;
        this.markerlist["Warning"].active = false;
        this.markerlist["OtherMarker"].active = false;
      }
    },

    // otherMarkersState(){
    //   if(this.otherMarkers){
    //      this.markerlist['Wildcamping'].active=true
    //   this.markerlist['FormalCamping'].active=true
    //   this.markerlist['Campsites'].active=true
    //   this.markerlist['Hostels'].active=true
    //   this.markerlist['BikeShop'].active=true
    //   this.markerlist['SeeDo'].active=true
    //   this.markerlist['Embassy'].active=true
    //   this.markerlist['Border_item'].active=true
    //   this.markerlist['Shop'].active=true
    //   this.markerlist['Water'].active=true
    //   this.markerlist['ATM'].active=true
    //   this.markerlist['Warning'].active=true
    //   this.markerlist['OtherMarker'].active=true

    //   }else{
    //     this.markerlist['Wildcamping'].active=false
    //   this.markerlist['FormalCamping'].active=false
    //   this.markerlist['Campsites'].active=false
    //   this.markerlist['Hostels'].active=false
    //   this.markerlist['BikeShop'].active=false
    //   this.markerlist['SeeDo'].active=false
    //   this.markerlist['Embassy'].active=false
    //   this.markerlist['Border_item'].active=false
    //   this.markerlist['Shop'].active=false
    //   this.markerlist['Water'].active=false
    //   this.markerlist['ATM'].active=false
    //   this.markerlist['Warning'].active=false
    //   this.markerlist['OtherMarker'].active=false
    //   }
    // },
  },
};
</script>

<style>
.q-menu {
  max-width: 70%;
}
</style>
