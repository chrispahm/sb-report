<template>
  <div>
    <h5 class="title is-5 fd-item">{{ title }}</h5>
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
    var labels = this.data.map(d => d[0].replace(/_/g,' '))
    var colors = shuffle(window.colors)
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Votes',
          data: data,
          backgroundColor: data.map((a,i) => hexToRgbA(colors[i],0.8)),
          borderColor: '#fff',
          borderWidth: 2
        }]
      }
    })
  }
}
</script>
<style scoped>
</style>