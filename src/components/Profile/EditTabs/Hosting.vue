<template>
<div v-if="userData" class="q-ma-sm">
  <div class="text-h6 q-mb-none q-mt-md">Describe your home</div>
  <div class="col-xs-12 col-sm-12 col-md-8 q-py-sm">Let your potential guests know what they can expect from staying at your place. Provide a phone number for easier contact.</div>
  <div class="row">
  <q-input class="col-xs-12 col-sm-12 col-md-8 q-py-sm" outlined v-model="userData.hosting.description" label="Describe what guests can expect" type="textarea" />
  </div>
  <div class="row">
  <q-input class="col-xs-12 col-md-4 q-py-sm" outlined v-model="userData.phonenumber" type="tel" label="Phone number" />
  <q-input class="col-xs-12 col-md-4 q-py-sm" outlined v-model="userData.hosting.max_guests" label="Max. guests" />
  </div>
  <q-toggle v-model="userData.hosting.pets_allowed" label="Pets allowed?" />
  <q-toggle v-model="userData.hosting.bike_inside" label="Bike can be stored inside?" />
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    mixins: [mixinGeneral],
    props:['userData'],
}
</script>

<style>

</style>