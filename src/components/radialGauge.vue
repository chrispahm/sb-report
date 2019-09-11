<template lang="html">
  <div>
    <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
    <canvas class="gauge" v-bind:id="id" width="300" height="300"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import 'chartjs-chart-radial-gauge'
import _ from 'lodash'
import helpers from '../helpers'

Chart.defaults.global.defaultFontFamily = "'Raleway', sans-serif"

export default {
  name: "radial",
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
    var myChart = new Chart(ctx, {
      type: 'radialGauge',
      data: {
        labels: [this.title],
        datasets: [{
          label: "Value",
          data: [this.data[0] * 100],
          backgroundColor: '#55854c',
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        trackColor: '#f5f5f5',
        roundedCorners: false,
        centerPercentage: 80,
        centerArea: {
          fontFamily: 'Raleway',
          text(value, options) {
            return value + '%';
          }
        },
        plugins: {
          outlabels: {
            display: false
          }
        },
        tooltips: {enabled: false}
      }
    })
  }
}
</script>

<style lang="css" scoped>
.gauge {
  padding: 40px;
}
</style>
