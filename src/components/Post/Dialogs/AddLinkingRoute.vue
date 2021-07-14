<template>
  <div>
      <q-card class="bg-white"> 
            <modal-header>Link other routes</modal-header>
            <div class="q-ma-sm text-h6" v-if="!selectedCollection">Select collection</div>
            <div class="q-ma-sm text-h6 row items-center cursor-pointer" v-if="selectedCollection">
                <q-icon name="arrow_backward" @click="selectedCollection=''"/>
                <div>Return</div>
            </div>
            <q-separator></q-separator>

            <q-list v-if="postItemData.collections">
                <div v-if="!selectedCollection">
                    <div v-for="collection in postItemData.collections" :key="routeItem">
                        <q-item clickable v-ripple @click="selectedCollection=collection">
                            <q-item-section>
                                <q-item-label>{{collection}}</q-item-label>
                                <q-item-label>{{Object.keys(routeCollectionData[collection].routes).length}} routes</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-icon name="arrow_forward"/>
                            </q-item-section>   
                        </q-item>
                        <q-separator></q-separator>
                    </div>
                </div>
                <div v-if="selectedCollection">
                    <div class="q-ma-sm">
                        <div>Selected collection: {{selectedCollection}}</div>
                        <q-btn :style="buttonStyle" icon="add" label="add route" @click="addRouteDialog=true" />
                        </div>
                    <q-list>
                        <div v-for="(routeKey, index) in routeCollectionData[selectedCollection].routes" :key="index">
                            <q-item >
                                <q-item-section>{{index+1}}. {{routePostsSorted[routeKey].title}}</q-item-section>
                                <q-item-section side>
                                    <q-btn dense flat round size="sm" v-if="index!==0"  icon="expand_less"></q-btn>
                                    <q-btn dense flat round size="sm" v-if="index+1!==Object.keys(routeCollectionData[selectedCollection].routes).length" icon="expand_more"></q-btn>

                                </q-item-section> 
                                <q-item-section side>
                                    <q-btn flat round icon="delete" @click="onClick" />
                                </q-item-section>  
                            </q-item>
                            <q-separator></q-separator>
                        </div>
                    </q-list>

                </div>
            </q-list>
            <div v-else>
                <div>There are no collections yet</div>
            </div>
        </q-card>

        <q-dialog v-model="addRouteDialog" :maximized="true">
            <q-card class="bg-white"> 
            <modal-header>Link other routes</modal-header>
            <q-checkbox v-model="showMyRoutes" label="Show only my routes" />
             <q-input v-model="searchField" @keyup.esc="searchField = ''" v-select-all rounded outlined class="col bg-white" label="Search route">
                <template v-slot:append>
                <q-icon v-if="searchField !== ''" name="close" @click="searchField = ''" class="cursor-pointer" />
                <q-icon name="search" />
                </template>
            </q-input>
            <q-list>
                <div v-for="(routeItem, routeItemKey) in routePostsFiltered" :key="routeItemKey">
                    <div v-if="showMyRoutes?routeItem.user_created===myUserId:true">
                    <q-item clickable v-ripple>
                        <q-item-section>
                            <q-item-label><b>{{routeItem.title}}</b></q-item-label>
                            <q-item-label class="text-italic">id: {{routeItem.postKey}}</q-item-label>
                            <q-item-label><modal-username2 :userId="routeItem.user_created"/></q-item-label>

                        </q-item-section>
                        <q-item-section side>
                            <q-btn round size="sm" :style="buttonStyle" icon="add" @click="addRoute(routeItemKey)"></q-btn>
                        </q-item-section>   
                    </q-item>
                    <q-separator></q-separator>
                    </div>

                </div>
            </q-list>
        </q-card>
        </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import mixinGeneral from 'src/mixins/mixin-general.js'
import { selectAll } from 'src/directives/directive-select-all'
export default {
    mixins: [ mixinGeneral],
    props:['postItemData'],
    data(){
        return{
            selectedCollection:'',
            addRouteDialog:false,
            showMyRoutes:true,
        }
    },
    computed:{
		...mapState('post', ['routeCollectionData','searchRoute']),
		...mapGetters('post', ['routePostsFiltered']),
        searchField: {
            get() {
                return this.search
            },
            set(value) {
                this.setSearch(value)
            }
        }
    },
    methods:{
            ...mapActions('post', ['getPosts','getRouteCollections','setSearch']),
            writenew(){
                this.setItemAction({
                    path:'RouteCollection/test',
                    data:{
                        routes:this.postItemData.postKey
                    }
                })
            },
            addRoute(routeItemKey){
                console.log('addroute 1', routeItemKey);
                console.log('addroute 2', this.routePostsSorted[routeItemKey]);
                let newArray=this.routeCollectionData[this.selectedCollection].routes
                console.log('addroute 3', newArray);
                newArray.push(routeItemKey)
                console.log('addroute 4', newArray);
                this.updateItemAction({
                    path:'RouteCollection/test',
                    data:{
                        routes:newArray
                    }
                })
            }
    },
    created(){
        this.getPosts()
        this.getRouteCollections()
    },
    directives: {
        selectAll
    }
}
</script>

<style>
</style> 