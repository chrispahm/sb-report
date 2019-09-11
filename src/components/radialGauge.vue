<template lang="html">
  <div>
    <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
    <canvas class="gauge" v-bind:id="id" width="300" height="300"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import 'chartjs-chart-radial-gauge'
import tinygradient from 'tinygradient'
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
    const ctx = document.getElementById(this.id)
    const color = this.getColor(this.data[0])
    new Chart(ctx, {
      type: 'radialGauge',
      data: {
        labels: [this.title],
        datasets: [{
          label: "Value",
          data: [this.data[0] * 100],
          backgroundColor: color,
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        trackColor: '#f5f5f5',
        roundedCorners: false,
        centerPercentage: 75,
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
  },
  methods: {
    getColor(val) {
      const gradient = tinygradient([
        '#55854c',
        '#f7e040',
        '#db4e3b'
      ])
      const color = gradient.rgbAt(val)._originalInput
      return `rgba(${color.r},${color.g},${color.b},${color.a})`
    }
  }
}
</script>

<style lang="css" scoped>
.gauge {
  padding: 50px;
}
</style>
