<template lang="html">
  <div class="subpage">
    <!-- Page Header -->
    <div class="summary-box has-text-white">
      <h3 class="title is-3 has-text-white">Simulation Summary</h3>
      <p>{{ summary }}</p>
    </div>
    <!-- Navigation Bar -->
    <nav class="level">
      <a href="#cropShares_head" class="level-item tab first">Crops</a>
      <a href="#Herdsize_head" class="level-item tab">Herds</a>
      <a :href="'#' + Object.keys(feedHerdsByMonth)[0] + '_head'" class="level-item tab">Feed</a>
      <a href="#economics_box" class="level-item tab">Economics</a>
      <a href="#environmental_box" class="level-item tab">Environment</a>
      <a href="#social_box" class="level-item tab">Social</a>
    </nav>
    <!-- Sub Pages/Graph Section -->
    <div class="columns is-multiline">
      <!-- Cropshares -->
      <pie class="column is-half" id="Baseline_cropShares" title="Crop Shares" :data="cropHa"></pie>
      <!-- Crop production -->
      <stackedbar class="column is-half" id="Baseline_dmProd" title="Total Fresh Matter Production" yLabel="t FM/a" :chartData="dryMatter"></stackedbar>
      <!-- Fertilisation table, stacked bar per crop -->
      <stackedbar class="column is-half" id="Baseline_cropFertN" title="N-Fertilisation per Crop" :chartData="n"></stackedbar>
      <!-- Fertilisation table, stacked bar per crop -->
      <stackedbar class="column is-half" id="Baseline_cropFertP" title="P-Fertilisation per Crop" :chartData="P"></stackedbar>
      <!-- Sum Herds, tabelle -->
      <fdtable class="column is-half" id="Baseline_Herdsize" :title="'Herd structure of farm ' + gdxData.name" :round="0" :is-econ="false" :data="sumHerd" :header="['Herd', 'Breed', 'Count']"></fdtable>
      <!-- LU, tabelle-->
      <fdtable class="column is-half" title="Livestock Units" :round="0" :is-econ="false" :data="lu" :header="['Type', 'Value']"></fdtable>
      <!-- Output quant, tabelle-->
      <fdtable class="column is-half" title="Sold Output Quantity" :data="soldOutputQuant" :header="['Type', 'Amount\n[kg, t or Number]']"></fdtable>
      <!-- Input quant, tabelle-->
      <fdtable class="column is-half" title="Bought Input Quantity" :data="inputQuant" :header="['Type', 'Amount\n[kg, t or Number]']"></fdtable>
    </div>  
    <div class="break"></div>
    <div class="summary-box has-text-white" id="economics_box">
      <h3 class="title is-3 has-text-white">Economic indicator</h3>
      <p>{{econSummary}}</p>
    </div>
    <div class="columns is-multiline">
      <!-- Economics, tabelle-->
      <fdtable class="column is-full" id="Baseline_economics" title="Economics Output" :is-econ="true" :data="profitFct" :header="['Description', 'Type', 'Amount [€]']"></fdtable>
      <!-- Feed, stacked bar per herd -->
      <stackedbar class="column is-half" v-for="(arr, herd) in feedHerdsByMonth" :key="herd" :id="`Baseline_${herd}`" :title="'Feed ' +  herd" :chartData="arr"></stackedbar>
      <div class="break"></div>
      <!-- Autonomy parameters - radial gauge-->
      <radial class="column is-half" id="Baseline_autoSharePrem" title="Share Premium on Revenues" :data="autoSharePrem"></radial>
      <radial class="column is-half" id="Baseline_autoShareInput" title="Share Input Costs on Variable Costs" :data="autoShareInput"></radial>
      <bar class="column is-half" id="Baseline_wageHour" title="Hourly Wage" :data="labProfit"></bar>
    </div>
    <div class="break"></div>
    <div class="summary-box has-text-white" id="Baseline_environmental_box">
      <h3 class="title is-3 has-text-white">Environmental indicator</h3>
      <p>{{enviSummary}}</p>
    </div>
    <div class="columns is-multiline">
      <!-- Environment, bar -->
      <bar class="column is-half" id="Baseline_environmentalBarTotal" title="Environmental Indicators Total" :data="enviTot" :options="enviOptions"></bar>
      <bar v-if="enviBal.length" bar class="column is-half" id="Baseline_environmentalBarBalance" title="Environmental Indicators Balance" :data="enviBal" :options="enviOptions"></bar>
      <pie class="column is-half" id="Baseline_GWP" title="Source contribution global warming potential" :data="GWP"></pie>
      <pie class="column is-half" id="Baseline_PMFP" title="Source contribution particulate matter formation potential" :data="PMFP"></pie>
      <pie class="column is-half" id="Baseline_TAP" title="Source contribution terrestrial acidification" :data="TAP"></pie>
      <pie class="column is-half" id="Baseline_FEP" title="Source contribution freshwater eutrophication potential" :data="FEP"></pie>
      <pie class="column is-half" id="Baseline_MEP" title="Source contribution marine water eutrophication potential" :data="MEP"></pie>
    </div>
    <div class="break"></div>
    <div class="summary-box has-text-white" id="Baseline_social_box">
      <h3 class="title is-3 has-text-white">Social indicator</h3>
      <p>{{sociSummary}}</p>
    </div>
    <div class="columns is-multiline">
      <!-- Social - stacked lines -->
      <stackedlines class="column is-full" id="Baseline_workHour" title="Work Hours Distribution Monthly" :data="work"></stackedlines>
      <fdtable class="column is-half" id="Baseline_workHoursum" title="Work Hours total" :data="work1"></fdtable>
      <!-- Calories - bar -->
      <fdtable class="column is-half" id="Baseline_calorie" title="Calorie and protein effciency of cattle branch" :data="calorie"></fdtable>
    </div>
  </div>
</template>

<script>
import summaryDescription from './createSummaryDescription.js'
import economicDescription from './createEconomicDescription.js'
import enviDescription from './createEnvironmentalDescription.js'
import sociDescription from './createSocialSummaryDescription.js'
import helpers from './helpers.js'
import bar from './components/bar.vue'
import pie from './components/pie.vue'
import stackedbar from './components/stacked-bar.vue'
import stackedlines from './components/stacked-lines.vue'
import fdtable from './components/table.vue'
import radial from './components/radialGauge.vue'

export default {
  props: {
    gdxData: {
      type: Object,
      required: true
    }
  },
  data() {
      const additionals = {
        summary: summaryDescription.summary(this.gdxData),
        econSummary: economicDescription(this.gdxData),
        enviSummary: enviDescription(this.gdxData),
        sociSummary: sociDescription(this.gdxData),
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
          tooltips: helpers.tooltips(),
          plugins: {
            datalabels: {
              display: false
            }
          }
        }
      }
      return {...this.gdxData,...additionals};
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

<style lang="css" scoped>
</style>
