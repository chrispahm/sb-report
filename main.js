const fs = require('fs')
const path = require('path')
const prepare = require('./prepare/data.js')
const util = require('util')

const readDir = util.promisify(fs.readdir)

;(async () => {
  const inputFile = process.argv[2]
  const outputDir = process.argv[3]
  if (inputFile && outputDir) {
    await prepare(inputFile,outputDir)
  } else {
    // do local report
    let files = await readDir('input')
    files = files.filter(f => path.extname(f) === '.gdx')
    console.log('Found the following files: ' + files)
    for (let i = 0; i < files.length; i++) {
      const file = `./input/${files[i]}`
      await prepare(file,`${__dirname}/output`)
    }
  }

})()