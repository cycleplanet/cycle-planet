<template>
  <div>
    <div v-for="(gearGroup, id) in gearGroups" :key="id">
      <p class="text-h4 q-ml-md q-mt-md">{{ id }}</p>
      <q-separator class="q-mb-sm" />
      <div
        class="q-pa-md"
        v-for="(gearItem, gearItemIndex) in gearGroup"
        :key="gearItemIndex"
      >
        <!-- <div class="q-pa-md" v-for="(section,sectionId) in gear" :key="sectionId"> -->
        <div class="">
          <p class="cp-h2">{{ gearItem.title }}</p>
          <q-virtual-scroll :items="[0]" virtual-scroll-horizontal>
            <div class="row no-wrap q-gutter-md">
              <div v-for="(item, itemId) in gear[gearItemIndex]" :key="itemId">
                <q-card
                  bordered
                  class="my-card"
                  :style="screenwidthbig ? 'width: 300px;' : 'width: 200px;'"
                >
                  <q-card-section>
                    <q-item-label class="thumbnail">
                      <q-img
                        :src="item.image_url"
                        style="width: 100%; max-height: 200px;"
                      />
                    </q-item-label>
                    <q-item-label>
                      <p :class="screenwidthbig ? 'text-h6' : ''">
                        {{ item.title }}
                      </p>
                    </q-item-label>
                    <q-item-label class="text-caption text-grey">
                      {{ item.description }}
                    </q-item-label>
                    <q-item-label>
                      <q-chip
                        dense
                        class="text-caption text-green bg-green-2 no-margin"
                        >from {{ item.price }}</q-chip
                      >
                    </q-item-label>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions>
                    <q-btn
                      flat
                      round
                      dense
                      :class="
                        item.likes
                          ? item.likes[myUserId]
                            ? 'text-red'
                            : ''
                          : ''
                      "
                      :icon="
                        item.likes
                          ? item.likes[myUserId]
                            ? 'favorite'
                            : 'favorite_border'
                          : 'favorite_border'
                      "
                      @click="
                        pressLiked(
                          gearItemIndex,
                          itemId,
                          item.likes
                            ? item.likes[myUserId]
                              ? 'disliked'
                              : 'liked'
                            : 'liked'
                        )
                      "
                    />
                    {{ item.likes ? Object.keys(item.likes).length : 0 }}

                    <q-btn
                      flat
                      :style="buttonStyle"
                      @click="openUrl(item.url)"
                      :size="screenwidthbig ? 'md' : 'sm'"
                    >
                      View on {{ item.name }}
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-virtual-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],

  data() {
    return {
      gearGroups: {
        Bicycles: {
          Tourbike: { title: "Tourbike" },
          Bikepacking_bike: { title: "Bikepacking bike" },
          Cheap_bike: { title: "Cheap bike" },
          Decent_bike: { title: "Decent bike" },
        },
        "Bicycle equipment": {
          Tourbike_bags: { title: "Tourbike bags" },
          // 'Bikepacking_bags':{title:'Bikepacking bags'},
          Saddle: { title: "Saddle" },
          Hub: { title: "Hub" },
          Straps: { title: "Straps" },
          Other: { title: "Other" },
        },
        Camping: {
          Tent: { title: "Tent" },
          Airbed: { title: "Airbed" },
          Sleeping_bag: { title: "Sleeping bag" },
          Camping_accessoires: { title: "Camping accessoires" },
          Cooking: { title: "Cooking" },
          Survival: { title: "Survival" },
        },

        Electronics: {
          Camera: { title: "Camera" },
          Laptop: { title: "Laptop" },
          Powerbank: { title: "Powerbank" },
          Solar: { title: "Solar panels" },
          Transformer: { title: "Transformer" },
          Counter: { title: "Counter" },
          Drone: { title: "Drone" },
          Electronics_other: { title: "Electronics other" },
        },
        Books: {
          Guides: { title: "Guides" },
          Stories: { title: "Stories" },
        },
      },
    };
  },
  components: {
    comment: require("components/Shared/Modals/Comment.vue").default,
  },

  computed: {
    ...mapState("other", ["gear"]),
  },

  methods: {
    ...mapActions("other", ["getAllGear", "likeGearItem"]),

    pressLiked(sectionId, itemId, type) {
      this.likeGearItem({
        sectionId: sectionId,
        itemId: itemId,
        type: type,
      });
    },
  },

  mounted() {
    this.getAllGear();
  },
};
</script>

<style></style>
