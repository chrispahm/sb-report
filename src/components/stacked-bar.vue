<template>
<div>
  <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ fixedTitle }}</h5>
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
  name: "stackedBar",
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
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
    chartData: {
      type: Array,
      required: true
    }
  },
  mounted() {
    if (this.id.includes('_f') || this.id.includes('_m') || this.id === 'motherCow' || this.id === 'mCalvsRais' || this.id === 'fCalvsRais') this.correctTitle()
    let data = this.chartData
    if (data[0].length > 3) data = this.rework(data)
    var ctx = document.getElementById(this.id)

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.createLabels(data).map(l => helpers.format(l)),
        datasets: this.createDatasets(data)
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            scaleLabel: {
              display: this.xLabel ? true : false,
              labelString: this.xLabel
            }
          }],
          yAxes: [{
            stacked: true,
            scaleLabel: {
              display: this.yLabel ? true : false,
              labelString: this.yLabel
            }
          }]
        },
        tooltips: helpers.tooltips()
      }
    })
  },
  data() {
    return {
      feedTitle: ''
    }
  },
  computed: {
    fixedTitle() {
      if (this.feedTitle) return this.feedTitle
      return this.title
    }
  },
  methods: {
    correctTitle() {
      const herd = this.id
      const split = herd.split('_')
      console.log(split)
      // without price
      if (split.length === 7 || split.length === 8) {
        let breed = split[1]
        if (breed === 'SalChar') breed = 'Saler x Charolais'
        if (breed === 'AngXLim') breed = 'Angus x Limousin'
        if (breed === 'SalXAng') breed = 'Saler x Angus'
        if (breed === 'BBB') breed = 'Belgian Blue'
        let sex = 'bulls'
        if (split[2] === 'f') sex = 'heifers'
        let weightGain = _.round((Number(split[5]) - Number(split[4])) / split[6],1)
        this.feedTitle = `Feed ${breed}, ${sex}, from ${split[4]} kg to ${split[5]} kg, ${weightGain} kg daily weight gain`
      } else if (split[1] == 'motherCow') {
        this.feedTitle = 'Feed mother cows'
      } else if (split[1] == 'mCalvsRais') {
        this.feedTitle = 'Feed male calves raised'
      } else if (split[1] == 'fCalvsRais') {
        this.feedTitle = 'Feed female calves raised'
      }
      // console.log(split);
    },
    createLabels(data) {
      // sort labels if monthly
      let labels = _.uniq(data.map(d => d[0]))
      if (helpers.shortMonths().indexOf(labels[0]) > -1) {
        labels = _.sortBy(labels, [o => helpers.shortMonths().indexOf(o.toUpperCase())])
      }
      this.labels = labels
      return labels
    },
    createDatasets(data) {
      const stacks = _.uniq(data.map(d => d[1]))
      const colors = helpers.createColors(stacks.length)
      const datasets =  stacks.map((stack, i) => {
        return {
          label: helpers.format(stack),
          data: this.labels.map(d => {
            const find = _.find(data, a =>
              a[0].toUpperCase() === d.toUpperCase() && a[1] === stack)
            return find ? find[2] : 0
          }),
          backgroundColor: helpers.toRgbA(colors[i], 0.8),
          borderColor: helpers.toRgbA(colors[i], 1),
          borderWidth: 1
        }
      })
      return datasets
    },
    rework(data) {
      return data.map(d => [d[2],d[0],d[3]])
    }
  }
}
</script>
<style scoped>
</style>
