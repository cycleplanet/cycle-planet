<template>
 <q-page   >
    <div class="q-pa-md">
        <div class="q-pa-md">
          <p class="text-h4">Team</p>
        <q-separator class="q-mb-sm" />
          <p class="text-body1">Cycle Planet is run by volunteers, and is happy to see other people joining the team to help improving and growing the community. Please contact Cycle Planet if you have interests in joining.</p>
          <div class="row">
          </div>

          <div>
            <div class="cp-h2 q-mt-md">Team members</div>
            <div class="text-blue-8 cursor-pointer" v-if="loggedIn" @click="applyDeveloper=true">Become a team member</div>
          </div>
          <div class="row q-mt-sm">
            <div v-for="(user, userId) in users" :key="userId">
              <div v-if="user.role==='team'"  >
                <q-card class="my-card q-ma-sm" style="width:230px" flat bordered>
                  <q-card-section vertical>
                    <q-avatar size="100px">
                      <img :src="user.imageurl"/>
                    </q-avatar>
                  </q-card-section>
                   <q-card-section>
                    <div class="cp-h2 cursor-pointer" @click="clickuser(user.userId)">{{user.fullname}}</div>
                    <div class="text-subtitle2">{{user.teamrole}}</div>
                  </q-card-section>
                  
              </q-card>
                <!-- <modal-username3 :userId="userId"/> -->
              </div>
            </div>
          </div>

          <div>
            <div class="cp-h2 q-mt-md">Contact persons for countries</div>
            <div class="text-blue-8 cursor-pointer" v-if="loggedIn" @click="applyContact=true">Become a contact person for your country</div>
          </div>
          <div class="row q-mt-sm">
            <div v-for="(country, countryId) in allCountries" :key="countryId">
              <div v-if="country.contactperson" >
                <div v-for="(user, userId) in country.contactperson" :key="userId">
                  <modal-username4 :userId="userId" :countryId="countryId"/>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="cp-h2 q-mt-md">Editors</div>
            <div class="text-blue-8 cursor-pointer" v-if="loggedIn" @click="applyEditor=true">Become an editor</div>
          </div>
          <div class="row q-mt-sm">
            <div v-for="(user, userId) in users" :key="userId">
              <div v-if="user.role==='editor'" >
                <modal-username3 :userId="userId"/>
              </div>
            </div>
          </div>
       
       
       </div>
    </div>

    <q-dialog v-model="applyDeveloper" >
			<apply-team @close="applyDeveloper = false" />
		</q-dialog>

    <q-dialog v-model="applyContact" >
			<apply-contact @close="applyContact = false" />
		</q-dialog>

    <q-dialog v-model="applyEditor" >
			<apply-editor @close="applyEditor = false" />
		</q-dialog>

  </q-page>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import ModalUsername3 from 'src/components/Shared/Modals/ModalUsername3.vue';
export default {
  mixins: [mixinGeneral],
  components: { 
		'apply-contact': require('components/Shared/ApplyContact.vue').default,
		'apply-editor': require('components/Shared/ApplyEditor.vue').default,
		'apply-team': require('components/Shared/ApplyDeveloper.vue').default,
    
   },
  data() {
	  	return {
				applyDeveloper:false,
				applyEditor:false,
        applyContact:false,
        persons:{
          'bas':{
            name:'Bas Idsinga',
            function:'Founder',
            website:'https://www.basidsinga.com/',
            image:'https://firebasestorage.googleapis.com/v0/b/cycle-planet-292f5.appspot.com/o/users%2FieMGYdJeX6ZyKgKeeGhMXPFZkax2%2Fb3dd33d5-136a-4f37-bd7c-b74020df6d51?alt=media&token=4dab1517-e479-4c2a-a961-49a35ef1a5c6',
            description:'Relatively fresh in the bike touring world, Bas started cycling in 2019 in Europe and Africa. During this trip he found the idea of creating the Cycle Planet platform, and during the Corona epidemic he started building it.',
            id:'ieMGYdJeX6ZyKgKeeGhMXPFZkax2'
          },
          
        }
      }
   },
    methods:{
    clickuser(userId){
			this.$router.push('/user/'+userId)
		},
    }
}
</script>

<style>

</style>