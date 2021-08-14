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
        <div v-for="(marker, markerId, index) in markerlist" :key="index">
          <q-item v-if="index < 3">
            <q-item-section avatar>
              <q-avatar size="40px">
                <img :src="marker.iconurl" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <p class="text-body1">{{ marker.title }}</p>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-toggle v-model="marker.active" label="" />
            </q-item-section>
          </q-item>
        </div>

        <q-separator />

        <div v-if="markerlist['Available for hosting'].active">
          <q-item>
            <q-item-section avatar>
              Hosting options
            </q-item-section>
          </q-item>

          <div
            v-for="(marker, markerId, index) in usermarkeroptions"
            :key="index"
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar size="40px">
                  <q-icon :name="marker.icon" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <p class="text-body1">{{ marker.title }}</p>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-toggle v-model="marker.active" label="" />
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      allMarkers: true,
      userMarkers: true,
      pets: false,
    };
  },
};
</script>

<style>
.q-menu {
  max-width: 70%;
}
</style>
