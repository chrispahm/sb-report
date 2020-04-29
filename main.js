const fs = require('fs')
const path = require('path')
const prepare = require('./prepare/data.js')
const util = require('util')
const _ = require('lodash')
const readDir = util.promisify(fs.readdir)

function groupFiles(array) {
  const mapped = array.map(filename => filename.replace(".gdx","").split("_"))
  const groups = _.groupBy(mapped, map => map[0])
  Object.keys(groups).forEach(key => groups[key] = groups[key].map(arr => {
    if (arr.length === 1) return { scenario: 'Baseline', filename: `./input/${arr[0]}.gdx`}
    else return {
      scenario: arr.slice(1).join(" "),
      filename: `./input/${arr.join("_")}.gdx`
    }
  }))
  return groups
}

;(async () => {
  const inputFile = process.argv[2]
  const outputDir = process.argv[3]
  if (inputFile && outputDir) {
    await prepare([{
      scenario: 'Baseline',
      filename: inputFile
    }],outputDir)
  } else {
    // do local report
    let files = await readDir('input')
    files = files.filter(f => path.extname(f) === '.gdx')
    const groups = groupFiles(files)
    console.log('Found the following file groups: ' + Object.keys(groups))
    for (let i = 0; i < Object.keys(groups).length; i++) {
      const groupFiles = groups[Object.keys(groups)[i]]
      await prepare(groupFiles,`${__dirname}/output`)
    }
  }
})()