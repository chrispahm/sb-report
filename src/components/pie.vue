<template>
<div>
  <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
  <canvas v-bind:id="id" width="300" height="300"></canvas>
</div>
</template>
<script>
module.exports = {
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
    var data = this.data.map(d => d[1])
    var labels = this.data.map(d => format(d[0]))
    var colors = createColors(this.data.length)
    console.log(colors);
    var myChart = new Chart(ctx, {
      get type() {
        return window._printing ? 'outlabeledPie' : 'pie'
      },
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: data.map((a, i) => toRgbA(colors[i], 0.8)),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        plugins: {
          datalabels: {
            color: 'white',
            display: false
          },
          outlabels: {
            text: '%l %v',
            display() {
              return window._printing ? true : false
            },
            color: 'white',
            stretch: 20,
            font: {
              resizable: true,
              minSize: 12,
              maxSize: 18
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