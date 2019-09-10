import Vue from 'vue'
import App from './app.vue'

function beforePrint() {
  setPrinting(true)
}

function afterPrint() {
  setPrinting(false)
}

;(function() {
  if (window.matchMedia) {
    const mediaQueryList = window.matchMedia('print')
    mediaQueryList.addListener(function(mql) {
      if (mql.matches) {
        beforePrint()
      } else {
        afterPrint()
      }
    })
  }

  window.onbeforeprint = beforePrint;
  window.onafterprint = afterPrint;
}())

function setPrinting(printing) {
  window._printing = printing
  Chart.helpers.each(Chart.instances, chart => {
    console.log(chart);
    chart.options.plugins.deferred = !printing
    if (printing) chart.options.animation.duration = 0
    chart.resize()
    chart.update()
  });
}

new Vue({
  el: '#app',
  render: h => h(App)
})