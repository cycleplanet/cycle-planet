<template>
    <div>
        <div class="q-mb-md" v-if="countryData.name">
            <q-item class="no-padding">
                <q-item-section class="cp-h2">{{refsextra[refKey].title}} {{refKey==='Embassy'?countryData.name:''}}</q-item-section>
                <q-item-section side top>
                    <div>
                    <q-btn class="col-1" :style="buttonStyle" round icon="add" size="sm" @click.native="loggedIn ? AddItemMethod(refKey) : showLoginDialog()" v-if="showAddButton"/>

                    <q-btn flat @click.native="loggedIn ? AddItemMethod(refKey) : showLoginDialog()" v-if="showAddButton"></q-btn>
                    </div>
                </q-item-section>
            </q-item>
            <div class="text-italic">Sorted by most likes</div>
            <q-separator />

        </div>

        <div  v-if="orderMarkers && refKey!=='Border_item'">
            <q-list separator class="full-width">
                <div  v-for="(markerKey, index) in orderMarkers" :key="index">
                    <q-item clickable v-if="index<indexSeeDo">
                    <q-item-section  clickable v-ripple @click="openItem(landMarkers[markerKey])">
                            <q-item-label v-if="refKey!=='Embassy'">{{index+1}}. {{landMarkers[markerKey].title}} </q-item-label>
                            <q-item-label v-if="refKey==='Embassy'" class="row ">{{index+1}}. 
                                <div v-if="landMarkers[markerKey].onlineVisa">Online visa</div>
                                <div v-else>{{landMarkers[markerKey].country_located}} ({{landMarkers[markerKey].city}})</div>
                                
                                
                                </q-item-label>
                            <q-item-label caption lines="2" v-html="landMarkers[markerKey].description"></q-item-label>

                    </q-item-section>
                    <q-item-section side top>
                        <div class="row flex items-center">
                            <q-btn flat dense @click="openItem(landMarkers[markerKey])"
                            icon-right="chat" class="buttontheme2"
                            :label="landMarkers[markerKey].comments ? Object.keys(landMarkers[markerKey].comments).length : 0" />
                            <like-item class="text-black" :singleItemData="landMarkers[markerKey]" />

                        </div>
                    </q-item-section>
                    </q-item>
                   
                </div>
                <q-separator></q-separator>
                <q-item clickable v-if="Object.keys(orderMarkers).length>5&&Object.keys(orderMarkers).length!==indexSeeDo" class="row justify-center">
                    <div class="q-ma-sm text-bold" @click="indexSeeDo=Object.keys(orderMarkers).length">
                        See all ({{Object.keys(orderMarkers).length}})
                    </div>
                </q-item>
                <q-item clickable v-if="Object.keys(orderMarkers).length>5&&Object.keys(orderMarkers).length===indexSeeDo" class="row justify-center">
                    <div class="q-ma-sm text-bold" @click="indexSeeDo=5">
                        See less
                    </div>
                </q-item>
            </q-list>
            <div>
                <map-list-items
                :refKey="refKey"
                :orderMarkers="orderMarkers"
                :countryKey="countryKey"
                />
            </div>
        </div>
        <div v-if="orderMarkers&&refKey==='Border_item'" class="cp-p">
            <div v-if="countryData.borders_new?Object.keys(countryData.borders_new).length:false" >
                <div v-for="(neighbourcountry, neighbourcountryKey) in Object.keys(countryData.borders_new)" :key="neighbourcountryKey">
                    <div v-if="neighbourcountry!==countryKey" class="q-my-lg">

                        <div class="text-bold">{{neighbourcountry}}</div>
                    
                        <div v-if="!countryData.borders_new[neighbourcountry] ">
                        You can cross this border without having to go through customs.{{countryData.schengen&&allCountryData[neighbourcountry].schengen?' Both countries are part of the Schengen Area.':''}}
                        </div>

                        <div v-else-if="countryPresent[neighbourcountry]">
                            <q-list class="full-width">
                                    <!-- <div v-for="(listItem, listItemIndex, index) in orderMarkers" :key="index"> -->
                                    <div v-for="(markerKey, index) in orderMarkers" :key="index">

                                    <q-item clickable v-if="landMarkers[markerKey].country1.country===neighbourcountry||landMarkers[markerKey].country2.country===neighbourcountry">
                                        <q-item-section  clickable v-ripple @click="openItem(landMarkers[markerKey])">
                                                <q-item-label class="flex items-center">{{index+1}}. <img 
                                                :src="('countryflags/Flag_of_'+landMarkers[markerKey].country1.country+'.svg.png').split(' ').join('_')"
                                                style="width:25px"/>{{landMarkers[markerKey].country1.city}} - <img :src="('countryflags/Flag_of_'+landMarkers[markerKey].country2.country+'.svg.png').split(' ').join('_')" style="width:25px"/>{{landMarkers[markerKey].country2.city}}</q-item-label>
                                                <q-item-label caption lines="2" v-html="landMarkers[markerKey].description"></q-item-label>

                                        </q-item-section>
                                        <q-item-section side top>
                                            <div class="row flex items-center">
                                                <q-btn flat dense @click="openItem(landMarkers[markerKey])"
                                                icon-right="chat" class="buttontheme2"
                                                :label="landMarkers[markerKey].comments ? Object.keys(landMarkers[markerKey].comments).length : 0" />
                                                <like-item  class="text-black" :singleItemData="landMarkers[markerKey]" />

                                            </div>
                                        </q-item-section>
                                    </q-item>
                                    </div>
                                </q-list>
                        </div>
                        <div v-else class="text-italic">You need to pass customs on this border, but there are no points added yet.</div>
                        </div>

                    </div>
                </div>
                <div v-else class="q-mt-md">
                    This country doesn't have land borders with other countries.
                </div>

            <div class="col-6" v-if="borderCustomsPresent">
                <map-list-items
                :refKey="refKey"
                :orderMarkers="orderMarkers"
                :countryKey="countryKey"
                />
            </div>
        </div>

        <q-dialog :maximized="!isWebApp" v-model="addEmbassyItemDialog" >
			<add-marker-embassy 
			@close="addEmbassyItemDialog = false" 
			:refKey="clickedRef"
			:countryKey="countryKey"
			/>
		</q-dialog>

		<q-dialog :maximized="!isWebApp" v-model="addBorderItemDialog" >
			<add-marker-border 
			@close="addBorderItemDialog = false" 
			:refKey="clickedRef"
			:countryKey="countryKey"
			/>
		</q-dialog>

		<q-dialog :maximized="!isWebApp" v-model="addItemDialog" >
			<add-marker 
			@close="addItemDialog = false" 
			:refKey="clickedRef"
			:countryKey="countryKey"
			/>
		</q-dialog>

        <q-dialog :maximized="!isWebApp" v-model="itemDialog">
			<item-dialog  v-if="itemDetails"
			:singleItemData="itemDetails"
			@close="itemDialog = false" 
			/>
		</q-dialog>

       
      
    </div>
  
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  	mixins: [mixinGeneral],

    props:['countryKey','refKey'],

    components:{
		'item-dialog': require('components/Marker/ItemDialog.vue').default,
        'add-marker' : require('components/Map/Modals/AddMarker.vue').default,
		'add-marker-embassy' : require('components/Map/Modals/AddMarkerEmbassy.vue').default,
		'add-marker-border' : require('components/Map/Modals/AddMarkerBorder.vue').default,
		'map-list-items': require('components/Shared/MapListItems.vue').default,
        'like-item': require('components/Shared/Modals/LikeMarker.vue').default,
    },

    data() {
	  	return {
            clickedRef:'',
			itemDetails:{},
            itemDialog:false,
			addEmbassyItemDialog:false,
            addBorderItemDialog:false,
            addItemDialog:false,
            borderCountries:{},
            borderCustoms:true,
            indexSeeDo:5,
            indexBikeShop:5,
            indexEmbassy:5,
          }
    },
    computed:{

		...mapState('country', ['singleItemData','borderItem','allCountryData','countryData','videoData','blogData']),

        showAddButton(){
            if(this.refKey==='Embassy'){
                return true
            }else if(this.refKey==='Border_item'){
                if(this.borderCustomsPresent){
                    return true
                }else{
                    return false
                }
            }else{
                return true
            }
        },
        countryPresent(){
            let bordersExisting = Object.keys(this.countryData.borders_new)
            bordersExisting.forEach(element => {

                this.borderCountries[element]=false
            })
            this.orderMarkers.forEach(element => {
                if(this.landMarkers[element].refKey==='Border_item'){
                    this.borderCountries[this.landMarkers[element].country1.country]=true
                    this.borderCountries[this.landMarkers[element].country2.country]=true
                }
            })
            return this.borderCountries
        },
        borderCustomsPresent(){
            let x = 0
            let bordersExisting = Object.keys(this.countryData.borders_new).length
            if(bordersExisting>0){
                let borderOpen = Object.values(this.countryData.borders_new)
                borderOpen.forEach(element => {
                    if(element){
                        x++
                    }
                })
                if(x>0){
                this.borderCustoms=true
                return true
                }else{
                this.borderCustoms=false
                return false
                }

            }else{
                this.borderCustoms=false
                return false
            }
        },
        orderMarkers(){
            let markerItems=[]
            let allLandMarkers = Object.keys(this.landMarkers)
            allLandMarkers.forEach(element => {

                let itemId = element
                let itemDetails = this.landMarkers[element]
                if(itemDetails.refKey==='Border_item'){
                    if((itemDetails.country1.country===this.countryKey||itemDetails.country2.country===this.countryKey)&&itemDetails.refKey===this.refKey){
                        markerItems.push(itemId)
                    }
                }else{
                    if(itemDetails.countryKey===this.countryKey&&itemDetails.refKey===this.refKey){
                        markerItems.push(itemId)
                    }
                }
            })
            markerItems.sort((a,b) => {
                let AProp = (this.landMarkers[a].likes ? Object.keys(this.landMarkers[a].likes).length : 0 )
                let	BProp = (this.landMarkers[b].likes ? Object.keys(this.landMarkers[b].likes).length : 0 )

                if (AProp < BProp) return 1
                else if (AProp > BProp) return -1
                else return 0
            })
           
            return markerItems
        },
        markersSorted () {
            let markersSorted = [],
            keysOrdered = Object.keys(this.orderMarkers)
            keysOrdered.forEach((key) => {
                markersSorted[key] = this.landMarkers[key]
            })
            return markersSorted
	    },

    },

    methods:{
       
       editItemMethod(){
            this.editItem=true
        },
        openItem(listItem){
            this.itemDetails=listItem
            this.itemDialog=true
        },
        AddItemMethod(ref){
            if(this.refsextra[ref].tilelist){
            this.clickedRef=ref
            if(ref==='Embassy'){this.addEmbassyItemDialog=true}
            else if(ref==='Border_item'){this.addBorderItemDialog=true}
            else{this.addItemDialog=true}
            }
        },
        
    
    },
}
</script>

<style>

</style>