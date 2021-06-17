<template>
 <q-page   >
    <div class="q-pa-sm">
          <q-item-label header class="text-black cp-h2">
            <div class="q-mr-md">q{{title}}</div>
            <q-separator class="q-mb-sm" />
            
            
            
              <q-btn v-if="loggedIn ?admin:false" label="edit" :style="buttonStyle" @click="editPage=true"/>

          </q-item-label>
            <q-item >

              <q-item-section v-html="getPages[title].section1" >
               
            </q-item-section>
          </q-item>

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
      title:'Our story',
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

</style><template>
   <q-page   >
    <div class="q-pa-md">
        <q-card class="q-pa-md">
          <p class="text-h4">Our story</p>
          <p class="text-body1">We all know that bike touring is the coolest hobby in the world. The founder Bas came in touch with bike touring during his backpack trip in Central Asia, where one of the most popular routes among bike toureres appeared to be. A world of opportunities opened for him, as a bike can take you gain an incredible amount of freedom. Bas was sold, and started his own world trip a few years later, in 2019. The original idea was to go from The Netherlands, towards Cape Town via West Africa, go to Asia via East Africa, then Oceania, sail the Great Ocean and then cycle South and North America. All of this came to an abrubt end after having cycled 20.000 km in one year and through some of the thougest countires in the world. Just a few days removed from the South African border, Bas had to fly home from Namibia, after the corona epidemic took control of the world.</p>
          <p class="text-body1">During Bas his trip, finding information about visas, border crossings, embassies and other subjects was possible with places like Facebook groups, Whatsapp groups and iOverlander, but could definelty be better and more bike touring specific. The ultimate source of information could be a bike touring platform, in which users can add and edit information based on their own experiences. Small ideas started to grow into something larger, like the possibilities to let users find each other and interact with each other.
          </p>
          <p class="text-body1">Starting with little knowledge about coding, Bas started to learn making an android app. In September 2020 the first version of the android app was lauched, but soon realised that only an android app wouldn't be sufficient, and a website and iOs app should be released as well. Starting again with little knowledge about coding a website, Bas found out that a single sourcecode could be made to create a platform on all 3 major user devices.
          </p>
          <p class="text-body1">Having launched the first version of the website and the apps for both Android and iOs in January 2021, a major step has been made.
          </p>
          <p class="text-body1">And even after the launch, new and promising ideas are still coming up (like recording your trip, translate system, adding routes, a social feed system and more). To be continued!
          </p>

        </q-card> 
    </div>
  </q-page>
</template>

<script>
export default {

}
</script>

<style>

</style>