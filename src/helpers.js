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
      
      // replace heifer and bulls strings
      if (string.includes(' f ') || string.includes(' m ')) {
        const split = string.split(' ')
        let breed = split[0]
        if (breed === 'SalChar') breed = 'Saler x Charolais'
        if (breed === 'SalXChar') breed = 'Saler x Charolais'
        if (breed === 'AngXLim') breed = 'Angus x Limousin'
        if (breed === 'SalXAng') breed = 'Saler x Angus'
        if (breed === 'BBB') breed = 'Belgian Blue'

        let sex = 'bulls'
        if (split[1] === 'f') sex = 'heifers'
        if (split.length === 8) {
          return `${breed}, ${sex}, from ${split[4]} kg to ${split[5]} kg, ${split[2]}`
        } else {
          let weightGain = _.round((Number(split[4]) - Number(split[3])) / split[5],1)
          return `${breed}, ${sex}, from ${split[3]} kg to ${split[4]} kg, ${weightGain} kg daily weight gain`
        }  
      }
      
      string = string.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      string = string.toLowerCase()
      // make better legible gras crop labels
      if (string.match(/gras\d/)) {
        const split = string.split(' ')
        let percHay = 0
        let percGraz = 0
        let cuts = 0
        split.forEach(s => {
          if (s.includes('graz')) percGraz = Number(s.split('graz')[1]).toFixed(0)
          if (s.includes('hay')) percHay = Number(s.split('hay')[1]).toFixed(0)
          if (s.includes('cuts')) cuts = Number(s.split('cuts')[0])
        })
        let cutsText = ''
        let grazingText = ''
        let hayText = ''
        if (cuts === 1) {
          cutsText = ', 1 cut'
        } else if (cuts > 1) {
          cutsText = `, ${cuts} cuts`
        }
        
        if (percHay) hayText = `, ${percHay}% hay`
        if (percGraz) grazingText = `, ${percGraz}% grazing`
        console.log(grazingText);
        
        string = `Gras: ${split[1]} t DM${cutsText}${grazingText}${hayText}`
        return string
      }

      // replace some default famrdyn labels
      if (string === 'late graz') {
        return 'Late grazing'
      } else if (string === 'early graz') {
        return 'Early grazing'
      } else if (string === 'middle graz') {
        return 'Middle grazing'
      }

      if (string === 'maiz sil') return 'Maize silage'
      
      if (string === 'nman apl ha') return 'N from manure application (1/ha)'
      if (string === 'ngraz ha') return 'N from grazing (1/ha)'
      
      if (string === 'pman apl ha') return 'P from manure application (1/ha)'
      if (string === 'pgraz ha') return 'P from grazing (1/ha)'
      
      if (string === 'm calvs rais') return 'Male calves raised'
      if (string === 'f calvs rais') return 'Female calves raised'
      
      if (string === 'luperha') return 'Livestock units per ha'
      if (string === 'sum lu') return 'Total livestock units'
      
      if (string === 'man appl') return 'Manure application'
      if (string === 'sta sto') return 'Stable and storage'
      if (string === 'past') return 'Pasture'
      if (string === 'ent ferm') return 'Enteric fermentation'
      if (string === 'input') return 'Inputs'   
      
      if (string === 'conc cattle1') return 'Concentrates Type 1'      
      if (string === 'conc cattle2') return 'Concentrates Type 2'
      if (string === 'conc cattle3') return 'Concentrates Type 3'
      if (string === 'milk fed') return 'Milk'
      
      if (string === 'sum var cost') return 'Total variable costs'
      if (string === 'direct pay') return 'Subsidies (decoupled support)'
      if (string === 'sum buy cost') return 'Total input costs (bought)'
      if (string === 'sum feed buy cost') return 'Total feed input costs (bought)'
      if (string === 'buy cost') return 'Input costs (bought)'
      if (string === 'build var cost') return 'Variable costs for buildings'
      if (string === 'mach var cost') return 'Variable costs for machinery'
      if (string === 'man var cost') return 'Variable costs for manure spreading'
      if (string === 'other var cost') return 'Other Variable costs'
      if (string === 'profit(euro)') return 'Profit'

      if (string === 'sal char') return 'Saler x Charolais'
      
      if(string === 'tap') return 'Terrestrial acidification'
      if(string === 'gwp') return 'Global warming potential'
      if(string === 'mep') return 'Marine water eutrophication potential'
      if(string === 'fep') return 'Freshwater eutrophication potential'
      if(string === 'pmfp') return 'Particulate matter formation potential'
      if(string === 'fdp') return 'Fossil fuel depletion'

      return string.split(' ')
        /*
        .map(s => {
          const match = s.match(/(graz)\d|(hay)\d/)
          const prefix = match ? match[1] || match[2] : ''
          if (prefix) {
            const split = s.split(prefix)
            if (!Number(split[1])) return
            console.log(split);
            // round number
            return prefix + Number(split[1]).toFixed(1)
          }
          return s
        })
        */
        .map(s => {
          // replace snippet in text, e.g. cal -> calorie
          if (s === 'cal') s = 'calories'
          if (s === 'prot') s = 'protein'
          if (s === 'tot') s = 'total'
          if (s === 'prod') s = 'produced'
          if (s === 'prodper') s = 'produced per'
          if (s === 'anim') s = 'animals'
          if (s === 'ha') s = 'per ha'
          if (s === 'manage') s = 'management'
          if (s === 'sal') s = 'saler'
          if (s === 'char') s = 'x charolais'
          if (s === 'bbb') s = 'belgian blue'
          if (s === 'Mont') breed = 'Montbeliarde x'
          if (s === 'cha') breed = 'Charolais'
          if (s === 'fem') breed = 'Female'
          if (s === 'mal') breed = 'Male'
          if (s === 'xchar') breed = 'x Charolais'
          if (s === 'lim') breed = 'Limousin'
          return s
        })
        .map((s,i) => i === 0 ? s.charAt(0).toUpperCase() + s.substring(1) : s)
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

