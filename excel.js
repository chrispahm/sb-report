// creates an excel file for all gdx files found in the input folder
const fs = require('fs')
const path = require('path')
const gdx = require('node-gdx')
const XLSX = require('xlsx')
const util = require('util')
const _ = require('lodash');

const readDir = util.promisify(fs.readdir)

async function readGdxGroup(files) {
  let merged = {}
  for (var i = 0; i < files.length; i++) {
    const file = files[i].filename
    const data = await gdx.read(file)
    Object.keys(data).forEach(key => {
      if (!merged[key]) merged[key] = []
      merged[key] = merged[key].concat(data[key])
    })
  }
  return merged
}

async function saveExcelGroup(obj,name) {
  const wb = XLSX.utils.book_new();
  Object.keys(obj).forEach(key => {
    const ws = XLSX.utils.json_to_sheet(obj[key])
    XLSX.utils.book_append_sheet(wb, ws, key)
  })
  XLSX.writeFile(wb, `./output/${name}.xlsx`)
}

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

;(async () => {
  // do local report
  let files = await readDir('input')
  files = files.filter(f => path.extname(f) === '.gdx')
  const groups = groupFiles(files)
  console.log('Found the following file groups: ' + Object.keys(groups))
  for (let i = 0; i < Object.keys(groups).length; i++) {
    const groupFiles = groups[Object.keys(groups)[i]]
    const obj = await readGdxGroup(groupFiles)
    await saveExcelGroup(obj, groupFiles[0].caseStudy)
  }
})()
