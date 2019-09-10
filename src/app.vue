<template lang="html">
  <div class="page" id="app">
    <!-- Page Hero -->
    <section class="hero left-tag">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            SustainBeef FarmDyn Report
          </h1>
          <h2 class="subtitle">
            Deliverable 3.3
          </h2>
        </div>
      </div>
    </section>
    <div class="subpage">
      <!-- Navigation Bar -->
      <nav class="level">
        <a href="#cropShares_head" class="level-item tab first">Crops</a>
        <a href="#Herdsize" class="level-item tab">Herds</a>
        <a :href="'#' + Object.keys(feedHerdsByMonth)[0] + '_head'" class="level-item tab">Feed</a>
        <a href="#economics" class="level-item tab">Economics</a>
        <a href="#environmentalBar" class="level-item tab">Environment</a>
        <a href="#" class="level-item tab">Social</a>
      </nav>
      <!-- Page Header -->
      <div class="summary-box has-text-white">
        <h3 class="title is-3 has-text-white">Simulation Summary</h3>
        <p>General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator General indicator</p>
      </div>
      <!-- Sub Pages/Graph Section -->
      <div class="columns is-multiline">
        <!-- Cropshares -->
        <pie class="column is-half" id="cropShares" title="Crop Shares" :data="cropHa"></pie>
        <!-- Crop production -->
        <stackedbar class="column is-half" id="dmProd" title="Dry Matter Production Table" :data="dryMatter"></stackedbar>
        <!-- Fertilisation table, stacked bar per crop -->
        <stackedbar class="column is-half" id="cropFertN" title="N-Fertilisation per Crop" :data="n"></stackedbar>
        <!-- Fertilisation table, stacked bar per crop -->
        <stackedbar class="column is-half" id="cropFertP" title="P-Fertilisation per Crop" :data="P"></stackedbar>
        <!-- Sum Herds, tabelle -->
        <fdtable class="column is-half" id="Herdsize"title="Herd Sizes" :is-econ="false" :data="sumHerd" :header="['Herd', 'Breed', 'Count']"></fdtable>
        <!-- LU, tabelle-->
        <fdtable class="column is-half" title="Livestock Units" :is-econ="false" :data="lu" :header="['Type', 'Value']"></fdtable>
        <!-- Output quant, tabelle-->
        <fdtable class="column is-half" title="Sold Output Quantity" :data="soldOutputQuant" :header="['Type', 'Amount\n[kg, t or Number]']"></fdtable>
        <!-- Input quant, tabelle-->
        <fdtable class="column is-half" title="Bought Input Quantity" :data="inputQuant" :header="['Type', 'Amount\n[kg, t or Number]']"></fdtable>
        <div class="break"></div>
        <div class="summary-box has-text-white">
          <h3 class="title is-3 has-text-white">Economic indicator</h3>
          <p>Economic indicator Economic indicator Economic indicator Economic indicator Economic indicator Economic indicator Economic indicator Economic indicator Economic indicator Economic indicator Economic indicator Economic indicator</p>
        </div>
        <!-- Economics, tabelle-->
        <fdtable class="column is-full" title="Economics Output" :is-econ="true" :data="profitFct" :header="['Description', 'Type', 'Amount [€]']"></fdtable>
        <!-- Feed, stacked bar per herd -->
        <stackedbar class="column is-half" v-for="(arr, herd) in feedHerdsByMonth" :key="herd" :id="herd" :title="'Feed ' +  herd" :data="arr"></stackedbar>
        <div class="break"></div>
        <!-- Autonomy parameters - radial gauge-->
        <radial class="column is-half" id="autoSharePrem" title="Share Premium on Revenues" :data="autoSharePrem"></radial>
        <radial class="column is-half" id="autoShareInput" title="Share Input Costs on Variable Costs" :data="autoShareInput"></radial>
        <bar class="column is-half" id="wageHour" title="Hourly Wage" :data="labProfit"></bar>
        <div class="break"></div>
        <div class="summary-box has-text-white">
          <h3 class="title is-3 has-text-white">Environmental indicator</h3>
          <p>Environmental indicator Environmental indicatorEnvironmental indicatorEnvironmental indicatorEnvironmental indicatorEnvironmental indicatorEnvironmental indicatorEnvironmental indicatorEnvironmental indicatorEnvironmental indicatorEnvironmental indicatorEnvironmental indicator</p>
        </div>
        <!-- Environment, bar -->
        <bar class="column is-half" id="environmentalBarTotal" title="Environmental Indicators Total" :data="enviTot" :options="enviOptions"></bar>
        <bar class="column is-half" id="environmentalBarBalance" title="Environmental Indicators Balance" :data="enviBal" :options="enviOptions"></bar>
        <div class="break"></div>
        <pie class="column is-half" id="GWP" title="Source contribution GWP" :data="GWP"></pie>
        <pie class="column is-half" id="PMFP" title="Source contribution PMFP" :data="PMFP"></pie>
        <pie class="column is-half" id="TAP" title="Source contribution TAP" :data="TAP"></pie>
        <pie class="column is-half" id="FEP" title="Source contribution FEP" :data="FEP"></pie>
        <pie class="column is-half" id="MEP" title="Source contribution MEP" :data="MEP"></pie>
        <div class="break"></div>
        <div class="summary-box has-text-white">
          <h3 class="title is-3 has-text-white">Social indicator</h3>
          <p>Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator Social indicator</p>
        </div>
        <!-- Social - stacked lines -->
        <stackedlines class="column is-full" id="workHour" title="Work Hours Distribution Monthly" :data="work"></stackedlines>
        <div class="break"></div>
        <fdtable class="column is-half" id="workHoursum" title="Work Hours total" :data="work1"></fdtable>
        <!-- Calories - bar -->
        <fdtable class="column is-half" id="calorie" title="Calorie and protein effciency of cattle branch" :data="calorie"></fdtable>
      </div>
    </div>
  </div>
</template>

<script>
import data from './export.js'
import helpers from './helpers.js'
import bar from './components/bar.vue'
import pie from './components/pie.vue'
import stackedbar from './components/stacked-bar.vue'
import stackedlines from './components/stacked-lines.vue'
import fdtable from './components/table.vue'
import radial from './components/radialGauge.vue'

export default {
  data() {
      const additionals = {
        enviOptions: {
          scales: {
            yAxes: [{
              type: 'logarithmic',
              ticks: {
                autoSkip: true,
                maxTicksLimit: 20
              }
            }]
          },
          plugins: {
            datalabels: {
              display: false
            }
          }
        }
      }
      return {...data,...additionals};
  },
  components: {
    'bar': bar,
    'pie': pie,
    'stackedbar': stackedbar,
    'stackedlines': stackedlines,
    'fdtable': fdtable,
    'radial': radial
  }
}
</script>
<style>
  @media print {
    .columns {
      display: table !important;
    }
    .level {
      display: none;
    }
    
    .column {
      display: inline-block !important;
      page-break-inside: avoid;
    }
    
    .page {
      position: relative;
      padding: 0mm;
      margin: 0;
      border: initial;
      border-radius: initial;
      width: initial;
      min-height: initial;
      box-shadow: initial;
      background: initial;
    }
  }
  
  @media screen {
    .page {
      position: relative;
      width: 210mm;
      min-height: 300mm;
      padding: 0mm;
      margin: 10mm auto;
      border-radius: 5px;
      background: white;
      box-shadow: 0 0 10px lightgrey;
    }
  }
  body {
    font-family: 'Raleway', sans-serif;
  }
  h1,h2,h3,h4,h5,h6 {
    font-family: 'Open Sans', sans-serif;
  }
  .break {
    page-break-before: always;
  }
  .subpage {
    padding: 1cm;
    min-height: 300mm;
  }

  .tab {
    border-style: solid;
    border-color: rgb(0, 0, 0, 0.2);
    border-bottom-style: none;
    border-top-style: none;
    border-right-style: none;
    padding: 5px 10px;
  }

  .first {
    border-left-style: none;
  }

  .left-tag {
    border-left: 20px solid #ef7a17;
  }

  a:link {
    color: #696969;
    text-decoration: none;
  }

  a:hover {
    opacity: 0.6;
  }

  .summary-box {
    padding: 1.25rem;
    background-color: #ef7a17 /*#78c1a8 */;
    margin-bottom: 25px;
    color: white;
  }

  .fd-item {
    position: relative;
    color: #3a3a3a;
    left: 0;
    margin: 0mm;
    border-left: 5px solid #ef7a17;
    background: #ffffff;
    padding-top: 1px;
    padding-bottom: 1px;
    padding-left: 30px;
    padding-right: 60px;
    padding: 2px 5px;
    margin-top: 30px;
    margin-bottom: 10px;
  }
</style>
