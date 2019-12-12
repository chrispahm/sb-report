const puppeteer = require('puppeteer')
const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

module.exports = async (farm,output) => {
  console.log('Currently working on the farm: ', farm)
  try {
    const browser = await puppeteer.launch({
      headless: true,
      // slowMo: 1000
    })
    const page = await browser.newPage()
    
    await page.goto(`file://${output}/${farm}.html`)
    // save a PDF of the full output
    writeFile(`${output}/${farm}.pdf`, await page.pdf({format: 'A4'}))
    // get image urls for all graphs on the page
    /*
    const urls = await page.evaluate(async () => {
      // load canvas js
      ; await (async () => {
        return new Promise((resolve) => {
          var script = document.createElement('script')
          var done = false
          script.src = 'https://rawgit.com/gliffy/canvas2svg/master/canvas2svg.js'
          script.onload = script.onreadystatechange = () => {
            if (!done && (!this.readyState ||
                this.readyState == "loaded" || this.readyState == "complete")) {
              done = true;
              resolve()
            }
          }
          var head = document.getElementsByTagName("head")[0]
          head.appendChild(script)
        })
      })()
      // fix some bugs in C2S -> https://stackoverflow.com/questions/45563420/exporting-chart-js-charts-to-svg-using-canvas2svg-js
      // ; (() => { C2S.prototype.getContext = function(contextId) { if (contextId == "2d" || contextId == "2D") { return this; } return null; }; C2S.prototype.style = function() { return this.__canvas.style }; C2S.prototype.getAttribute = function(name) { return this[name]; }; C2S.prototype.addEventListener = function() { console.log("canvas2svg.addEventListener() not implemented.") }; })()
      const urls = []
      Chart.defaults.global.maintainAspectRatio = false;
      
      function makeChart(chart) {
        urls.push(new Promise((resolve) => {
          // create png image with increase size
          Chart.defaults.global.defaultFontSize = 60
          const ctx = document.createElement('canvas')
          ctx.width = 2048
          ctx.height = 2048
          const body = document.getElementsByTagName('body')[0]
          body.appendChild(ctx)
          chart.config.options.responsiveAnimationDuration = 0
          chart.config.options.plugins.deferred = false
          chart.config.options.plugins.outlabels.font.minSize = 48
          chart.config.options.plugins.outlabels.stretch = 25
          chart.config.data.datasets = chart.config.data.datasets.map(d => {
            d.borderWidth = d.borderWidth * 5
            d.pointRadius = 10
            return d
          })
          chart.config.options.responsive = false
          chart.config.options.animation.duration = 0
          var newChart = new Chart(ctx, chart.config)

          // create svg image
          */
          /*
          Chart.defaults.global.defaultFontSize = 12;
          chart.config.options.plugins.outlabels.font.minSize = null
          var svgContext = C2S(388, 388)
          chart.config.options.responsive = false
          new Chart(svgContext, chart.config)
          let svg = svgContext.getSerializedSvg(true)
          */
          /*
          setTimeout(() => {
            resolve([
              newChart.toBase64Image(), 
              chart.canvas.id
              // svg
            ])
          }, 100)
        }))
      }
      Chart.helpers.each(Chart.instances, makeChart)
      return await Promise.all(urls)
    })
    // create output dir for the given farm
    try {
      await mkdir(`${output}/${farm}`, {
        recursive: true
      })
    } catch (e) {
      // path already exists
    }
    // save all graphs to images
    for (var i = 0; i < urls.length; i++) {
      const viewSource = await page.goto(urls[i][0])
      writeFile(`${output}/${farm}/${urls[i][1]}.png`, await viewSource.buffer())
      // don't save svg for now as the output is rather buggy
      // writeFile(`output/${farm}/${urls[i][1]}.svg`, urls[i][2],'utf8')
    }
    */
    await browser.close()
  } catch (e) {
    console.log(e)
  }
}