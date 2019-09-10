const fs = require('fs')
const prepare = require('./prepare/data.js');
const util = require('util')

const readDir = util.promisify(fs.readdir)

;(async () => {
  const files = await readDir('input')
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    const file = `./input/${files[i]}`
    await prepare(file)
  }
})()