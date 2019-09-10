<template lang="html">
  <div class="">
    <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
    <canvas v-bind:id="id" width="300" height="300"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import 'chartjs-chart-radial-gauge'
import _ from 'lodash'
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
    console.log(this.data);
    var ctx = document.getElementById(this.id)
    var myChart = new Chart(ctx, {
      type: 'radialGauge',
      data: {
        labels: ["Metrics"],
        datasets: [{
          label: "Score",
          data: [this.data[0] * 100],
          backgroundColor: '#55854c',
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        // zoomOutPercentage: 70,
        trackColor: '#f5f5f5',
        roundedCorners: false,
        centerPercentage: 80,
        centerArea: {
          fontFamily: 'Raleway',
          text: function(value, options) { return value + '%'; }
        },
        plugins: {
          outlabels: {
            display: false
          }
        }
      }
    })
  }
}
</script>

<style lang="css" scoped>
</style>
