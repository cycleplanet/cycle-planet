<template>
  <div class="q-pa-xs">
    

      <div class="q-pa-xs">
        <div class="row">
          <div class="text-h4">{{postItemData.title}}</div>
          <q-space></q-space>
          <q-btn v-if="loggedIn?(roleEditor||postItemData.user_created===myUserId):false" icon="edit" round :style="buttonStyle" @click="editPostDialog=true"/>
        </div>
        <div class="row items-center">Created by <modal-username2 :userId="postItemData.user_created"/></div>
          <div class="row flex-items-center q-ma-sm" v-if="postItemData.countries">
              <div class=" row q-gutter-x-sm">
                  <div v-for="(country, countryKey, index) in postItemData.countries" :key="index" >
                      <modal-countrychip2 :countryId="countryKey"/>
                  </div>
              </div>
          </div>
          <q-item-label class="q-my-sm" v-if="postItemData.description" caption lines="2">{{postItemData.description}}</q-item-label>
          <q-item-label class="q-my-sm" v-if="!postItemData.description" caption style="height:30px">There is no description</q-item-label>
      </div>
      <q-separator></q-separator>

      <div class="row flex items-center q-gutter-x-sm q-mt-sm">
        <like-post :postItemData="postItemData" class="q-ml-md"/>
        <q-space></q-space>
        <q-btn v-if="postItemData.refKey==='Route'" icon="get_app" rounded :style="buttonStyle" label="Download gpx" @click="opengpxurl(postItemData.file)"/>
        <q-btn v-if="postItemData.refKey==='Blog'" icon="open_in_new" rounded :style="buttonStyle" label="Visit article" @click="openUrl(postItemData.link)"/>
        <q-btn class="q-mr-sm" rounded :style="buttonStyle" label="share" icon="share" @click="shareItem()"/>
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

        
    <q-card-actions dense class="no-padding q-mt-sm" >
        <comment v-if="loggedIn && !postItemData.comments" class=" full-width"
        :path="'Posts/'+postItemData.postKey"
        />
    </q-card-actions>
    <div class="cursor-pointer" style="height:40px" v-if="postItemData.comments" @click="isWebApp?fullpostDialogWeb=true:fullpostDialogMobile=true">View all {{Object.keys(postItemData.comments).length}} comments</div>

    <q-dialog v-model="shareDialog">
        <share-dialog :slug="'post/'+postItemData.postKey" :title="postItemData.title"/>
    </q-dialog>

    <q-dialog v-model="editPostDialog">
      <edit-post :postItemData="postItemData" @close="editPostDialog=false"/>
    </q-dialog>
    
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

	export default {
    props:['postItemData'],
    mixins: [ mixinGeneral],
	
    data() {
        return {
            editPostDialog:false,
            shareDialog:false,
        }
    },
    components:{
        'edit-post': require('components/Post/Dialogs/EditPost.vue').default,
        'comment': require('components/Shared/Modals/Comment.vue').default,
        'like-post': require('components/Post/Modals/LikePost.vue').default,
        'share-dialog': require('components/Shared/ShareDialog.vue').default,
    },
   
    methods: {
        ...mapActions('post', ['likePost','dislikePost']),

        shareItem(){
            this.shareDialog=true
        },
       
        opengpxurl(url){
            window.open(url, '_blank');
		},
      
    },
    
	
	}
</script>

<style>

</style>