<template>
  <div>
    <!-- <q-intersection transition="scale"> -->
    <q-item class="q-pa-none" clickable v-ripple @click="$emit('viewUserProfile')">
      <q-item-section avatar>
        <q-avatar >
          <!-- user avatar lazy loading by Bogdan -->
    <!-- <q-intersection transition="scale"> -->
            <img :src="data.imageurl" />
    <!-- </q-intersection> -->
        </q-avatar>
      </q-item-section>
      <q-item-section class="text-bold">
        <q-item-label>{{data.fullname}}</q-item-label>
        <q-item-label caption :class="data.hosting.status==='Not available for hosting'?'text-red':'text-green'">{{data.hosting.status}}</q-item-label>
        <q-item-label caption class="row" v-if="data.hosting.status==='Touring'">Last updated: <nice-date class="q-ml-xs" :dateprop="data.coordinates_updated"/></q-item-label>
        <q-item-label caption class="row" v-if="data.hosting.status!=='Touring'">Last logged in: <nice-date class="q-ml-xs" :dateprop="data.online_date"/></q-item-label>
      </q-item-section>
    </q-item>

    <!-- <hosting-stats :data="data"/> -->
    <q-item class="q-pa-none q-my-sm">
      <q-item-section>
        <q-item-label lines="3" v-html="data.bio"></q-item-label>
        <!-- <q-item-label class="row flex items-center">
          <q-icon class="q-ml-sm" :name="data.phonenumber?'eva-phone-outline':'eva-phone-off-outline'" :color="data.phonenumber?'green':'red'" size="sm"></q-icon>
          <div :class="data.phonenumber?'text-green':'text-red'">{{data.phonenumber?'Has phone number':'has no phone number'}}</div>
        </q-item-label> -->
        <q-item-label class="row">
            <q-chip v-if="data.hosting.status!=='Touring'" outline :color="data.phonenumber?'green':'red'" :text-color="data.phonenumber?'text-green':'text-red'" :icon="data.phonenumber?'eva-phone-outline':'eva-phone-off-outline'">{{data.phonenumber?'Available':'Not available'}}
            </q-chip>
            <q-chip v-if="data.hosting.status!=='Touring'" outline :color="data.hosting.pets_allowed?'green':'red'" :text-color="data.hosting.pets_allowed?'text-green':'text-red'" icon="pets">{{data.hosting.pets_allowed?'Pets allowed':'Pets not allowed'}}
            </q-chip>
             <q-chip v-if="data.hosting.status!=='Touring'" outline   icon="family_restroom">Max guests: {{data.hosting.max_guests}}
            </q-chip>
        </q-item-label>
        <!-- <q-item-label class="row flex items-center" v-if="data.hosting.status!=='Touring'">
          <q-icon class="q-ml-sm" name="pets" :color="data.hosting.pets_allowed?'green':'red'" size="sm"></q-icon>
          <div :class="data.hosting.pets_allowed?'text-green':'text-red'">{{data.hosting.pets_allowed?'Pets allowed':'Pets not allowed'}}</div>
        </q-item-label> -->
        <!-- <q-item-label class="row flex items-center" v-if="data.hosting.status!=='Touring'">
          <q-icon class="q-ml-sm" name="family_restroom" size="sm"></q-icon>
          <div>Max guests: {{data.hosting.max_guests}}</div>
        </q-item-label> -->
        <q-item-label v-if="myUserId!==data.userId && loggedIn">
          <q-btn size="sm" :to="'/chat/'+data.userId" :style="buttonStyle">contact</q-btn>
          <q-btn class="q-ml-sm" size="sm" @click="$emit('viewUserProfile')" :style="buttonStyle">View profile</q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
    <!-- </q-intersection> -->
  </div>
</template>

<script>
// import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

    export default {
        mixins: [mixinGeneral],
        props:['data'],
        data(){
          return{
          }
        },
        components:{
          'hosting-stats' : require('components/Shared/Modals/HostingStats.vue').default,
        },
    }
</script>

