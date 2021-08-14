<template>
  <div>
    <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Pages (' + Object.keys(getPages).length + ')'"
    >
      <q-card class="q-my-md q-pa-md">
        <div v-for="(item, itemKey) in getPages" :key="itemKey">
          <q-list
            bordered
            separator
            :class="item.status ? 'bg-secondary-2' : ''"
          >
            <q-item>
              <q-item-section>
                <q-item-label>{{ itemKey }}</q-item-label>
                <!-- <q-item-label caption>{{users[item.user].fullname}}</q-item-label> -->
              </q-item-section>
              <q-item-section side top>
                <div class="row">
                  <q-btn
                    dense
                    flat
                    @click="editPageMethod(itemKey)"
                    icon="edit"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card>
    </q-expansion-item>

    <q-dialog v-model="editPage" :maximized="maximizedToggle">
      <edit-page
        :title="pageItemKey"
        :data="getPages[pageItemKey]"
        @close="editPage = false"
      />
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
      maximizedToggle: true,
      editPage: false,
      pageItemKey: "",
    };
  },
  components: {
    "edit-page": require("components/Shared/EditPage.vue").default,
  },
  computed: {
    ...mapGetters("other", ["getPages"]),
  },
  methods: {
    editPageMethod(itemKey) {
      this.pageItemKey = itemKey;
      this.editPage = true;
    },
  },
};
</script>

<style></style>
