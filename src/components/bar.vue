<template>
  <div>
    <h5 class="title is-5 fd-item">{{ title }}</h5>
    <canvas v-bind:id="id" width="300" height="300"></canvas>
  </div>
</template>
<script>
module.exports = {
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
    }
  },
  mounted() {
    var ctx = document.getElementById(this.id)
    var data = Object.keys(this.data).map(d => this.data[d])
    var labels = Object.keys(this.data)
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Votes',
          data: data,
          backgroundColor: data.map((a,i) => hexToRgbA(window.colors[i],0.8)),
          borderColor: data.map((a,i) => hexToRgbA(window.colors[i],1)),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  }
}
</script>
<style scoped>
</style>