<template>
<div class="row q-mb-sm">
        
    <q-input filled 
    :value="dueDate" 
    label="Date"
    class="col"
    @input="$emit('update:dueDate',$event)"
    name="date"
    color="teal"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date mask="DD-MM-YYYY"
            :value="dueDate" 
            @input="$emit('update:dueDate',$event)"
            :options="optionsFn" 
            :navigation-max-year-month="maxYearMonth"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
        
      </template>
    </q-input>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
        props:['dueDate'],
        data () {
          return {
            date2: this.timeStamp,
          }
        },
        computed: {
          timeStamp:function (){
            let timeStamp = Date.now()
            let formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')
            return formattedString
          },
          maxYearMonth(){
           
            let timeStamp = Date.now()
            let show_date=date.formatDate(timeStamp, 'YYYY-MM-DD')

            let yearNow=show_date.split('-')[0]
            let monthNow=show_date.split('-')[1]
            if(monthNow>6){
              let yearMax=yearNow+1
              let monthMax=monthNow-6
              return yearMax+'/'+monthMax
            }else{
              let monthMax2=monthNow+6
              return yearNow+'/'+monthMax2
            }
              
          }
        },
        methods:{
          optionsFn (dueDate) {
            return dueDate >= this.timeStamp 
          },
        }


}
</script>

<style>

</style>