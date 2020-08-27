const readGDX = require('./readGDX');
const {exec} = require('child_process')
const fs = require('fs')
const util = require('util')
const create = require('../create')
const path = require('path')

const writeFile = util.promisify(fs.writeFile)
const execPromise = util.promisify(exec)
const copyFile = util.promisify(fs.copyFile)

module.exports = async (files,output) => {
  try {
    // ed = export Data
    const eD = await readGDX(files)
    const exportString = `module.exports = ${JSON.stringify(eD)}`
    await writeFile('src/export.js', exportString,'utf8')
    // build the project html and copy
    const delim = path.sep
    await execPromise(`.${delim}node_modules${delim}.bin${delim}webpack --mode production`, {cwd: __dirname + '/..'})
    // copy html to output dir
    await copyFile('./dist/index.html', `${output}/${path.basename(files[0].filename,'.gdx').toUpperCase()}.html`)
    // create pdf report and images
    await create(files[0].caseStudy,output)
  } catch (e) {
    console.log(e)
  }
}
