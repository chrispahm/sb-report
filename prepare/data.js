const gdx = require('node-gdx')

const file = process.argv[2]

;(async () => {
  const data = await gdx.read(file)
  const cropHa = data.p_crop.filter(d => d['1'] === 'cropHA').map(d => {
    return [d['2'],d.Value]
  })
  const dryMatter = data.p_crop.filter(d => d['1'] === 'cropProduction').map(d => {
    return [d['2'],d['3'],d.Value]
  })
  console.log(dryMatter);
})()