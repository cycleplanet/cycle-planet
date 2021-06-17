<template>
  <div class="q-ma-md">
      <div class="text-h6">Amount of markers added</div>
      <q-item v-for="(sumMarkers, userKey, index) in sortMarkersByUser" :key="index" >
          <div v-if="index<10">
              <div>{{index+1}}. {{users[userKey].fullname}}({{userKey}}): {{sumMarkers}}</div>
          </div>
      </q-item>
  </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  mixins: [mixinGeneral, ],
  data(){
      return{
          days:{}
      }
  },
  methods:{
		...mapActions('auth',['firebaseGetUsers']),

  },
  mounted(){
      this.firebaseGetUsers()
  },

  computed:{
      markerKeys(){
          return Object.keys(this.landMarkers)
      },
      sortMarkersByDay(){
        let days={}

          this.markerKeys.forEach(element => {
              let date = this.landMarkers[element].date_created.split('T')
              let date1=date[0]

              if(days[date1]){
                  let x=days[date1]
                  days[date1]=x+1
              }else{
                  days[date1]=1
              }
          })
            let array = {}
          let keysOrdered = Object.keys(days)
          keysOrdered.sort((a,b) => {
			let AProp = a
			let	BProp = b

			if (AProp > BProp) return 1
			else if (AProp < BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			array[key] = days[key]
		})
          return array
          
      },

      sortMarkersByUser(){
        let userarray={}

          this.markerKeys.forEach(element => {
              let user = this.landMarkers[element].user_created
              if(!this.landMarkers[element].user_created){
              }

              if(userarray[user]){
                  let x=userarray[user]
                  userarray[user]=x+1
              }else{
                  userarray[user]=1
              }
          })
            let array = {}
          let keysOrdered = Object.keys(userarray)
          keysOrdered.sort((a,b) => {
			let AProp = userarray[a]
			let	BProp = userarray[b]

			if (AProp < BProp) return 1
			else if (AProp > BProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			array[key] = userarray[key]
		})
          return array
          
      },
      
  }

}
</script>

<style>

</style>