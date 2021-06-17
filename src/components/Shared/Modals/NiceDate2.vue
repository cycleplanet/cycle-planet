<template>
<div>
    {{niceDate}}
</div>
  
</template>

<script>
import { date } from 'quasar'

export default {
    props:['dateprop'],
    computed: {
        niceDate: function(){
            let date_created = this.dateprop
            let show_date=date.formatDate(date_created, 'D MMMM YYYY')
            return show_date
        },
    },
}

</script>

<style>

</style>