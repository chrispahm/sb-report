<template>
  <div>
    <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
    <p v-if="shortDescription">{{shortDescription}}</p>
    <canvas v-bind:id="id" width="300" height="300"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'
import 'chartjs-plugin-deferred'
import _ from 'lodash'
import helpers from '../helpers'
Chart.defaults.global.defaultFontFamily = "'Raleway', sans-serif"
export default {
  name: "bar",
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    xLabel: {
      type: String,
      required: false
    },
    yLabel: {
      type: String,
      required: false
    },
    options: {
      type: Object,
      required: false
    },
    shortDescription: {
    type: String,
    required: false
    }
  },
  mounted() {
    var ctx = document.getElementById(this.id)
    const kickOut = ['ALOP', 'FETPinf', 'IRP_HE', "METPinf", 'HTPinf', 'MDP', 'NLTP', 'ODPinf', 'POFP', 'ULOP', 'WDP', 'TETPinf']
    const labelConfig = {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: this.yLabel ? true : false,
            labelString: this.yLabel
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: this.xLabel ? true : false,
            labelString: this.xLabel
          }
        }]
      }
    }
    if (this.options) {
      this.options = _.merge(this.options, labelConfig)
    }
    var filtered = this.data.filter(d => kickOut.indexOf(d[0]) > -1 ? false : true)
    var data = filtered.map(d => d[1])
    var labels = filtered.map(d => helpers.format(d[0]))
    var colors = helpers.createColors(this.data.length)
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Value',
          data: data,
          backgroundColor: data.map((a,i) => helpers.toRgbA(colors[i],0.8))[0],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: this.options || {
        tooltips: helpers.tooltips()
      }
    })
  }
}
</script>
<style scoped>
</style>
