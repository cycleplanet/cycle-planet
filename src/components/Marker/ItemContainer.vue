<template>
<div class="q-pa-md">
    <div v-if="refKey==='Embassy'">
        <p class="text-subtitle1" v-if="!singleItemData.onlineVisa">Visa for <b>{{countryKey}}</b> in <b>{{singleItemData.country_located}}</b></p>
        <div v-if="singleItemData.onlineVisa" class="q-mb-md">
            <p class="text-subtitle1">E-Visa for <b>{{singleItemData.country}}</b></p>

            <q-btn rounded :style="buttonStyle" label="Website e-visa" @click="openUrl(singleItemData.website)" />
            
        </div>
        <!-- <div v-else>
            <p class="text-subtitle1"><b>Place:</b> {{singleItemData.city}}</p>
            <div class="row text-subtitle1">
                <p class="q-mr-md"><b>Latitude:</b> {{singleItemData.coordinates.lat}}</p>
                <p ><b>Longitude:</b> {{singleItemData.coordinates.lng}}</p>
            </div>
        </div> -->
    </div>
    <div v-if="refKey==='Border_item'">
        <p class="text-subtitle1">Border crossing from <b> {{singleItemData.country1.country}} ({{singleItemData.country1.city}}) </b>to<b> {{singleItemData.country2.country}} ({{singleItemData.country2.city}})</b> </p>
    </div>
    <p class="text-subtitle1" v-if="refKey!=='Border_item'&&refKey!=='Embassy'"><b>Title:</b> {{singleItemData.title}}</p>
    <p class="text-subtitle1 row flex items-center" v-if="refKey!=='Border_item'&&refKey!=='Embassy'"><b>Country:</b> <modal-countrychip :countryKey="singleItemData.countryKey"/></p>
    <div class="row text-subtitle1" v-if="!singleItemData.onlineVisa">
        <p class="q-mr-md"><b>Latitude:</b> {{singleItemData.coordinates.lat}}</p>
        <p ><b>Longitude:</b> {{singleItemData.coordinates.lng}}</p>
    </div>
    <div class="row">
            <p class="text-bold text-subtitle1">Description</p>
            <q-space></q-space>
            <div class="text-blue-10 underline cursor-pointer" v-if="singleItemData.description_translated">Translate
                <q-menu>
                    <q-list style="min-width: 100px">
                        <q-item clickable v-close-popup v-for="(languageData, languageKey) in translateOptions" :key="languageData">
                        <q-item-section @click="changeLanguage(languageData.code)">{{languageKey}}</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </div>
    </div>
    <div v-if="singleItemData.description" class="text-subtitle1" v-html="languageSelected==='en'?singleItemData.description:singleItemData.description_translated[languageSelected]"></div>
    <div v-else>There is no description yet. Be the first to add one.</div>

    <div v-if="refKey==='Embassy'">
        <p class="text-bold cp-h2">Available visas</p>
        <q-list bordered  class="bg-white">
            <q-item class="text-bold">
                <q-item-section>Type</q-item-section>
                <q-item-section>Length</q-item-section>
                <q-item-section>Costs</q-item-section>
            </q-item>
            <q-separator />
            <div v-if="singleItemData.visas">
                <div v-for="visa in singleItemData.visas" :key="visa">
                    <q-item  v-ripple>
                        <q-item-section>{{visa.title}}</q-item-section>
                        <q-item-section>{{visa.leng}}</q-item-section>
                        <q-item-section>{{visa.costs}}</q-item-section>
                    </q-item>
                    <q-separator />
                </div>
            </div>
            <div v-else class="q-pa-sm">
                <p>There are no visas added yet</p>
            </div>
        </q-list>
    </div>
</div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'


export default {
    props:['singleItemData'],
  	mixins: [mixinGeneral, ],
    data(){
        return{
            translateOptions:{
                'English':{code:'en'},
                'Arabic':{code:'ar'},
                'German':{code:'de'},
                'Spanish':{code:'es'},
                'French':{code:'fr'},
                'Dutch':{code:'nl'},
                'Portuguese':{code:'pt'},
                'Russian':{code:'ru'},
                'Chinese':{code:'zh'},
            },
            languageSelected:'en',
        }
    },
    computed:{
        refKey(){
            return this.singleItemData.refKey
        },
        countryKey(){
            return this.singleItemData.countryKey
        },
        itemKey(){
            return this.singleItemData.itemKey
        },
    },
    methods:{
        changeLanguage(code){
            this.languageSelected=code
        },
    }

}
</script>

<style>

</style>