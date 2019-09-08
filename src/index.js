function createColors(length) {
  if (length === 1) {
    return ['rgb(0, 63, 92)']
  } else if (length === 2) {
    return ['rgb(0, 63, 92)', 'rgb(238, 122, 23)']
  }
  return gradstop({
    stops: length,
    inputFormat: 'hex',
    colorArray: ['#003f5c', '#8a498e', '#ef7a17']
  })
}

window.shortMonths = [
  'JAN', 'FEB', 'MAR', 'APR',
  'MAY', 'JUN', 'JUL', 'AUG',
  'SEP', 'OCT', 'NOV', 'DEC'
]

window.data.enviOptions = {
  scales: {
    yAxes: [{
      type: 'logarithmic'
    }]
  },
  plugins: {
    datalabels: {
      display: false
    }
  }
}

function toRgbA(rgb, val) {
  const regExp = new RegExp(/\((.*)\)/)
  rgb = regExp.exec(rgb)[1]
  return `rgba(${rgb},${val})`
}

function format(string) {
  try {
    string = string.replace(/_/g, ' ')
    string = string.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    return string.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  } catch (e) {
    return string
  }
}

function beforePrint() {
  setPrinting(true)
}

function afterPrint() {
  setPrinting(false)
}

;(function() {
  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print')
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
  Chart.helpers.each(Chart.instances, function(chart) {
    chart.options.plugins.deferred = !printing
    chart.resize()
    chart.update()
  });
}

new window.Vue({
  el: '#app',
  data: window.data,
  components: {
    'pie': window.httpVueLoader('/src/components/pie.vue'),
    'bar': window.httpVueLoader('/src/components/bar.vue'),
    'stackedbar': window.httpVueLoader('/src/components/stacked-bar.vue'),
    'stackedlines': window.httpVueLoader('/src/components/stacked-lines.vue'),
    'fdtable': window.httpVueLoader('/src/components/table.vue')
  },
})