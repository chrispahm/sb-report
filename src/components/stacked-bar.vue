<template>
<div>
  <h5 class="title is-5 fd-item">{{ title }}</h5>
  <canvas v-bind:id="id" width="300" height="300"></canvas>
</div>
</template>
<script>
module.exports = {
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
    data: {
      type: Array,
      required: true
    }
  },
  mounted() {
    var ctx = document.getElementById(this.id)
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.createLabels(),
        datasets: this.createDatasets()
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    })
  },
  methods: {
    createLabels() {
      return _.uniq(this.data.map(d => format(d[0])))
    },
    createDatasets() {
      const stacks = _.uniq(this.data.map(d => d[1]))
      const colors = shuffle(window.colors)
      return stacks.map((stack, i) => {
        return {
          label: format(stack),
          data: this.data.filter(d => d[1] === stack).map(d => d[2]),
          backgroundColor: hexToRgbA(colors[i], 0.8),
          borderColor: hexToRgbA(colors[i], 1),
          borderWidth: 1
        }
      })
    }
  }
}
</script>
<style scoped>
</style>