<template>
<div>
  <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
  <canvas v-bind:id="id" width="300" height="300"></canvas>
</div>
</template>
<script>
module.exports = {
  name: "stackedLine",
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
    let data = this.data
    if (data[0].length > 3) data = this.rework(data)
    var ctx = document.getElementById(this.id)
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.createLabels(data).map(l => format(l)),
        datasets: this.createDatasets(data)
      },
      options: {
        scales: {
          yAxes: [{
            stacked: true
          }]
        },
        plugins: {
          datalabels: {
            display: false
          }
        }
      }
    })
  },
  methods: {
    createLabels(data) {
      // sort labels if monthly
      let labels = _.uniq(data.map(d => d[0]))
      if (shortMonths.indexOf(labels[0]) > -1) {
        labels = _.sortBy(labels, [o => shortMonths.indexOf(o.toUpperCase())])
      } 
      this.labels = labels
      return labels
    },
    createDatasets(data) {
      let stacks = _.uniq(data.map(d => d[1]))
      if (stacks.indexOf('management') > -1) {
        stacks = [
          'management', 
          'stableWork', 
          'field', 
          'animalWork', 
          'animalExtraWork'
        ]
      }
      const colors = createColors(stacks.length)
      const datasets =  stacks.map((stack, i) => {
        return {
          label: format(stack),
          data: this.labels.map(d => {
            const find = _.find(data, a => 
              a[0].toUpperCase() === d.toUpperCase() && a[1] === stack)
            return find ? find[2] : 0
          }),
          backgroundColor: toRgbA(colors[i], 0.8),
          borderColor: toRgbA(colors[i], 1),
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