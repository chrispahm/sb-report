const gdx = require('node-gdx')
const {exec} = require('child_process')
const fs = require('fs')
const _ = require('lodash')
const util = require('util')
const path = require('path')
const create = require('../create')

const writeFile = util.promisify(fs.writeFile)
const execPromise = util.promisify(exec)
const copyFile = util.promisify(fs.copyFile)

module.exports = async (file,output) => {
  try {
    // ed = export Data
    const eD = {}
    const data = await gdx.read(file)
    eD.name = path.basename(file, '.gdx')
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
    eD.enviTot = data.p_envi
                .filter(zeile => zeile['2'] === 'total')
                .map(zeile => [zeile['1'],zeile.Value])
    eD.enviBal = data.p_envi
                .filter(zeile => zeile['2'] === 'balance')
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
    eD.labProfit = data.p_econ
                    .filter(zeile => zeile['1'] === 'Profitability')
                    .map(zeile => [zeile['1'],zeile.Value])
    eD.autoSharePrem = data.p_econ
                    .filter(zeile => zeile['2'] === 'shareprem')
                    .map(zeile => zeile.Value)
    eD.autoShareInput = data.p_econ
                    .filter(zeile => zeile['2'] === 'shareInput')
                    .map(zeile => zeile.Value)

    const exportString = `module.exports = ${JSON.stringify(eD)}`
    await writeFile('src/export.js', exportString,'utf8')
    // build the project html and copy
    const delim = path.sep
    await execPromise(`.${delim}node_modules${delim}.bin${delim}webpack --mode production`, {cwd: __dirname + '/..'})
    // copy html to output dir
    await copyFile('./dist/index.html', `${output}/${path.basename(file.toUpperCase(),'.gdx')}.html`)
    // create pdf report and images
    // await create(path.basename(file,'.gdx'),output)
  } catch (e) {
    console.log(e)
  }
}
