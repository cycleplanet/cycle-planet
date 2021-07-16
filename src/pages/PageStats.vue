<template>
  <div class="q-gutter-y-md" style="margin-top:40px" v-if="statistics">

    <div class="title">Members</div>
    <div class="row q-gutter-x-md" >
    <q-card class="col q-pa-md" >
        <div class="text-h5">Total users</div>
        <q-separator class="q-my-sm"/>
        <div class="text-h5 text-center flex justify-center items-center" style="height:80%;">{{statistics.total_users}}</div>
    </q-card>
    <q-card class="col q-pa-md">
        <div class="text-h5">Type of users</div>
        <q-separator class="q-my-sm"/>
        <q-chip v-for="(number,refKey) in statistics.type_of_users" :key="refKey">
            <q-avatar v-if="refKey">
                <img :src="markerlist[refKey].iconurl">
            </q-avatar>
            <div>{{number}} {{markerlist[refKey].title}}</div>
        </q-chip>
    </q-card>
    <q-card class="col q-pa-md">
        <div class="text-h5">Countries represented</div>
        <q-separator class="q-my-sm"/>
        <q-chip v-for="(number,countrycode) in statistics.users_in_country" :key="countrycode">
            <q-avatar>
                <img :src="`countryflagsnew/${countrycode}.svg`">
            </q-avatar>
            <div>{{number}} users</div>
        </q-chip>
    </q-card>
    </div>
    <q-card>
        <q-option-group
        v-model="groupusers"
        :options="options_user"
        color="primary"
        inline
        />
        <chart-line :chart-data="userGraphData" :width="300" :height="150"/>
    </q-card>

    <div class="title" style="margin-top:70px">Markers</div>
    <div class="row q-gutter-x-md" >
    <q-card class="col q-pa-md" >
        <div class="text-h5">Total markers</div>
        <q-separator class="q-my-sm"/>
        <div class="text-h5 text-center flex justify-center items-center" style="height:80%;">{{statistics.total_markers}}</div>
    </q-card>
    <q-card class="col q-pa-md">
        <div class="text-h5">Type of markers</div>
        <q-separator class="q-my-sm"/>
        <q-chip v-for="(number, refKey) in statistics.type_of_markers" :key="refKey">
            <q-avatar>
                <img :src="markerlist[refKey].iconurl">
            </q-avatar>
            <div>{{number}} {{markerlist[refKey].title}}</div>
        </q-chip>
    </q-card>
    <q-card class="col q-pa-md">
        <div class="text-h5">Countries represented</div>
        <q-separator class="q-my-sm"/>
        <q-chip v-for="(number,countrycode) in statistics.markers_in_country" :key="countrycode">
            <q-avatar>
                <img :src="`countryflagsnew/${countrycode}.svg`">
            </q-avatar>
            <div>{{number}} users</div>
        </q-chip>
    </q-card>
    </div>
    <q-card class="q-mb-lg">
        <q-option-group
        v-model="groupmarkers"
        :options="options_marker"
        color="primary"
        inline
        />
        <chart-line :chart-data="markerGraphData" :width="300" :height="150"/>
    </q-card>

    <div v-if="admin">
        <q-separator class="q-my-lg"/>
        <div >
            <div class="text-h2">More statistics (only for admins)</div>
            <div class="title" style="margin-top:70px">Top 10 by points</div>
            <div class="row q-gutter-x-md">
                <q-card class="col q-pa-md">
                    <div class="text-h5">Overall</div>
                    <q-separator class="q-my-sm"/>
                   <q-expansion-item v-for="(user, index) in statistics.toplist_points_overall" :key="user">
                        <template v-slot:header>
                      
                        <q-item-section >
                            <div class="row flex items-center">{{index+1}}.<modal-username2 :userId="user.userId"/></div>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge :label="user.points" />
                        </q-item-section>
                        </template>
                        <div>
                             <q-chip v-for="(number,item) in user.lists" :key="item">{{number}} x {{item}}</q-chip>
                        </div>
                   </q-expansion-item>
                </q-card>
                <q-card class="col q-pa-md">
                    <div class="text-h5">Give away 2 (july-october 2021)</div>
                    <q-separator class="q-my-sm"/>
                   <q-expansion-item v-for="(user, index) in statistics.toplist_points_giveaway" :key="user">
                        <template v-slot:header>
                      
                        <q-item-section >
                            <div class="row flex items-center">{{index+1}}.<modal-username2 :userId="user.userId"/></div>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge :label="user.points" />
                        </q-item-section>
                        </template>
                        <div>
                             <q-chip v-for="(number,item) in user.lists" :key="item">{{number}} x {{item}}</q-chip>
                        </div>
                   </q-expansion-item>
                </q-card>
               
               

            </div>
            <div class="title" style="margin-top:70px">Hosting</div>
            <div>(To be visible to all users when those numbers are better)</div>
            <div class="row q-gutter-x-md">
                <q-card class="col q-pa-md">
                    <div class="text-h5">Total host requests</div>
                    <q-separator class="q-my-sm"/>
                    <div class="text-h5 text-center q-my-lg" >{{statistics.total_hostrequests}}</div>
                </q-card>
                <q-card class="col q-pa-md">
                    <div class="text-h5">Host requests accepted</div>
                    <q-separator class="q-my-sm"/>
                    <div class="text-h5 text-center q-my-lg" >{{statistics.total_hostrequests_accepted}} ({{statistics.total_hostrequests_accepted/statistics.total_hostrequests*100}}%)</div>
                </q-card>

            </div>
        </div>
    </div>
    
     
  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  mixins: [mixinGeneral, ],
  data(){
      return{
        datacollectionUsers: null,
        datacollectionMarkers: null,
        days:{},
        groupusers:'day',
        options_user: [
            {label:'Day',value:'day'},
            {label:'Week',value:'week'},
            {label:'Month',value:'month'},
        ],
        groupmarkers:'day',
        options_marker: [
            {label:'Day',value:'day'},
            {label:'Week',value:'week'},
            {label:'Month',value:'month'},
        ],
      }
  },
  computed:{
    ...mapState('other', ['statistics']),    

    userGraphData(){
        if(this.groupusers==='day'){
            return this.datacollectionUsers={
                labels:Object.keys(this.statistics.users_per_day),
                datasets: [{
                    label: 'Users per day',
                    backgroundColor: '#f87979',
                    data: Object.values(this.statistics.users_per_day)
                }]
            }
        }else if(this.groupusers==='week'){
            return this.datacollectionUsers={
                labels:Object.keys(this.statistics.users_per_week),
                datasets: [{
                    label: 'Users per week',
                    backgroundColor: '#f87979',
                    data: Object.values(this.statistics.users_per_week)
                }]
            }
        }else if(this.groupusers==='month'){
            return this.datacollectionUsers={
                labels:Object.keys(this.statistics.users_per_month),
                datasets: [{
                    label: 'Users per month',
                    backgroundColor: '#f87979',
                    data: Object.values(this.statistics.users_per_month)
                }]
            }
        }
    },
    markerGraphData(){
        if(this.groupmarkers==='day'){
            return this.datacollectionMarkers={
                labels:Object.keys(this.statistics.markers_per_day),
                datasets: [{
                    label: 'Markers per day',
                    backgroundColor: '#f87979',
                    data: Object.values(this.statistics.markers_per_day)
                }]
            }
        }else if(this.groupmarkers==='week'){
            return this.datacollectionMarkers={
                labels:Object.keys(this.statistics.markers_per_week),
                datasets: [{
                    label: 'Markers per week',
                    backgroundColor: '#f87979',
                    data: Object.values(this.statistics.markers_per_week)
                }]
            }
        }else if(this.groupmarkers==='month'){
            return this.datacollectionMarkers={
                labels:Object.keys(this.statistics.markers_per_month),
                datasets: [{
                    label: 'Markers per month',
                    backgroundColor: '#f87979',
                    data: Object.values(this.statistics.markers_per_month)
                }]
            }
        }
    }
  },
  methods:{
		...mapActions('other',['getStatistics']),
      

  },
  mounted(){
      this.getStatistics()
},

  

}
</script>

<style>
.title{
    font-size:40px;
}

</style>