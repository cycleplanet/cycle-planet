<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins


export default {
  extends: Line,
  mixins: [reactiveProp],
  props:['options'],
  data: () => ({
    
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),
  mounted () {
   
    this.renderChart(this.chartData, this.options)
  }
}
</script>
<style>

</style>
