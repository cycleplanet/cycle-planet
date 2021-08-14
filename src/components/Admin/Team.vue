<template>
  <div>
    <q-card class="q-pa-sm">
      <div class="text-h4 q-mt-md">Team</div>
      <div>
        <div class="cp-h2 q-mt-md">Admin</div>
      </div>
      <div class="row q-mt-sm">
        <div v-for="(user, userId) in users" :key="userId">
          <div v-if="user.role === 'admin'">
            <modal-username3 :userId="userId" />
          </div>
        </div>
      </div>

      <div>
        <div class="cp-h2 q-mt-md">Team members</div>
      </div>
      <div class="row q-mt-sm">
        <div v-for="(user, userId) in users" :key="userId">
          <div v-if="user.role === 'team'">
            <modal-username3 :userId="userId" />
          </div>
        </div>
      </div>

      <div>
        <div class="cp-h2 q-mt-md">Editors</div>
      </div>
      <div class="row q-mt-sm">
        <div v-for="(user, userId) in users" :key="userId">
          <div v-if="user.role === 'editor'">
            <modal-username3 :userId="userId" />
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],
  data() {
    return {};
  },
};
</script>

<style></style>
