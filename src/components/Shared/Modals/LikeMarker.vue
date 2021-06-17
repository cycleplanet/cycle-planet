<template>
    <div>
        <div class="flex items-center">
            <div class="q-mr-xs text-body2">{{singleItemData.likes?Object.keys(singleItemData.likes).length:0}}</div>
            <q-icon :name="singleItemData.likes?(singleItemData.likes[myUserId]?'favorite':'favorite_border'):'favorite_border'" 
            :color="singleItemData.likes?(singleItemData.likes[myUserId]?'red':''):''"
            @click="singleItemData.likes?(singleItemData.likes[myUserId]?clickDislikeItem():clickLikeItem()):clickLikeItem()"/>
            </div>
        </div>
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import  firebase from 'firebase/app';
import { firebase as firebaseConfig } from 'boot/config'

export default {
    props:['singleItemData'],
    mixins: [mixinGeneral],

    computed:{
                
        itemKey(){
            return this.singleItemData.itemKey
        },
    },

    methods:{
        clickLikeItem(){
            if(this.loggedIn){
                if(this.singleItemData.likes){
                    this.singleItemData.likes[this.myUserId]=true
                }else{
                    this.singleItemData.likes={
                        [this.myUserId]:true
                    }
                }
                firebaseConfig.fs.collection('Markers').doc(this.itemKey).update({likes:this.singleItemData.likes})
            }else{
                this.showLoginDialog()
            }
        },
        clickDislikeItem(){
            
            firebaseConfig.fs.collection('Markers').doc(this.itemKey).set({
                likes:{
                    [this.myUserId]:firebase.firestore.FieldValue.delete()
                }
            }, { merge: true })
        },
    }
}
</script>

<style>

</style>