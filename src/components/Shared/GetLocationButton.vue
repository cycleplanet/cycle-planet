<template>
    <div class="row flex items-center" v-if="myUserDetails">
        <q-btn class="q-my-sm row" v-if="locationSupported" :size="isWebApp?'md':'sm'" @click="loggedIn?getLocation():showLoginDialog()" icon="eva-navigation-2-outline" rounded :class="loggedIn?(myUserDetails.coordinates?'bg-secondary text-white':'bg-red text-white'):'bg-red text-white'">{{loggedIn?(myUserDetails?(myUserDetails.coordinates?'update my location':'find my location'):'find my location'):'add my location'}}</q-btn>
        <q-spinner v-if="locationLoading" color="secondary" size="2em" />
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { Geoapify } from 'src/functions/geoapify'

export default {
    mixins: [mixinGeneral],
    data() {
        return {
            locationLoading: false,
        }
    },

    methods: {
        getLocation() {
            this.locationLoading = true
            navigator.geolocation.getCurrentPosition(position => {
                this.getCityAndCountry(position)
            }, err => {
                this.locationError()
            }, { timeout: 7000 })
        },
        getCityAndCountry(position) {
            Geoapify.reverseGeocode(position.coords.latitude, position.coords.longitude).then(address => {
                this.locationSuccess(address, position)
            }).catch(err => {
                this.locationError()
            })
        },
        locationSuccess(address, position) {
            if (address) {
                updateItemAction({
                    path:'Users/'+this.userId,
                    data:{
                        coordinates: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }
                })
            }
            this.locationLoading = false
        },
        locationError() {
            this.$q.dialog({
                title: 'Error',
                message: result.data
            })
            this.locationLoading = false
        },
    }

}
</script>

<style>

</style>
