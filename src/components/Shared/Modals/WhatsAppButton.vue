<template>
<div class="q-mr-sm">
    <q-btn outline rounded color="green" @click="openwhatsappgroup(WAgroup.link)">
            <img style="height:25px;width:25px" class="q-mr-sm" src="social_icons\icon_whatsapp.png">
        <div>{{WAgroup.name}}</div>
    </q-btn>
</div>

</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
    mixins: [mixinGeneral],
    props:['WAgroup'],

    methods:{
        openwhatsappgroup(url){
            if(this.isApple){
                        cordova.InAppBrowser.open(url, '_blank', 'location=yes');
            }else{
                        window.open(url, '_blank');
            }
        },
    },

}
</script>

<style>

</style>