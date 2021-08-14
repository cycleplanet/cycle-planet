<template>
  <div class="q-ma-sm">
    <div class="text-h6 q-mt-md">Social links</div>
    <div>Share your social media accounts.</div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-input
          outlined
          v-model="userData.website"
          label="Website"
          hint="https://www.yourblog.com/..."
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-wordpress-simple" class="text-blue-7" />
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-input
          outlined
          v-model="userData.facebook"
          label="Facebook"
          hint="https://www.facebook.com/..."
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-facebook-f" class="text-blue-10" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-input
          outlined
          v-model="userData.instagram"
          label="Instagram username"
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-instagram" class="text-black" />
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-input
          outlined
          v-model="userData.youtube"
          label="Youtube"
          hint="https://www.youtube.com/..."
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-youtube" class="text-red" />
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";
export default {
  mixins: [mixinGeneral],
  props: ["userData"],
};
</script>

<style></style>
