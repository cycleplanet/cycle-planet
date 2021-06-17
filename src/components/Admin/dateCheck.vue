<template>
  <div>
      {{propDay}}
  </div>
</template>

<script>
import { date } from 'quasar'
let timeStamp = Date.now()

export default {    
    props:['singleDate'],
    computed:{
        todayDay(){ return date.formatDate(timeStamp, 'D') },
        todayWeek(){ return date.formatDate(timeStamp, 'w') },
        todayMonth(){ return date.formatDate(timeStamp, 'M') },
        todayYear(){ return date.formatDate(timeStamp, 'YYYY') },

        propDay(){ return date.formatDate(this.singleDate, 'D') },
        propWeek(){ return date.formatDate(this.singleDate, 'w') },
        propMonth(){ return date.formatDate(this.singleDate, 'M') },
        propYear(){ return date.formatDate(this.singleDate, 'YYYY') },

    },
}



</script>

<style>

</style>