const fs = require('fs')
const path = require('path')
const readGDX = require('./prepare/readGDX')
const util = require('util')
const _ = require('lodash')
const child_process = require('child_process')
// const ChartJS = require('chart.js')
const {
  CanvasRenderService
} = require('chartjs-node-canvas');
const width = 560; //px
const height = 350; //px
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
  ChartJS.defaults.global.defaultFontFamily = "'Raleway', sans-serif"
});


const readDir = util.promisify(fs.readdir)
const writeFile = util.promisify(fs.writeFile)

function groupFiles(array) {
  const mapped = array.map(filename => filename.replace(".gdx", "").split("_"))
  const groups = _.groupBy(mapped, map => map[0])
  Object.keys(groups).forEach(key => groups[key] = groups[key].map(arr => {
    if (arr.length === 1) return {
      scenario: 'Baseline',
      caseStudy: arr[0],
      filename: `./input/${arr[0]}.gdx`
    }
    else return {
      scenario: arr.slice(1).join(" "),
      caseStudy: arr[0],
      filename: `./input/${arr.join("_")}.gdx`
    }
  }))
  return groups
}

async function saveImage(json, cs, indicator) {
  const buffer = await canvasRenderService.renderToBuffer(json)
  // const buffer = canvasRenderService.renderToBufferSync(json,'image/pdf')
  if (!fs.existsSync(`output/${cs}`)) {
    fs.mkdirSync(`output/${cs}`);
  }
  //var data = buffer.split(',')[1]; 
  // var buf = Buffer.from(data).toString('base64')
  await writeFile(`output/${cs}/${indicator}.png`, buffer.replace(/^data:image\/png;base64,/, ""), 'base64')
}

function checkInf(data) {
  return data.some(val => !isFinite(val))
}

function createChartJSBar(title, data, labels) {
  const containsInfinite = checkInf(data)
  if (!containsInfinite) {
    return {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Baseline',
          data: [data[0]],
          backgroundColor: 'rgb(120, 193, 168)',
          borderColor: '#fff',
          borderWidth: 2
        }, {
          label: 'Innovations',
          data: [0, ...data.slice(1)],
          backgroundColor: 'rgb(238, 122, 23)',
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 4,
        title: {
          display: false,
          text: title
        },
        scales: {
          yAxes: [{
            ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return title.includes('Profit') ? value.toLocaleString() + '€' : value;
              }
            }
          }]
        }
      }
    }
  } else {
    const max = data.reduce((val,cur) => cur > val && isFinite(cur) ? cur : val, 2)
    const roundedMax = Math.round(max * 1.2 * 0.1) / 0.1
    console.log(roundedMax);
    // const maxYValue = Math.max(2, roundedMax * 1.2)
    // replace infinite values
    // infData = data.map(val => !isFinite(val) ? roundedMax : 0)
    data = data.map(val => !isFinite(val) ? roundedMax : val)
    
    const settings =  {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Baseline',
          data: [data[0]],
          backgroundColor: 'rgb(120, 193, 168)',
          borderColor: data[0] == roundedMax ? '#3e5071' : '#fff',
          borderWidth: data[0] == roundedMax ? 4 : 2,
        }, {
          label: 'Innovations',
          data: [0, ...data.slice(1)],
          backgroundColor: 'rgb(238, 122, 23)',
          borderColor: [0, ...data.slice(1)].map(val => val == roundedMax ? '#3e5071' : '#fff'),
          borderWidth: [0, ...data.slice(1)].map(val => val == roundedMax ? 4 : 2)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 4,
        title: {
          display: false,
          text: title
        },
        scales: {
          yAxes: [{
            ticks: {
              max: roundedMax,
              min: 0,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return title.includes('Profit') ? value.toLocaleString() + '€' : value;
              }
            }
          }]
        }
      }
    }
    
    return settings
  }

}

async function createProfitBar(gdx) {
  const scenarios = Object.keys(gdx)
  const data = scenarios.map(s => gdx[s].profitFct.find(p => p[0] === 'Profit(Euro)')[2])
  const json = createChartJSBar("Profit (€) whole farm per scenario", data, scenarios)
  await saveImage(json, gdx[Object.keys(gdx)[0]].name, 'profit')
}

async function createGWP(gdx) {
  const scenarios = Object.keys(gdx)
  const data = scenarios.map(s => gdx[s].enviTot.find(p => p[0] === 'GWP')[1])
  const json = createChartJSBar("GWP in kg CO₂ per kg output", data, scenarios)
  await saveImage(json, gdx[Object.keys(gdx)[0]].name, 'gwp')
}

async function createCal(gdx) {
  const scenarios = Object.keys(gdx)
  let data = scenarios.map(s => gdx[s].calorie.find(p => p[0] === 'CalProdperFeed'))
  data = data.map(arr => arr ? arr[1] : Infinity)
  const json = createChartJSBar("Calorie efficiency in cal/cal", data, scenarios)
  await saveImage(json, gdx[Object.keys(gdx)[0]].name, 'cal')
}

async function createProt(gdx) {
  const scenarios = Object.keys(gdx)
  let data = scenarios.map(s => gdx[s].calorie.find(p => p[0] === 'ProtProdperFeed'))
  data = data.map(arr => arr ? arr[1] : Infinity)
  const json = createChartJSBar("Protein efficiency in kg/kg", data, scenarios)
  await saveImage(json, gdx[Object.keys(gdx)[0]].name, 'prot')
}

;
(async () => {
  // do local report
  let files = await readDir('input')
  files = files.filter(f => path.extname(f) === '.gdx')
  const groups = groupFiles(files)
  console.log('Found the following file groups: ' + Object.keys(groups))
  for (let i = 0; i < Object.keys(groups).length; i++) {
    const groupFiles = groups[Object.keys(groups)[i]]
    // these are all scenarios for a single case study
    const gdxRawData = await readGDX(groupFiles, `${__dirname}/output`)
    // create bar charts for profit, gwp, calory efficiency, protein efficiency
    await createProfitBar(gdxRawData)
    await createGWP(gdxRawData)
    await createCal(gdxRawData)
    await createProt(gdxRawData)
  }
})()