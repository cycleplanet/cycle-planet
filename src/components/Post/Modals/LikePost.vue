<template>
    <div>
        <div class="flex items-center">
            <!-- <div class="q-mr-xs text-body2">{{postItemData.likes?Object.keys(postItemData.likes).length:0}}</div> -->
            <q-icon class="cursor-pointer" :name="postItemData.likes?(postItemData.likes[myUserId]?'eva-heart':'eva-heart-outline'):'eva-heart-outline'" 
            size="md"
            :color="postItemData.likes?(postItemData.likes[myUserId]?'red':''):''"
            @click="postItemData.likes?(postItemData.likes[myUserId]?clickDislikeItem():clickLikeItem()):clickLikeItem()"/>
            </div>
        </div>
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    props:['postItemData'],
    mixins: [mixinGeneral],
    data(){
        return{
        }
    },

    computed:{
                
        postKey(){
            return this.postItemData.postKey
        },
        
    },

    methods:{
        clickLikeItem(){
            if(this.loggedIn){
                if(this.postItemData.likes){
                    this.postItemData.likes[this.myUserId]=true
                }else{
                    this.postItemData.likes={
                        [this.myUserId]:true
                    }
                }
               
                this.setItemAction({
                    path:'Posts/'+this.postKey+'/likes/'+this.myUserId,
                    data:true
                })
            }else{
                this.showLoginDialog()
            }
        },
        clickDislikeItem(){
            this.deleteItemAction({
                path:'Posts/'+this.postKey+'/likes/'+this.myUserId,
            })
            
           
        },
    }
}
</script>

<style>

</style>