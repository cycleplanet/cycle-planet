<template>
  <div v-if="loggedIn && teamMember" class="q-pa-sm q-gutter-y-sm">
    <p class="q-mx-md text-h4">Admin panel</p>

    <update-cycleplanet/>
    <dev-info/>
    <team/>
    <notes/>
    <pages/>
    <feedback/>
    <applications/>
    <reports/>
    <users-list/>
    <countries-list/>
    <markers-list/>

  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'
import { date, uid, Notify } from 'quasar'
import { firebase } from 'boot/config'

export default {
  	mixins: [mixinGeneral, ],
    data() {
	  	return {
        
        }
    },
    components: {
      'update-cycleplanet': require('components/Admin/updateCyclePlanet.vue').default,
      'dev-info': require('components/Admin/DevInfo.vue').default,
      'team': require('components/Admin/Team.vue').default,
      'notes': require('components/Admin/Notes.vue').default,
      'pages': require('components/Admin/Pages.vue').default,
      'feedback': require('components/Admin/Feedback.vue').default,
      'applications': require('components/Admin/Applications.vue').default,
      'reports': require('components/Admin/Reports.vue').default,
      'users-list': require('components/Admin/Users.vue').default,
      'countries-list': require('components/Admin/Countries.vue').default,
      'markers-list': require('components/Admin/Markers.vue').default,

    },
    computed:{

},
    methods:{

    },
}


</script>

<style>

</style>