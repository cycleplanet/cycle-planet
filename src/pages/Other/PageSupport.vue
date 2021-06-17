<template>
  <q-page   >
    <div class="q-pa-md">
        <div class="q-pa-md">
          <p class="text-h4">Support</p>
          <q-separator class="q-mb-sm" />
          <p class="text-body1">The Cycle Planet website and apps are made and maintained on voluntary base. In fact, the founder Bas Idsinga quit his job to work on this website. In order to generate money, a few options have been reviewed, such as implementing advertisements, or applying extended features for paying members. But as much as Bas doesn't like these kind of moneymakers, he thinks a donation system is the best solution for this platform.</p>

          <div class="row">
            <q-card class="my-card q-ma-sm" style="max-width:300px" flat bordered>
              <q-card-section horizontal>
                <q-card-section class="q-pt-xs">
                  <div class="text-overline">Option 1</div>
                  <div class="cp-h2 q-mt-sm q-mb-xs">PayPal</div>
                  <div class="text-caption text-grey">
                      PayPal is the best method in case you want to make a single donation.
                  </div>
                </q-card-section>

                <q-card-section class="col-5 flex flex-center">
						      <q-img   src="~assets/social_icons/icon_paypal.png"/>
                </q-card-section>
              </q-card-section>

              <q-separator />

              <q-card-actions>
               
                <q-btn flat :style="buttonStyle" @click="openUrl('https://www.paypal.com/donate?hosted_button_id=3QVYVYFDHEZLC')">
                  Donate
                </q-btn>
              </q-card-actions>
            </q-card>



    <q-card class="my-card q-ma-sm" style="width:300px" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Option 2</div>
          <div class="cp-h2 q-mt-sm q-mb-xs">Patreon</div>
          <div class="text-caption text-grey">
            If you want to support Cycle Planet monthly, Patreon is the way to go.
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          
						<q-img   src="~assets/social_icons/icon_patreon.png"/>

        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
       
        <q-btn flat :style="buttonStyle" @click="openUrl('https://www.patreon.com/cycleplanet')">
          Donate
        </q-btn>
      </q-card-actions>
    </q-card>


      </div>

      
    </div>
    </div>
  </q-page>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    mixins: [mixinGeneral],

    methods:{
      
      clickPayPal(){
        window.location.assign('')
      },
      clickPatreon(){
        window.location.assign('https://www.patreon.com/cycleplanet')
		  },
    }

}
</script>

<style>

</style>