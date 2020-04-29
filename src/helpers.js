const gradstop = require('gradstop')

module.exports = {
  createColors(length) {
    if (length === 0) return
    if (length === 1) {
      return ['rgb(120, 193, 168)']
    } else if (length === 2) {
      return ['rgb(120, 193, 168)', 'rgb(238, 122, 23)']
    } else if (length === 3) {
      return ['rgb(120, 193, 168)', 'rgb(201,158,103)', 'rgb(238, 122, 23)']
    }
    return gradstop({
      stops: length,
      inputFormat: 'hex',
      colorArray: ['#3e5071', '#77c1a7', '#ef7a17']
    })
  },
  shortMonths() {
    return [
      'JAN', 'FEB', 'MAR', 'APR',
      'MAY', 'JUN', 'JUL', 'AUG',
      'SEP', 'OCT', 'NOV', 'DEC'
    ]
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
  },
  tooltips() {
    return {
      callbacks: {
        label(tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label || ''

          if (label) {
            label += ': '
          }
          // get value
          const formatter = new Intl.NumberFormat('en-GB')
          const value = data.datasets[tooltipItem.datasetIndex]
                            .data[tooltipItem.index]
          label += formatter.format(Math.round(value * 100) / 100)
          return label
        }
      }
    }
  }
}

