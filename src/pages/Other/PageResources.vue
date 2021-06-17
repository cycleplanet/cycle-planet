<template>
   <q-page   >
    <div class="q-pa-md">
        <div class="q-pa-md">
        <p class="text-h4">Resources</p>
        <q-separator class="q-mb-sm" />
        <p class="text-body1">
               Find usefull tools to gain information, come in touch with other cyclists, and to plan your trip.
        </p>
      </div>

      <div class="q-my-md q-pa-md">
        <p class="text-h4">WhatsApp groups</p>
        <q-separator class="q-mb-sm" />
        <p class="text-body1">
          Invite yourself into one of the WhatsApp groups for each part of the world. Here you can ask about the current state of countries, visas, border crossings and much more.
        </p>
         <p class="text-body1">
          NOTE: Currently some very good WhatsApp groups already exists, and you might want to consider joining one of them rather than the ones below. However, I can not share that link on this page. The best place to get in touch for these groups is on one of the Facebook groups.
        </p>
        <q-banner v-if="isApple" inline-actions class="text-orange-10 bg-orange-2">
            <template v-slot:avatar>
              <q-icon name="warning"/>
            </template>
            <div>Apple device users may experience the below links are not working. Please contact Cycle Planet if you experience this, so we can share the Whatsapp group link with you personally. You can also try to visit the browser version.</div>
          </q-banner>
        <div class="row">
          <div  v-for="(WAgroup, key) in whatsappgroups" :key="key" class="q-ma-sm">
            <whatsapp-button :WAgroup="WAgroup"/>
          </div>
        </div>
      </div>

      <div class="q-my-md q-pa-md">
        <p class="text-h4">Usefull apps</p>
        <q-separator class="q-mb-sm" />
        <p class="text-h6">Travel tracking</p>
        <div class="row">
            <q-card v-for="app in apps.tracking" :key="app" class="my-card q-ma-sm" style="max-width:310px" flat bordered>
              <q-card-section horizontal>
                <q-card-section class="q-pt-xs">
                  <div class="cp-h2 q-mt-sm q-mb-xs">{{app.name}}</div>
                  <div class="text-caption text-grey">{{app.description}}</div>
                </q-card-section>

                <q-card-section class="col-5 flex flex-center">
						      <q-img   v-bind:src="app.image"/>
                </q-card-section>
              </q-card-section>

              <q-separator />

              <q-card-actions>
               
                <q-btn :style="buttonStyle" @click="openUrl(app.website)">
                  website
                </q-btn>
              </q-card-actions>
            </q-card>   
          </div>      
        <p class="text-h6">Navigation</p>
        <p class="text-body1">
          To avoid high costs for internet, bike tourers use offline maps a lot, rather than using Google Maps. With offline maps you can download parts of the world before you are disconnected from internet. Below you find the two most common apps.
        </p>
          <div class="row">
            <q-card v-for="app in apps.navigation" :key="app" class="my-card q-ma-sm" style="max-width:310px" flat bordered>
              <q-card-section horizontal>
                <q-card-section class="q-pt-xs">
                  <div class="cp-h2 q-mt-sm q-mb-xs">{{app.name}}</div>
                  <div class="text-caption text-grey">{{app.description}}</div>
                </q-card-section>

                <q-card-section class="col-5 flex flex-center">
						      <q-img   v-bind:src="app.image"/>
                </q-card-section>
              </q-card-section>

              <q-separator />

              <q-card-actions>
               
                <q-btn :style="buttonStyle" @click="openUrl(app.website)">
                  website
                </q-btn>
              </q-card-actions>
            </q-card>   
          </div>      
        
      </div>

    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
export default {
 mixins: [mixinGeneral],
 
 data() {
  return {
    apps:{
      tracking:{
        'Polar steps':{
          name:'Polarsteps',
          website:'https://www.polarsteps.com/',
          image:'https://www.pinclipart.com/picdir/big/349-3499884_polarsteps-logo-png-clipart.png',
          description:'Polarsteps is a perfect way to track your trip, to share your most incredible stories. It allows your friends and families to see your passed route, current location and future route. Once your trip is finished, you can create a high quality book with just a few clicks.'
        },
      },
      navigation:{
        'osmand':{
            name:'OsmAnd',
            website:'https://osmand.net/',
            image:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Osmand_logo.svg/1200px-Osmand_logo.svg.png',
            description:'OsmAnd`s user interface is less userfriendly than it`s brother Maps.Me, but the big advantage is that you can insert gpx (standard format for routes) files.'
          },
          'mapsme':{
            name:'Maps.me',
            website:'https://maps.me/',
            image:'https://seeklogo.com/images/M/mapsme-logo-86783EE6B1-seeklogo.com.png',
            description:'Mostly used by backpackers, with some great features such as automated guides. It`s not possible to insert a gpx file, therefore you need to convert the file to kml.'
          },
        }
      }
    }
  },
  computed:{
		...mapState('countries', ['whatsappgroups']),    
  },
  components:{
    'whatsapp-button' : require('components/Shared/Modals/WhatsAppButton.vue').default,
  }
}
</script>

<style>

</style>