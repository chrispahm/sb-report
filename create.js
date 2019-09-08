const puppeteer = require('puppeteer')
const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

module.exports = async (farm) => {
  try {
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage()
    await page.goto('http://localhost:5000/')
    // save a PDF of the full output
    writeFile(`output/${farm}.pdf`, await page.pdf())
    // get image urls for all graphs on the page
    const urls = await page.evaluate(() => {
      const urls = []
      Chart.helpers.each(Chart.instances, (chart) => {
        urls.push([chart.toBase64Image(),chart.canvas.id])
      })
      return urls
    })
    // create output dir for the given farm
    try {
      await mkdir(`output/${farm}`,{ recursive: true })
    } catch (e) {
      // path already exists
    }
    // save all graphs to images
    for (var i = 0; i < urls.length; i++) {
      const viewSource = await page.goto(urls[i][0])
      writeFile(`output/${farm}/${urls[i][1]}.png`, await viewSource.buffer())
    }
    await browser.close()
  } catch (e) {
    console.log(e)
  }
}
