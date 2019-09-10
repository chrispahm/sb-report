<template>
<div>
  <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
  <canvas v-bind:id="id" width="300" height="300"></canvas>
</div>
</template>
<script>
import Chart from 'chart.js'
import 'chartjs-plugin-piechart-outlabels'
import _ from 'lodash'
import helpers from '../helpers'
Chart.defaults.global.defaultFontFamily = "'Raleway', sans-serif"

export default {
  name: "pie",
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
    }
  },
  mounted() {
    var ctx = document.getElementById(this.id)
    var sorted = this.data.sort(function(a, b){return a[1] - b[1]})
    var data = sorted.map(d => d[1])
    var labels = sorted.map(d => helpers.format(d[0]))
    var colors = helpers.createColors(this.data.length)
    var myChart = new Chart(ctx, {
      get type() {
        return 'outlabeledPie'
        // return window._printing ? 'outlabeledPie' : 'pie'
      },
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: data.map((a, i) => helpers.toRgbA(colors[i], 0.8)),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        // zoomOutPercentage: 70,
        plugins: {
          outlabels: {
            text: '%l %v',
            display() {
              return true
              // return window._printing ? true : false
            },
            color: 'white',
            stretch: 10,
            font: {
              resizable: true,
              minSize: 12
            }
          }
        }
      }
    })
  }
}
</script>
<style scoped>
</style>