const gdx = require('node-gdx')
const _ = require('lodash')

// const file = process.argv[2]
const file = 'C:/Users/pahmeyer/Documents/FarmDyn/results/SustainBeef/Fr.Cant-CC.gdx'
;(async () => {
  const data = await gdx.read(file)
  const cropHa = data.p_crop.filter(d => d['1'] === 'cropHA').map(d => {
    return [d['2'],d.Value]
  })
  const dryMatter = data.p_crop.filter(d => d['1'] === 'cropProduction').map(d => {
    return [d['2'],d['3'],d.Value]
  })
  const profitFct = data.p_ProfitFct.map(d => {
    return [d['1'],d['2'],d.Value]
  })
  const soldOutputQuant = data.p_other.filter(d => d['1'] === 'SoldOutputQuant').map(d => {
    return [d['2'],d.Value]
  })
  const feedHerdsByMonth = _.groupBy(data.p_other.filter(d => d['3'] === 'Feed').map(d => {
    return [d['1'],d['2'],d['4'],d.Value]
  }), a => a[1])
  console.log(feedHerdsByMonth);
})()