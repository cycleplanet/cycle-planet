<template>
 <q-page   >
    <div class="q-pa-sm">
      <q-card >
        <q-list bordered padding>
          <q-item-label header class="text-black cp-h2">

            <div class="q-mr-md row flex items-center">
			      <q-btn icon="arrow_back" flat dense clickable  v-go-back.single v-if="!screenwidthbig"/>
            <div v-if="!isWebApp">Guidelines</div>
            <q-space></q-space>
            <q-btn v-if="loggedIn ?admin:false" label="edit" :style="buttonStyle" @click="editPage=true"/>

            </div>
            

          </q-item-label>
            <q-item >

              <q-item-section v-html="getPages[title].section1" >
               
            </q-item-section>
          </q-item>

        </q-list>
      </q-card>
    </div>
    
    <q-dialog v-model="editPage" :maximized="maximizedToggle">
      <edit-page :title="title" :data="getPages[title]" @close="editPage = false" />
    </q-dialog>
  </q-page>
</template>


<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
  mixins: [mixinGeneral ],
   data () {
    return {
      title:'Guidelines',
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