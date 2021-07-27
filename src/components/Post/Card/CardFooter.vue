<template>
<div class="q-pa-xs">
    <div class="row flex items-center q-gutter-x-sm ">
        <like-post :postItemData="postItemData" class="q-ml-md"/>
        <q-icon name="eva-message-circle-outline" class="cursor-pointer" size="md" @click="isWebApp?fullpostDialogWeb=true:fullpostDialogMobile=true"/>
        <q-icon v-if="postItemData.refKey==='Route'" name="get_app" @click="opengpxurl(postItemData.file)" size="md" class="cursor-pointer"/>
        <q-icon v-if="postItemData.refKey==='Blog'" name="launch" @click="openUrl(postItemData.link)" size="sm" class="cursor-pointer"/>
        <q-space></q-space>
        <q-icon class="q-mr-sm" name="share" @click="shareItem()"/>
    </div>
   
    <div class="row flex-items-center q-ma-sm" v-if="postItemData.likes">
        <div v-for="(user, userKey, index) in postItemData.likes" :key="index" >
            <q-avatar size="sm" style="margin-right:-10px" v-if="index<2 &&users[userKey]">
                <img :src="users[userKey].imageurl"  >
            </q-avatar>
        </div>
        <div style="margin-left:14px">Liked by {{Object.keys(postItemData.likes).length}} users</div>
    </div>
    <div v-if="!postItemData.likes" style="height:40px"> </div>
    <q-separator></q-separator>

    <div class="q-pa-xs">
        <div class="text-bold">{{postItemData.title}}</div>
            <div class="row flex-items-center q-ma-sm" v-if="postItemData.countries">
                <div class=" row q-gutter-x-sm">
                    <div v-for="(country, countryKey, index) in postItemData.countries" :key="index" >
                        <modal-countrychip2 :countryKey="countryKey"/>
                    </div>
                </div>
            </div>
            <q-item-label class="q-my-sm" v-if="postItemData.description" caption lines="2">{{postItemData.description}}</q-item-label>
            <q-item-label class="q-my-sm" v-if="!postItemData.description" caption style="height:30px">There is no description</q-item-label>
        </div>
        <q-separator></q-separator>

        
    <q-card-actions dense class="no-padding q-mt-sm" >
        <comment v-if="loggedIn && !postItemData.comments" class=" full-width"
        :path="'Posts/'+postItemData.postKey"
        />
    </q-card-actions>
    <div class="cursor-pointer" style="height:40px" v-if="postItemData.comments" @click="isWebApp?fullpostDialogWeb=true:fullpostDialogMobile=true">View all {{Object.keys(postItemData.comments).length}} comments</div>

    <q-dialog v-model="fullpostDialogWeb" style="min-width:100%;min-height:100%">

         <div class="row" style="min-width:100%;height:100%">
            <div class="col-8 bg-white items-center" style="min-width:66%">
                <gpx-track v-if="postItemData.refKey==='Route'" :postItemData="postItemData" style="heigh:500px"/>
                <video-embed v-if="postItemData.refKey==='Video'" class="videoclass" :src="postItemData.link" sandbox="allow-popups allow-scripts"/>
                <q-img class="full-width" :src="postItemData.image_url"  :ratio="16/9" @click="openUrl(postItemData.link)"/>
            </div>
            <div class="col-4 bg-white" style="min-height:100%">
               <dialog-mobile-post :postItemData="postItemData"/>
            </div>
        </div>
      
    </q-dialog>

    <q-dialog :maximized="true"  v-model="fullpostDialogMobile">
       <dialog-mobile-post :postItemData="postItemData"/>
    </q-dialog>

    <q-dialog v-model="shareDialog">
        <share-dialog :slug="'post/'+postItemData.postKey" :title="postItemData.title"/>
    </q-dialog>
    
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

	export default {
    props:['postItemData'],
    mixins: [ mixinGeneral],
	
    data() {
        return {
            fullpostDialogWeb:false,
            fullpostDialogMobile:false,
            shareDialog:false,
        }
    },
    components:{
        'gpx-track': require('components/Post/GpxTrack.vue').default,
        'comment': require('components/Shared/Modals/Comment.vue').default,
        'like-post': require('components/Post/Modals/LikePost.vue').default,
        'dialog-mobile-post': require('components/Post/Dialogs/DialogMobilePost.vue').default,
		'share-dialog': require('components/Shared/ShareDialog.vue').default,
    },
    computed: {
        
    },
    methods: {
        ...mapActions('post', ['likePost','dislikePost']),

        shareItem(){
            this.shareDialog=true
        },
       
        likePostMethod(type){
            if(type==='liked'){
                this.postItemData.likes={}
                this.postItemData.likes[this.myUserId]=true
            }
            this.setItemAction({
                path:'Posts/'+this.postKey+'/likes',
                data:this.postItemData.likes
            })

        },

       
       
        opengpxurl(url){
            window.open(url, '_blank');
		},
      
    },
    
    mounted() {
	 
	},
	destroyed() {//call a method when page is left
    
    },
	  
	 
	
	}
</script>
<style>
.videoclass > .embed-responsive-item{
    width: 100%;
    height: 800px;
}

</style>