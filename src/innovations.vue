<template lang="html">
  <div  class="subpage">
    <!-- Quick overview of innovation results, more details are shown at the bottom-->
    <div class="summary-box has-text-white">
      <h3 class="title is-3 has-text-white">Key innovation metrics</h3>
      <p>{{ innovationSummary }}</p>
    </div>
    <div class="columns is-multiline">
      <percent class="column is-half" id="relProfitChange" title="Profit change" :finalValue="profitChange"></percent>
      <percent class="column is-half" id="relGWPChange" title="Global warming potential" :finalValue="GWPChange"></percent>
      <percent class="column is-half" id="relProtChange" title="Protein efficiency" :finalValue="protChange"></percent>
      <percent class="column is-half" id="relProtChange" title="Calorie efficiency" :finalValue="calChange"></percent>
    </div>
    <br>
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
      <pie class="column is-half" id="cropShares" title="Crop Shares" :data="cropHa"></pie>
      <!-- Crop production -->
      <stackedbar class="column is-half" id="dmProd" title="Dry Matter Production Table" :data="dryMatter"></stackedbar>
      <!-- Fertilisation table, stacked bar per crop -->
      <stackedbar class="column is-half" id="cropFertN" title="N-Fertilisation per Crop" :data="n"></stackedbar>
      <!-- Fertilisation table, stacked bar per crop -->
      <stackedbar class="column is-half" id="cropFertP" title="P-Fertilisation per Crop" :data="P"></stackedbar>
      <!-- Sum Herds, tabelle -->
      <fdtable class="column is-half" id="Herdsize" title="Herd Sizes" :is-econ="false" :data="sumHerd" :header="['Herd', 'Breed', 'Count']"></fdtable>
      <!-- LU, tabelle-->
      <fdtable class="column is-half" title="Livestock Units" :is-econ="false" :data="lu" :header="['Type', 'Value']"></fdtable>
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
      <fdtable class="column is-full" id="economics" title="Economics Output" :is-econ="true" :data="profitFct" :header="['Description', 'Type', 'Amount [€]']"></fdtable>
      <!-- Feed, stacked bar per herd -->
      <stackedbar class="column is-half" v-for="(arr, herd) in feedHerdsByMonth" :key="herd" :id="herd" :title="'Feed ' +  herd" :data="arr"></stackedbar>
      <div class="break"></div>
      <!-- Autonomy parameters - radial gauge-->
      <radial class="column is-half" id="autoSharePrem" title="Share Premium on Revenues" :data="autoSharePrem"></radial>
      <radial class="column is-half" id="autoShareInput" title="Share Input Costs on Variable Costs" :data="autoShareInput"></radial>
      <bar class="column is-half" id="wageHour" title="Hourly Wage" :data="labProfit"></bar>
    </div>
    <div class="break"></div>
    <div class="summary-box has-text-white" id="environmental_box">
      <h3 class="title is-3 has-text-white">Environmental indicator</h3>
      <p>{{enviSummary}}</p>
    </div>
    <div class="columns is-multiline">
      <!-- Environment, bar -->
      <bar class="column is-half" id="environmentalBarTotal" title="Environmental Indicators Total" :data="enviTot" :options="enviOptions"></bar>
      <bar v-if="enviBal.length" bar class="column is-half" id="environmentalBarBalance" title="Environmental Indicators Balance" :data="enviBal" :options="enviOptions"></bar>
      <pie class="column is-half" id="GWP" title="Source contribution GWP" :data="GWP"></pie>
      <pie class="column is-half" id="PMFP" title="Source contribution PMFP" :data="PMFP"></pie>
      <pie class="column is-half" id="TAP" title="Source contribution TAP" :data="TAP"></pie>
      <pie class="column is-half" id="FEP" title="Source contribution FEP" :data="FEP"></pie>
      <pie class="column is-half" id="MEP" title="Source contribution MEP" :data="MEP"></pie>
    </div>
    <div class="break"></div>
    <div class="summary-box has-text-white" id="social_box">
      <h3 class="title is-3 has-text-white">Social indicator</h3>
      <p>{{sociSummary}}</p>
    </div>
    <div class="columns is-multiline">
      <!-- Social - stacked lines -->
      <stackedlines class="column is-full" id="workHour" title="Work Hours Distribution Monthly" :data="work"></stackedlines>
      <fdtable class="column is-half" id="workHoursum" title="Work Hours total" :data="work1"></fdtable>
      <!-- Calories - bar -->
      <fdtable class="column is-half" id="calorie" title="Calorie and protein effciency of cattle branch" :data="calorie"></fdtable>
    </div>
  </div>
</template>

<script>
import summaryDescription from './createSummaryDescription.js'
import economicDescription from './createEconomicDescription.js'
import enviDescription from './createEnvironmentalDescription.js'
import sociDescription from './createSocialSummaryDescription.js'
import innovationDescription from './createInnovationDescription.js'
import helpers from './helpers.js'
import bar from './components/bar.vue'
import pie from './components/pie.vue'
import stackedbar from './components/stacked-bar.vue'
import stackedlines from './components/stacked-lines.vue'
import fdtable from './components/table.vue'
import radial from './components/radialGauge.vue'
import percent from './components/percent.vue'

export default {
  props: {
    gdxData: {
      type: Object,
      required: true
    },
    baseline: {
      type: Object,
      required: true
    }
  },
  computed: {
    relValues() {
      const data = {}
      Object.keys(this.gdxData).forEach(k => {
        if (Array.isArray(this.gdxData[k])) {
          data[k] = []
          this.gdxData[k].forEach((elem,i) => {
            if (typeof elem === "number") {
              // check if exists in baseline container
              if (this.baseline[k] && this.baseline[k][i] && typeof this.baseline[k][i] === 'number' && this.baseline[k][i] > 0.01) {
                data[k].push(elem / this.baseline[k][i])
              } else {
                data[k].push(1)
              }
            } else if (Array.isArray(elem)) {
              const subData = []
              elem.forEach((subElem,j) => {
                if (typeof subElem === 'number') {
                  if (this.baseline[k] && this.baseline[k][i] && this.baseline[k][i][j] && typeof this.baseline[k][i][j] === 'number' && this.baseline[k][i][j] > 0.01) {
                    subData.push(subElem / this.baseline[k][i][j])
                  }
                } else {
                  subData.push(subElem)
                }
              })
              data[k].push(subData)
            } else {
              data[k].push(elem)
            }
          })
        } else if (typeof this.gdxData[k] === 'object') {
          data[k] = {}
          Object.keys(this.gdxData[k]).forEach(sk => {
            data[k][sk] = []
            this.gdxData[k][sk].forEach((subElem,j) => {
              if (Array.isArray(subElem)) {
                const subSubData = []
                subElem.forEach((subSubElem,m) => {
                  if (this.baseline[k] && this.baseline[k][sk] && this.baseline[k][sk][j] && this.baseline[k][sk][j][m] && typeof this.baseline[k][sk][j][m] === 'number' && this.baseline[k][sk][j][m] > 0.01) {
                    subSubData.push(subSubElem / this.baseline[k][sk][j][m])
                  } else {
                    subSubData.push(subSubElem)
                  }
                })
                data[k][sk].push(subSubData)
              } else {
                data[k][sk].push(subElem)
              }
            })
          })
        } else {
          data[k] = this.gdxData[k]
        }
      })
      return data
    },
    profitChange() {
      if (this.relValues && this.relValues.profitFct) {
        return this.relValues.profitFct.find(p => p[0] === 'Profit(Euro)')[2] - 1
      } else {
        return 0
      }
    },
    GWPChange() {
      if (this.relValues && this.relValues.enviTot) {
        const value = this.relValues.enviTot.find(p => p[0] === 'GWP')
        if (!value) return 0
        return value[1]  - 1
      } else {
        return 0
      }
    },
    protChange() {
      if (this.relValues && this.relValues.calorie) {
        const value = this.relValues.calorie.find(p => p[0] === 'ProtFeed')
        if (!value) return 0
        return value[1]  - 1
      } else {
        return 0
      }
    },
    calChange() {
      if (this.relValues && this.relValues.calorie) {
        const value = this.relValues.calorie.find(p => p[0] === 'CalFeed')
        if (!value) return 0
        return value[1]  - 1
      } else {
        return 0
      }
    },
    innovationSummary() {
      return innovationDescription({
        name: this.gdxData.name,
        scenario: this.gdxData.scenario,
        GWPChange: this.GWPChange,
        profitChange: this.profitChange,
        protChange: this.protChange,
        calChange: this.calChange
      })
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
      return {
        ...this.gdxData,
        ...additionals,
        absSelected: true
      };
  },
  mounted() {
    console.log(this.relValues);
  },
  components: {
    'bar': bar,
    'pie': pie,
    'stackedbar': stackedbar,
    'stackedlines': stackedlines,
    'fdtable': fdtable,
    'radial': radial,
    'percent': percent
  }
}
</script>

<style lang="css" scoped>
</style>
