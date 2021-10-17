<template>
  <div>
    <q-card>
      <q-list bordered padding>
        <q-item-label header class="text-black cp-h2 row">
          <div class="q-mr-md">
            Notes
          </div>

          <q-btn
            flat
            v-if="loggedIn ? teamMember : false"
            label="edit"
            @click="editPageMethod('Admin')"
          />
        </q-item-label>
        <q-item>
          <q-item-section v-html-safe="getPages.Admin.section1"> </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";
import Vue from 'vue';
import VueSecureHTML from 'vue-html-secure';

Vue.use(VueSecureHTML);

export default {
  mixins: [mixinGeneral],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("other", ["getPages"]),
  },
};
</script>

<style></style>
