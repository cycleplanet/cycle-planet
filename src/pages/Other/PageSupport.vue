<template>
  <q-page   >
    <div class="q-pa-md">
      <div class="q-pa-md">
        <p class="text-h4">Support</p>
        <q-separator class="q-mb-sm" />
        <div class="text-body1">The Cycle Planet website and apps are made and maintained on voluntary base. In fact, the founder Bas Idsinga quit his job to work on this website. In order to generate money, a few options have been reviewed, such as implementing advertisements, or applying extended features for paying members. But as much as Bas doesn't like these kind of moneymakers, he thinks a donation system is the best solution for this platform.</div>
        <div class="text-body1 q-mt-md">We're using <a href="https://opencollective.com/cycle-planet">Open Collective</a> to receive donations, on which we can be transparent about all the received donations and the costs that we make.</div>
        <q-btn class="q-mt-md" :style="buttonStyle" @click="openUrl('https://opencollective.com/cycle-planet')">donate</q-btn>

      </div>
    </div>
  </q-page>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    mixins: [mixinGeneral],

    methods:{
      
    }

}
</script>

<style>

</style>