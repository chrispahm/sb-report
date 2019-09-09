const Vue = require('Vue')
const gdx = require('node-gdx')
const http = require('http')
const fs = require('fs')
const _ = require('lodash')
const util = require('util')
const path = require('path')
const create = require('../create')
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

function serverRunning() {
  return new Promise((resolve, reject) => {
    http
      .request({
        method:'HEAD',
        host: 'localhost',
        port:5000,
        path: '/'
      }, (r) => {
        resolve(r.statusCode >= 200 && r.statusCode < 400 )
      })
      .on('error', reject)
      .end()
  })
}

module.exports = async (file) => {
  try {
    // ed = export Data
    const eD = {}
    const data = await gdx.read(file)

    eD.cropHa = data.p_crop
                  .filter(d => d['1'] === 'cropHA')
                  .map(d => [d['2'],d.Value])
    eD.dryMatter = data.p_crop
                     .filter(d => d['1'] === 'cropProduction')
                     .map(d => [d['2'],d['3'],d.Value])
    eD.profitFct = data.p_ProfitFct
                     .map(d => [d['1'],d['2'],d.Value])
    eD.soldOutputQuant = data.p_other
                           .filter(d => d['1'] === 'SoldOutputQuant')
                           .map(d => [d['2'],d.Value])
    eD.inputQuant = data.p_other
                      .filter(d => d['1'] === 'inputQuant')
                      .map(d => [d['2'],d.Value])
    eD.feedHerdsByMonth = 
      _.groupBy(data.p_other
                  .filter(d => d['3'] === 'Feed')
                  .map(d => [d['1'],d['2'],d['4'],d.Value]), a => a[1]
                )
    eD.lu = data.p_sumHerd
              .filter(d => d['3'] === 'LU')
              .map(d => [d['1'],d.Value])
    eD.n = data.p_crop
             .filter(d => d['3'] === 'N')
             .map(d => [d['2'],d['1'],d.Value])
    eD.P = data.p_crop
             .filter(d => d['3'] === 'P')
             .map(d => [d['2'],d['1'],d.Value])
    eD.sumHerd = data.p_sumHerd
                   .filter(zeile => zeile['3'] === 'No')
                   .map(zeile => [zeile['1'],zeile['2'],zeile.Value])
    eD.envi = data.p_envi
                .filter(zeile => zeile['2'] === 'total')
                .map(zeile => [zeile['1'],zeile.Value])
    eD.GWP = data.p_envi
               .filter(zeile => zeile['2'] === 'GWP')
               .map(zeile => [zeile['3'],zeile.Value])
    eD.PMFP = data.p_envi
               .filter(zeile => zeile['2'] === 'PMFP')
               .map(zeile => [zeile['3'],zeile.Value])
    eD.TAP = data.p_envi
               .filter(zeile => zeile['2'] === 'TAP')
               .map(zeile => [zeile['3'],zeile.Value])
    eD.FEP = data.p_envi
               .filter(zeile => zeile['2'] === 'FEP')
               .map(zeile => [zeile['3'],zeile.Value])
    eD.MEP = data.p_envi
               .filter(zeile => zeile['2'] === 'MEP')
               .map(zeile => [zeile['3'],zeile.Value])
    eD.work = data.p_soci
               .filter(zeile => zeile['2'])
               .map(zeile => [zeile['3'],zeile['2'],zeile.Value])
    eD.work1 = data.p_soci
               .filter(zeile => zeile['3'] === 'sum')
               .map(zeile => [zeile['1'],zeile.Value])
    eD.calorie = data.p_soci
               .filter(zeile => zeile['3'] === 'Calorie')
               .map(zeile => [zeile['1'],zeile.Value])
               
    
     const app = 
    const exportString = `window.data = ${JSON.stringify(eD)}`
    await writeFile('export.js', exportString,'utf8')
    
    // if server is running, update graphs and pdf
    if (await serverRunning()) {
      await create(path.basename(file,'.gdx'))
    }
  } catch (e) {
    console.log(e)
  }
}
