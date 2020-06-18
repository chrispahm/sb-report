const fs = require('fs')
const path = require('path')
const readGDX = require('./prepare/readGDX')
const util = require('util')
const _ = require('lodash')
const child_process = require('child_process')

const readDir = util.promisify(fs.readdir)
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)
const exec = util.promisify(child_process.exec)

function groupFiles(array) {
  const mapped = array.map(filename => filename.replace(".gdx","").split("_"))
  const groups = _.groupBy(mapped, map => map[0])
  Object.keys(groups).forEach(key => groups[key] = groups[key].map(arr => {
    if (arr.length === 1) return { scenario: 'Baseline', caseStudy: arr[0], filename: `./input/${arr[0]}.gdx`}
    else return {
      scenario: arr.slice(1).join(" "),
      caseStudy: arr[0],
      filename: `./input/${arr.join("_")}.gdx`
    }
  }))
  return groups
}

const summaryDescription = require('./src/createSummaryDescription.js')
const economicDescription = require('./src/createEconomicDescription.js')
const enviDescription = require('./src/createEnvironmentalDescription.js')
const sociDescription = require('./src/createSocialSummaryDescription.js')
const innovationDescription = require('./src/createInnovationDescription.js')


// Baseline description
let gdxData
let baselineData

function relValues() {
  const data = {}
  Object.keys(gdxData).forEach(k => {
    if (Array.isArray(gdxData[k])) {
      data[k] = []
      gdxData[k].forEach((elem,i) => {
        if (typeof elem === "number") {
          // check if exists in baselineData container
          if (baselineData[k] && baselineData[k][i] && typeof baselineData[k][i] === 'number' && baselineData[k][i] > 0.01) {
            data[k].push(elem / baselineData[k][i])
          } else {
            data[k].push(1)
          }
        } else if (Array.isArray(elem)) {
          const subData = []
          elem.forEach((subElem,j) => {
            if (typeof subElem === 'number') {
              if (baselineData[k] && baselineData[k][i] && baselineData[k][i][j] && typeof baselineData[k][i][j] === 'number' && baselineData[k][i][j] > 0.01) {
                subData.push(subElem / baselineData[k][i][j])
              }
            } else {
              subData.push(subElem)
            }
          })
          data[k].push(subData)
        } else {
          data[k].push(elem)
        }
      })
    } else if (typeof gdxData[k] === 'object') {
      data[k] = {}
      Object.keys(gdxData[k]).forEach(sk => {
        data[k][sk] = []
        gdxData[k][sk].forEach((subElem,j) => {
          if (Array.isArray(subElem)) {
            const subSubData = []
            subElem.forEach((subSubElem,m) => {
              if (baselineData[k] && baselineData[k][sk] && baselineData[k][sk][j] && baselineData[k][sk][j][m] && typeof baselineData[k][sk][j][m] === 'number' && baselineData[k][sk][j][m] > 0.01) {
                subSubData.push(subSubElem / baselineData[k][sk][j][m])
              } else {
                subSubData.push(subSubElem)
              }
            })
            data[k][sk].push(subSubData)
          } else {
            data[k][sk].push(subElem)
          }
        })
      })
    } else {
      data[k] = gdxData[k]
    }
  })
  return data
}
function profitChange() {
  if (relValues() && relValues().profitFct) {
    return relValues().profitFct.find(p => p[0] === 'Profit(Euro)')[2] - 1
  } else {
    return 0
  }
}
function GWPChange() {
  if (relValues() && relValues().enviTot) {
    const value = relValues().enviTot.find(p => p[0] === 'GWP')
    if (!value) return 0
    return value[1]  - 1
  } else {
    return 0
  }
}
function protChange() {
  if (relValues() && relValues().calorie) {
    const value = relValues().calorie.find(p => p[0] === "ProtProdperFeed")
    if (!value) return 0
    return value[1]  - 1
  } else {
    return 0
  }
}
function calChange() {
  if (relValues() && relValues().calorie) {
    const value = relValues().calorie.find(p => p[0] === "CalProdperFeed")
    if (!value) return 0
    return value[1]  - 1
  } else {
    return 0
  }
}

;(async () => {
  // do local report
  let files = await readDir('input')
  files = files.filter(f => path.extname(f) === '.gdx')
  const groups = groupFiles(files)
  console.log('Found the following file groups: ' + Object.keys(groups))
  const countries = {}
  for (let i = 0; i < Object.keys(groups).length; i++) {
    const groupFiles = groups[Object.keys(groups)[i]]
    // these are all scenarios for a single case study
    const gdxRawData = await readGDX(groupFiles,`${__dirname}/output`)
    if (!countries[gdxRawData.Baseline.country]) countries[gdxRawData.Baseline.country] = []
    countries[gdxRawData.Baseline.country].push(gdxRawData)
  }
  // now create the two reports
  /*
  WP 3.2 Structure:
  ## Country
  ### Case study
  Baseline Summary
  #### Economics
  #### Environment
  #### Social
  */
  // Baseline
  let baseline = '# Baseline system performance and innovation results\nDeliverable 3.2\n\n'
  Object.keys(countries).forEach(country => {
    baseline += `## ${country}\n\n`
    countries[country].forEach(caseStudy => {
      const imagePath = __dirname + '/output/' + caseStudy.Baseline.name
      baseline += `### ${caseStudy.Baseline.name}\n\n`
      baseline += `${summaryDescription.summary(caseStudy.Baseline)}\n\n`
      baseline += `![Figure 1: Crop shares in baseline scenario of ${caseStudy.Baseline.name}](${imagePath}/Baseline_cropShares.png){ height=256px }\n\n`
      baseline += `#### Economic indicators\n\n`
      baseline += `${economicDescription(caseStudy.Baseline)}\n\n`
      baseline += `#### Environmental indicators\n\n`
      baseline += `${enviDescription(caseStudy.Baseline)}\n\n`
      baseline += `#### Social indicators\n\n`
      baseline += `${sociDescription(caseStudy.Baseline)}\n\n`
    })
  })
  
  // now create the two reports
  /*
  WP 3.3 Structure:
  ## Country
  ### Case study
  #### Innovtion
  Innovation summary
  Graphs
  Random Economics, Environment, Social
  */
  // innovations
  let innovationsText = '# Baseline system performance and innovation results\nDeliverable 3.2\n\n'
  Object.keys(countries).forEach(country => {
    innovationsText += `## ${country}\n\n`
    countries[country].forEach(caseStudy => {
      innovationsText += `### ${caseStudy.Baseline.name}\n\n`
      Object.keys(caseStudy).forEach(innovation => {
        if (innovation === 'Baseline') return
        innovationsText += `#### ${caseStudy[innovation].scenario}\n\n`
        gdxData = caseStudy[innovation]
        baselineData = caseStudy.Baseline
        innovationsText += `${innovationDescription({
          name: caseStudy[innovation].name,
          scenario: caseStudy[innovation].scenario,
          GWPChange: GWPChange(),
          profitChange: profitChange(),
          protChange: protChange(),
          calChange: calChange()
        })}\n\n`
        const rand = Math.random()
        if (rand < 0.33) {
          innovationsText += `${summaryDescription.summary(caseStudy[innovation])}\n\n`
        } else if (rand > 0.33 && rand < 0.66) {
          innovationsText += `${enviDescription(caseStudy[innovation])}\n\n`
        } else {
          innovationsText += `${sociDescription(caseStudy[innovation])}\n\n`
        }

      })
    })
  })
  try {
    await writeFile('./output/report/SustainBeef - Deliverable 3.2.md', baseline, 'utf8')
    await exec('pandoc -s --toc "./output/report/SustainBeef - Deliverable 3.2.md" -o "./output/report/SustainBeef - Deliverable 3.2.docx"')
    await writeFile('./output/report/SustainBeef - Deliverable 3.3.md', innovationsText, 'utf8')
    await exec('pandoc -s --toc "./output/report/SustainBeef - Deliverable 3.3.md" -o "./output/report/SustainBeef - Deliverable 3.3.docx"')
    await unlink('./output/report/SustainBeef - Deliverable 3.2.md')
    await unlink('./output/report/SustainBeef - Deliverable 3.3.md')
  } catch (e) {
    console.log(e);
  }
})()
