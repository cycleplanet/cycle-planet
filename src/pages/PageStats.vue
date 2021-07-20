<template>
  <div class="q-gutter-y-md" style="margin-top:40px" v-if="Object.keys(statistics).length">
      <q-btn :style="buttonStyle" label="update" @click="updateValues" v-if="admin" />
      <q-btn :style="buttonStyle" label="update user in country" @click="submitUsersInCountry" v-if="admin && Object.keys(users_in_country_temp).length" />
      <q-btn :style="buttonStyle" label="update markers in country" @click="submitMarkersPerDay" v-if="admin && Object.keys(markers_per_day_temp).length" />


    <div class="title">Members</div>
    <div class="row q-gutter-md" >
    <q-card class="col-12 col-md q-pa-md" >
        <div class="text-h5">Total users</div>
        <q-separator class="q-my-sm"/>
        <div class="text-h5 text-center flex justify-center items-center" style="height:80%;">{{statistics.total_users}}</div>
    </q-card>
    <q-card class="col-12 col-md q-pa-md">
        <div class="text-h5">Type of users</div>
        <q-separator class="q-my-sm"/>
        <q-chip v-for="(number,refKey,index) in statistics.type_of_users" :key="index">
            <q-avatar v-if="refKey">
                <img :src="markerlist[refKey].iconurl">
            </q-avatar>
            <div>{{number}} {{markerlist[refKey].title}}</div>
        </q-chip>
    </q-card>
    <q-card class="col-12 col-md q-pa-md" v-if="Object.keys(usersSorted).length">
        <div class="text-h5">Countries represented</div>
        <q-separator class="q-my-sm"/>
         <div class="row">
            <div v-for="(number,countrycode,index) in usersSorted" :key="index">
                <q-chip v-if="index<16">
                     <q-avatar>
                        <img :src="flagUrlFor(countryCodes[countrycode])">
                    </q-avatar>
                    <div>{{number}} users</div>
                </q-chip>
            </div>
            <q-chip>+{{Object.keys(usersSorted).length-16}} countries more</q-chip>
        </div>

    </q-card>
    </div>
    <q-card v-if="userGraphData">
        <q-option-group
        v-model="groupusers"
        :options="options_user"
        color="primary"
        inline
        />
        <chart-line :chart-data="userGraphData" :width="300" :height="150"/>
    </q-card>

    <div class="title" style="margin-top:70px">Markers</div>
    <div class="row q-gutter-md" >
    <q-card class="col-12 col-md q-pa-md" >
        <div class="text-h5">Total markers</div>
        <q-separator class="q-my-sm"/>
        <div class="text-h5 text-center flex justify-center items-center" style="height:80%;">{{statistics.total_markers}}</div>
    </q-card>
    <q-card class="col-12 col-md q-pa-md">
        <div class="text-h5">Type of markers</div>
        <q-separator class="q-my-sm"/>
        <q-chip v-for="(number, refKey) in statistics.type_of_markers" :key="refKey">
            <q-avatar>
                <img :src="markerlist[refKey].iconurl">
            </q-avatar>
            <div>{{number}} {{markerlist[refKey].title}}</div>
        </q-chip>
    </q-card>
    <q-card class="col-12 col-md q-pa-md">
        <div class="text-h5">Countries represented</div>
        <q-separator class="q-my-sm"/>
        <div class="row">

        <div v-for="(number,countrycode, index) in landMarkersSorted" :key="index" >
            <q-chip v-if="index<16">
                <q-avatar>
                    <img :src="flagUrlFor(countryCodes[countrycode])">
                </q-avatar>
                <div>{{number}} markers</div>
            </q-chip>
        </div>
        <q-chip>+{{Object.keys(landMarkersSorted).length-16}} countries more</q-chip>
        </div>

    </q-card>
    </div>
    <q-card class="q-mb-lg" v-if="markerGraphData">
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
            <div class="row q-gutter-md">
                <q-card class="col-12 col-md q-pa-md">
                    <div class="text-h5">Overall</div>
                    <q-separator class="q-my-sm"/>
                   <q-expansion-item v-for="(userId, index) in statistics.toplist_points_overall" :key="user">
                        <template v-slot:header>
                      
                        <q-item-section >
                            <div class="row flex items-center">{{index+1}}.<modal-username2 :userId="userId"/></div>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge class="text-black q-pa-sm text-bold" :label="users[userId].points.score" />
                        </q-item-section>
                        </template>
                        <!-- <div>
                             <q-chip v-for="(number,item) in user.lists" :key="item">{{number}} x {{item}}</q-chip>
                        </div> -->
                   </q-expansion-item>
                </q-card>
                <q-card class="col-12 col-md q-pa-md">
                    <div class="text-h5">Give away 2 (july-october 2021)</div>
                    <q-separator class="q-my-sm"/>
                   <q-expansion-item v-for="(userId, index) in statistics.toplist_points_giveaway" :key="user">
                        <template v-slot:header>
                      
                        <q-item-section >
                            <div class="row flex items-center">{{index+1}}.<modal-username2 :userId="userId"/></div>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge class="text-black q-pa-sm text-bold" :label="users[userId].points.score_giveaway" />
                        </q-item-section>
                        </template>
                        <div>
                             <!-- <q-chip v-for="(number,item) in user.lists" :key="item">{{number}} x {{item}}</q-chip> -->
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
import { firebase } from 'boot/config'
import { Geoapify } from 'src/functions/geoapify';
import { date, uid, Notify } from 'quasar'

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
      users_in_country_temp:{},
      markers_per_day_temp:{},
      user_points_overall:{},
      user_points_giveaway:{},
      }
  },
  computed:{
    ...mapState('other', ['statistics']), 
    
    

    userGraphData(){
        if(Object.keys(this.statistics).length){
            return this.datacollectionMarkers={
                labels:this.labelDays(this.groupusers),
                datasets: [{
                    label: 'Users per '+this.groupusers,
                    backgroundColor: '#f87979',
                    data: this.dataUsers(this.groupusers)
                }]
            }
        }else{return false}
    },
    markerGraphData(){
        if(Object.keys(this.statistics).length){
            return this.datacollectionMarkers={
                labels:this.labelDays(this.groupmarkers),
                datasets: [{
                    label: 'Markers per '+this.groupmarkers,
                    backgroundColor: '#f87979',
                    data: this.dataMarkers(this.groupmarkers)
                }]
            }
        }else{return false}
    },
    landMarkersSorted(){
        if(Object.keys(this.statistics).length){
            let landMarkersSorted = {},
            keysOrdered = Object.keys(this.statistics.markers_in_country)

            keysOrdered.sort((a,b) => {
                let AProp = (this.statistics.markers_in_country[a])
                let	BProp = (this.statistics.markers_in_country[b])

                if (AProp < BProp) return 1
                else if (AProp > BProp) return -1
                else return 0
            })
            

            keysOrdered.forEach((key) => {
                landMarkersSorted[key] = this.statistics.markers_in_country[key]
            })
            
            console.log('landMarkersSorted',landMarkersSorted);
            return landMarkersSorted
        }else{return false}
    },
    usersSorted(){
        if(Object.keys(this.statistics).length){

        let usersSorted = {},
        keysOrdered = Object.keys(this.statistics.users_in_country)

        keysOrdered.sort((a,b) => {
            let AProp = (this.statistics.users_in_country[a])
            let	BProp = (this.statistics.users_in_country[b])

            if (AProp < BProp) return 1
            else if (AProp > BProp) return -1
            else return 0
        })

        keysOrdered.forEach((key) => {
            usersSorted[key] = this.statistics.users_in_country[key]
        })
        
        console.log('landMarkersSorted',usersSorted);
        return usersSorted
        }else{
            return false
        }
    },
  },
  methods:{
		...mapActions('other',['getStatistics']),
        labelDays(type){
            let n =20
            let dateArray=[]
            for (var i = 0; i <= n; n--) {
                if(type==='day'){
                    let dateToAdd = date.subtractFromDate(Date.now(), { days: n })
    			    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dateArray.push(formattedString)
                }else if(type==='week'){
                    let dateToAdd = date.subtractFromDate(Date.now(), { days: n*7 })
                    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dateArray.push(formattedString)
                }else if(type==='month'){
                    let dateToAdd = date.subtractFromDate(Date.now(), { days: n*30 })
                    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dateArray.push(formattedString)
                }
            }
            return dateArray
        },
        dataUsers(type){
            let n =20
            let dataArray=[]
            for (var i = 0; i <= n; n--) {
                if(type==='day'){
                    let dateToAdd = date.subtractFromDate(Date.now(), { days: n })
    			    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dataArray.push(this.statistics.users_per_day_sum[formattedString])
                }else if(type==='week'){
                    let dateToAdd = date.subtractFromDate(Date.now(), { days: n*7 })
                    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dataArray.push(this.statistics.users_per_day_sum[formattedString])
                }else{
                    let dateToAdd = date.subtractFromDate(Date.now(), { month:n })
                    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dataArray.push(this.statistics.users_per_day_sum[formattedString])
                }
            }
            return dataArray
        },

        dataMarkers(type){
            let n =20
            let dataArray=[]
            for (var i = 0; i <= n; n--) {
                if(type==='day'){
                    let dateToAdd = date.subtractFromDate(Date.now(), { days: n })
    			    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dataArray.push(this.statistics.markers_per_day_sum[formattedString])
                }else if(type==='week'){
                    let dateToAdd = date.subtractFromDate(Date.now(), { days: n*7 })
                    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dataArray.push(this.statistics.markers_per_day_sum[formattedString])
                }else{
                    let dateToAdd = date.subtractFromDate(Date.now(), { month:n })
                    let formattedString = date.formatDate(dateToAdd, 'YYYY-MM-DD')
                    dataArray.push(this.statistics.markers_per_day_sum[formattedString])
                }
            }
            return dataArray
        },

        updateValues(){
            console.log('updateValues 1');
            this.totalUsers()
            this.totalMarkers()

            this.typeOfUsers()
            this.typeOfMarkers()

            this.usersInCountry()
            this.markersInCountry()

            this.markersPerDay()
            this.markersPerDaySum()

            this.assignAddedMarkers()
            this.assignCheckedMarkers()

            this.calculatePointsOverall()
            this.topPointsOverall()

            this.calculatePointsGiveAway()
            this.topPointsGiveAway()


        },
        totalUsers(){
            const total=Object.keys(this.users).length
            console.log('totalUsers',total);
            firebase.db.ref('Statistics/total_users').set(total)
            firebase.db.ref('Statistics/users_per_day_sum/'+this.statisticsTimeStamp).set(total)
        },
        totalMarkers(){
            const total=Object.keys(this.landMarkers).length
            console.log('totalUsers',total);
            firebase.db.ref('Statistics/total_markers').set(total)
            // firebase.db.ref('Statistics/markers_per_day/'+this.statisticsTimeStamp).set(total)

        },
        typeOfUsers(){
            const type_of_users={
                "Available for hosting":0,
                "Not available for hosting":0,
                "Touring":0,
                "OtherMarker":0,
            }
            let userKeys=Object.keys(this.users)
            userKeys.forEach(element => {
                let status = this.users[element].hosting.status

                if(this.users[element].coordinates){
                    type_of_users[status]++
                }else{
                    type_of_users["OtherMarker"]++
                }
            });
            console.log('typeOfUsers',type_of_users);
            firebase.db.ref('Statistics/type_of_users').set(type_of_users)
        },
        typeOfMarkers(){
            const type_of_markers={}
            let markerKeys=Object.keys(this.landMarkers)
            markerKeys.forEach(element => {
                let refKey = this.landMarkers[element].refKey
                if(type_of_markers[refKey]){
                    type_of_markers[refKey]++
                }else{
                    type_of_markers[refKey]=1
                }
                
            });
            console.log('typeOfMarkers',type_of_markers);
            firebase.db.ref('Statistics/type_of_markers').set(type_of_markers)
        },
        usersInCountry(){
            // let users_in_country={}
            let userrKeys=Object.keys(this.users)
            userrKeys.forEach(element => {
                if(this.users[element].coordinates){
                    let coordinates=this.users[element].coordinates
                    Geoapify.reverseGeocodeToCountryCode(coordinates.lat, coordinates.lng).then(cc => {
                    // console.log('getUserCountry 2',cc);
                        if(this.users_in_country_temp[cc]){
                            this.users_in_country_temp[cc]++
                        }else{
                            this.users_in_country_temp[cc]=1
                        }
                    }).catch(err => {
                        console.log('currentLocation 3',err)
                    })
                    
                }

            })
            
        },
        submitUsersInCountry(){
            console.log('submitUsersInCountry 1',this.users_in_country_temp);
            firebase.db.ref('Statistics/users_in_country').set(this.users_in_country_temp)
            this.users_in_country_temp={}
        },
        markersInCountry(){
            let markers_in_country={}
            let markerKeys=Object.keys(this.landMarkers)
            markerKeys.forEach(element => {
                let countryKey = this.findCountryKey(element)
                let countryCode = this.countryNameToCode(countryKey)
                if(markers_in_country[countryCode]){
                    markers_in_country[countryCode]++
                }else{
                    markers_in_country[countryCode]=1
                }
            });
            console.log('markersInCountry',markers_in_country);
            firebase.db.ref('Statistics/markers_in_country').set(markers_in_country)
        },
        findCountryKey(itemKey){
            let refKey = this.landMarkers[itemKey].refKey
            if(refKey==='Border_item'){
                return this.landMarkers[itemKey].country1.country
            }else{
                return this.landMarkers[itemKey].countryKey
            }
        },
        getUserCountry(coordinates){
            console.log('getUserCountry 1',coordinates);
            Geoapify.reverseGeocodeToCountryCode(coordinates.lat, coordinates.lng).then(cc => {
            console.log('getUserCountry 2',cc);
                return cc
            }).catch(err => {
                console.log('currentLocation 3',err)
            })
        },
        markersPerDay(){

            const date1 = new Date(2020, 9, 2)
            const date2 = Date.now()
            const unit = 'days'

            const diff = date.getDateDiff(date2, date1, unit)+30
            for (var i = 0; i < diff; i++) {
                let newDate = date.subtractFromDate(Date.now(), { days: i })
    			let formattedString = date.formatDate(newDate, 'YYYY-MM-DD')
                this.markers_per_day_temp[formattedString]=0
            }
            
            let markerKeys=Object.keys(this.landMarkers)
            markerKeys.forEach(element => {
                let date_created = this.landMarkers[element].date_created
    			let formattedString = date.formatDate(date_created, 'YYYY-MM-DD')
                if(this.markers_per_day_temp[formattedString]){
                    this.markers_per_day_temp[formattedString]++
                }else{
                    this.markers_per_day_temp[formattedString]=1
                }
            });
            return this.markers_per_day_temp
        },
        submitMarkersPerDay(){
            firebase.db.ref('Statistics/markers_per_day').set(this.markers_per_day_temp)
        },
        markersPerDaySum(){
            let array = Object.keys(this.statistics.markers_per_day)
            let sum = 0
            array.forEach(element => {
                let addedmarkers = this.statistics.markers_per_day[element]
                sum=sum+addedmarkers
                firebase.db.ref('Statistics/markers_per_day_sum/'+element).set(sum)
            });
        },
        assignAddedMarkers(){
        // console.log('assignAddedMarkers 1');
          let markerKeys = Object.keys(this.landMarkers)
          markerKeys.forEach(element => {
            // console.log('assignAddedMarkers 2',element);
            firebase.db.ref('Users/'+this.landMarkers[element].user_created+'/points/markers_added/'+this.landMarkers[element].date_created).set(element)
          })
        },
        assignCheckedMarkers(){
            // console.log('assignCheckedMarkers 1');
          let markerKeys = Object.keys(this.landMarkers)
          markerKeys.forEach(element => {
              if(this.landMarkers[element].checked_by){
                  let array=Object.keys(this.landMarkers[element].checked_by)
                  array.forEach(element2 => {
                    // console.log('assignCheckedMarkers 2',element2);
                      
                  });
              }
            // console.log('assignCheckedMarkers 3',element);
            // firebase.db.ref('Users/'+this.landMarkers[element].user_created+'/points/markers_added/'+this.landMarkers[element].date_created).set(element)
          })
        },
        calculatePointsOverall(){
            console.log('calculatePointsOverall 1');
            let userKeys=Object.keys(this.users)
            userKeys.forEach(element => {
                if(!this.users[element].points){
                    firebase.db.ref('Users/'+element+'/points/score').set(0)
                }else{
                    let score=0
                    if(this.users[element].coordinates){
                        score=score+100
                    }
                    if(this.users[element].bio){
                        score=score+10
                    }
                    if(this.users[element].interests){
                        score=score+10
                    }
                    if(this.users[element].youtube){
                        console.log('RYFRjpH3DfdWPpRfG9MIFBSPzH33 HAS YOUTUBE',element);
                        score=score+10
                    }
                    if(this.users[element].points.markers_added){
                        let scoreAddedMarkers = Object.keys(this.users[element].points.markers_added).length*10
                        score=score+scoreAddedMarkers
                    }
                    if(this.users[element].points.markers_checked){
                        let scoreCheckedMarkers = Object.keys(this.users[element].points.markers_checked).length*3
                        score=score+scoreCheckedMarkers
                    }
                    if(this.users[element].points.markers_liked){
                        let scoreLikedMarkers = Object.keys(this.users[element].points.markers_liked).length*1
                        score=score+scoreLikedMarkers
                    }
                // console.log('calculatePointsOverall 2', element);
                // console.log('calculatePointsOverall 3', score);
                    firebase.db.ref('Users/'+element+'/points/score').set(score)
                }
            })
        },
        topPointsOverall(){
            console.log('topPointsOverall 1');
            let userKeys=Object.keys(this.users)
            userKeys.forEach(element => {
                this.user_points_overall[element]=this.users[element].points.score
            })
            
            if(Object.keys(this.user_points_overall).length===Object.keys(this.users).length){
                console.log('topPointsOverall 3',Object.keys(this.user_points_overall));
                let usersSorted = {},
                keysOrdered = Object.keys(this.user_points_overall)

                keysOrdered.sort((a,b) => {
                    let AProp = (this.user_points_overall[a])
                    let	BProp = (this.user_points_overall[b])

                    if (AProp < BProp) return 1
                    else if (AProp > BProp) return -1
                    else return 0
                })
                let n =10
                let top10=[]

                    keysOrdered.forEach((key) => {
                        if(n>0){
                            n--
                            top10.push(key)
                            usersSorted[key] = this.user_points_overall[key]
                         }
                    })
                    console.log('topPointsOverall 3.2',usersSorted);
                    console.log('topPointsOverall 3.3',top10);
                    firebase.db.ref('Statistics/toplist_points_overall').set(top10)

                // for (var i = 0; i < n; i++) {
                //     console.log('topPointsOverall 4',i);
                //     console.log('topPointsOverall 5',usersSorted[i]);
                // }
                // console.log('topPointsOverall 6',top10);



            }
        },
        calculatePointsGiveAway(){
            console.log('calculatePointsGiveAway 1');
            let userKeys=Object.keys(this.users)
            userKeys.forEach(element => {
                if(!this.users[element].points){
                    firebase.db.ref('Users/'+element+'/points/score_giveaway').set(0)
                }else{
                    let score=0
                    if(this.users[element].points.markers_added){
                        let array = Object.keys(this.users[element].points.markers_added)
                        array.forEach(element2 => {
                            const diff = date.getDateDiff(element2,'2021-07-01T00:00:00', 'days')
                            if(diff>0){
                            console.log('calculatePointsGiveAway 3',diff);
                                score=score+10
                            }
                                
                        });
                    }
                    if(this.users[element].points.markers_checked){
                        let array = Object.keys(this.users[element].points.markers_checked)
                        array.forEach(element2 => {
                            const diff = date.getDateDiff(element2,'2021-07-01T00:00:00', 'days')
                            if(diff>0){
                            console.log('calculatePointsGiveAway 3',diff);
                                score=score+3
                            }
                                
                        });
                    }
                // console.log('calculatePointsOverall 2', element);
                // console.log('calculatePointsOverall 3', score);
                    firebase.db.ref('Users/'+element+'/points/score_giveaway').set(score)
                }
            })
        },
        topPointsGiveAway(){
            console.log('topPointsOverall 1');
            let userKeys=Object.keys(this.users)
            userKeys.forEach(element => {
                this.user_points_giveaway[element]=this.users[element].points.score_giveaway
            })
            
            if(Object.keys(this.user_points_giveaway).length===Object.keys(this.users).length){
                console.log('topPointsOverall 3',Object.keys(this.user_points_giveaway));
                let usersSorted = {},
                keysOrdered = Object.keys(this.user_points_giveaway)

                keysOrdered.sort((a,b) => {
                    let AProp = (this.user_points_giveaway[a])
                    let	BProp = (this.user_points_giveaway[b])

                    if (AProp < BProp) return 1
                    else if (AProp > BProp) return -1
                    else return 0
                })
                let n =10
                let top10=[]

                    keysOrdered.forEach((key) => {
                        if(n>0){
                            n--
                            top10.push(key)
                            usersSorted[key] = this.user_points_giveaway[key]
                         }
                    })
                    console.log('topPointsOverall 3.2',usersSorted);
                    console.log('topPointsOverall 3.3',top10);
                    firebase.db.ref('Statistics/toplist_points_giveaway').set(top10)

                // for (var i = 0; i < n; i++) {
                //     console.log('topPointsOverall 4',i);
                //     console.log('topPointsOverall 5',usersSorted[i]);
                // }
                // console.log('topPointsOverall 6',top10);



            }
        },

        
      

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