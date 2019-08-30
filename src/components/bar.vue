<template>
  <div>
    <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
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
    },
    options: {
      type: Object,
      required: false
    }
  },
  mounted() {
    var ctx = document.getElementById(this.id)
    var data = this.data.map(d => d[1])
    var labels = this.data.map(d => format(d[0]))
    var colors = shuffle(window.colors)
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Value',
          data: data,
          backgroundColor: data.map((a,i) => hexToRgbA(colors[i],0.8))[0],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: this.options
    })
  }
}
</script>
<style scoped>
</style>