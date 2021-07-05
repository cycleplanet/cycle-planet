<template>

  <q-card class="no-padding" >
        <form @submit.prevent="saveEditFormMethod()">
            <modal-header>Edit {{refKey}}</modal-header>
           
            <q-card-section class="q-gutter-y-md">
                <q-banner rounded class="bg-orange-2 text-orange-10">All logged in users can edit this information, but please make sure to follow our <span class="underline cursor-pointer" @click="clickGuidelines()">guidelines</span>.</q-banner>
                <q-banner v-if="refsextra[refKey].description" rounded class="bg-green-2 text-green-10"><b>What to write in this section?</b><br/>{{refsextra[refKey].description}}</q-banner>

                <div v-for="(item, index) in refsextra[refKey].items" :key="index" >
                    <div v-if="refKey==='QuickFacts'">
                            <q-input filled autogrow :label="item.title"  v-model="inputListItem[index]"/>
                    </div>
                 <div v-else class="q-my-md">
                    <div class="text-h6 q-mt-md">{{item.title}}</div>
                    <q-banner v-if="item.description" rounded class="bg-green-2 text-green-10 q-mb-sm"><b>What to write in this section?</b><br/>{{item.description}}</q-banner>
                    
                        <!-- <q-input filled autogrow :label="item.title" class="q-pa-md" v-model="inputListItem[index]"/> -->
                   <list-description :data.sync="inputListItem[index]"/>
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="text-bg-secondary">
              <q-btn :style="buttonStyle" label="Save" type="submit"/>
            </q-card-actions>
  
        </form>
    </q-card>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  	mixins: [mixinGeneral, ],

    props:['refKey','countryKey','data'],

    data() {
	  	return {
        inputListItem:{},
        translateOption:false,
	  	}
	  },
      components:{
		'list-description': require('components/Country/Modals/ListDescription.vue').default,
	},

    computed:{
        ...mapState('country', ['countryData']),
    },

    methods:{
      ...mapActions('country', ['destroyData']),

      saveEditFormMethod(){
        this.inputListItem.date_edited=this.timeStamp
        if(this.translateOption){
          this.inputListItem.user_edited='01dRgHcnFiTSprDGCEB4Jxq7iDH3'
        }else{
          this.inputListItem.user_edited=this.myUserId
        }
        // this.inputListItem.body=this.inputBody
        this.updateItemAction({
          path:'Country_data/' + this.countryKey+'/'+this.refKey,
          data:this.inputListItem,
        })
       
      this.$emit('close')
      }
    },
    
  mounted() {
    if(this.data){
			this.inputListItem = Object.assign({}, this.data)
    }else{
      this.inputListItem ={
        body:''
      }
    }
  }

}
</script>

<style>

</style>