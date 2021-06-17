<template>
    <div class="">
        <div class="row">
            <modal-username2 :userId="postItemData.user_created"/>
            <q-space/>
            <q-btn flat round icon="more_vert">
                <q-menu anchor="top right" self="top left">
                <q-item clickable>
                    <q-item-section @click="reportPostMethod">Report</q-item-section>
                </q-item>
                <q-item clickable v-if="loggedIn?(roleEditor||postItemData.user_created===myUserId):false">
                    <q-item-section @click="editPostDialog=true">Edit</q-item-section>
                </q-item>
                <q-item clickable>
                    <q-item-section @click="deletePostMethod">Delete</q-item-section>
                </q-item>
                
                </q-menu>
            </q-btn>
        </div>
        <q-separator class=""/>

        <q-dialog v-model="editPostDialog">
            <edit-post :postItemData="postItemData" @close="editPostDialog=false"/>
        </q-dialog>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
	mixins: [mixinGeneral, ],

    props:['postItemData'],
     data() {
	  	return {
              editPostDialog:false,
          }
     },
    
    components:{
        'edit-post': require('components/Post/Dialogs/EditPost.vue').default,

    },
    computed: {

    },
    methods:{
        ...mapActions('post', ['reportPost','deletePost']),

        reportPostMethod(){
            this.$q.dialog({
                title: 'Confirm',
                message: 'Tell us why you want to report this item.',
                prompt: {
                    model: '',
                    isValid: val => val.length > 2, // << here is the magic
                    type: 'text' // optional
                },
                ok: {
                    push: true,
                    label:'report'
                },
                cancel: true,
                persistent: true
            }).onOk(data => {
                this.reportPost({
                    data:{
                        issue:data,
                        postKey:this.postItemData.postKey,
                        date:this.timeStamp,
                        user:this.myUserId
                    }
                }) 
            }) 

        },
        
        deletePostMethod() {
            this.$q.dialog({
                title: 'Confirm',
                message: 'Really delete?',
                ok: {
                    push: true
                },
                cancel: {
                    color: 'negative'
                },
                persistent: true
                }).onOk(() => {
                this.deleteItemAction({
                    path:'Posts/'+this.postItemData.postKey
                }) 
            })
        } 
      
    }
}
</script>

<style>

</style>