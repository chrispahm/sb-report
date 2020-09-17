<template>
<div>
  <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
  <canvas v-bind:id="id" width="300" height="300"></canvas>
</div>
</template>
<script>
import Chart from 'chart.js'
import 'chartjs-plugin-piechart-outlabels'
import 'chartjs-plugin-deferred'
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
    var sorted = this.title === 'Crop Shares' ? this.data.sort(function(a, b) {
      return a[0] - b[0]
    }) : this.data.sort(function(a, b) {
      return a[1] - b[1]
    })
    var data = sorted.map(d => d[1])
    var labels = sorted.map(d => helpers.format(d[0]))
    var countGrasCrops = this.data.filter(d => d[0].includes('gras')).length
    var countArabCrops = this.data.length - countGrasCrops
    var colors = this.title === 'Crop Shares' ? this.generateColors(countGrasCrops, countArabCrops, labels) : helpers.createColors(this.data.length)
    console.log(colors);
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
        tooltips: helpers.tooltips(),
        plugins: {
          outlabels: {
            text: (context) => {
              const index = context.dataIndex
              const value = context.dataset.data[index]
              const unit = this.title === 'Crop Shares' ? ' ha' : ''
              return value < 1 ? value.toExponential(3) + unit : value.toFixed(1) + unit
            },
            display() {
              return true
              // return window._printing ? true : false
            },
            color: 'white',
            stretch: 20,
            font: {
              resizable: true,
              minSize: 12
            }
          }
        }
      }
    })
  },
  methods: {
    generateColors(countGrasCrops,countArabCrops,labels) {
      const arabColors = helpers.createArabColors(countArabCrops)
      const grasColors = helpers.createGrasColors(countGrasCrops)
      let curArabIndex = 0
      let curGrasIndex = 0
      return labels.map((crop,i) => {
        if (crop.includes('Gras')) {
          curGrasIndex++
          return grasColors[curGrasIndex -1]
        }
        curArabIndex++
        return arabColors[curArabIndex -1]
      })
    }
  }

}
</script>
<style scoped>
</style>