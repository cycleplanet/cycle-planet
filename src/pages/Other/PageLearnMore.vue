<template>
 <div    v-if="getPages[title]">
    <div class="q-pa-sm">
      <q-card >
        <q-list bordered padding>
          <q-item-label header class="text-black cp-h2">
            
              <q-btn v-if="loggedIn ?admin:false" label="edit" :style="buttonStyle" @click="editPage=true"/>

          </q-item-label>
            <q-item >

              <q-item-section v-html="getPages[title].section1" >
               
            </q-item-section>
          </q-item>

        </q-list>
      </q-card>
    </div>
    
    <q-dialog v-model="editPage" :maximized="maximizedToggle">
      <edit-page :title="title" @close="editPage = false" :data="getPages[title]" />
    </q-dialog>
  </div>
</template>


<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
  mixins: [mixinGeneral ],
   data () {
    return {
      title:'Learn more',
      editPage: false,
      maximizedToggle: true
    }
   },

  computed:{
		...mapGetters('other', ['getPages']),

  },
  methods:{
  
  },
  components: {
    'edit-page': require('components/Shared/EditPage.vue').default,
  },

}
</script>

<style>

</style>