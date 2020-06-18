const gdx = require('node-gdx')
const _ = require('lodash')

function countries(country) {
  const countries = {
    IE: 'Ireland',
    GE: 'Germany',
    FR: 'France',
    BE: 'Belgium',
    IT: 'Italy'
  }
  return countries[country]
}

module.exports = async function readGDX(files) {
  const containerObj = {}
  for (var i = 0; i < files.length; i++) {
    const eD = containerObj[files[i].scenario] = {}
    const file = files[i].filename
    const data = await gdx.read(file)
    eD.name = files[i].caseStudy
    eD.scenario = files[i].scenario
    eD.country = countries(files[i].caseStudy.substring(0,2).toUpperCase())
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
  }
  return containerObj
}