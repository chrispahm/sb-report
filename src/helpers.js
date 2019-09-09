const gradstop = require('gradstop')

module.exports = {
  createColors(length) {
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
  },
  shortMonths() {
    return [
      'JAN', 'FEB', 'MAR', 'APR',
      'MAY', 'JUN', 'JUL', 'AUG',
      'SEP', 'OCT', 'NOV', 'DEC'
    ]
  },
  enviOptions() {
    return {
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
  },
  toRgbA(rgb, val) {
    const regExp = new RegExp(/\((.*)\)/)
    rgb = regExp.exec(rgb)[1]
    return `rgba(${rgb},${val})`
  },
  format(string) {
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
}

