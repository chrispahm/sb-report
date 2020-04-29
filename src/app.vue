<template lang="html">
  <div class="page" id="app">
    <!-- Page Hero -->
    <section class="hero left-tag">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            SustainBeef FarmDyn Report - {{name}}
          </h1>
          <h2 class="subtitle">
            Deliverable 3.3
          </h2>
        </div>
      </div>
    </section>
    <div v-if="gdxData" style="text-align: center; line-height: 36px;">
      Currently selected scenario:
      <div class="select">
        <select class="" v-model="selected">
          <option v-for="(obj, scenario) in gdxData" :value="scenario">{{ obj.scenario }}</option>
        </select>
      </div>
    </div>
    <baseline v-if="baselineShown" :gdxData="gdxData.Baseline"/>
    <innovations v-else :gdxData="gdxData[selected]" :key="selected"/>
  </div>
</template>

<script>
import gdxData from './export.js'
import baseline from './baseline.vue'
import innovations from './innovations.vue'

export default {
  data() {
    return {
      gdxData,
      selected: 'Baseline'
    }
  },
  computed: {
    name() {
      if (this.gdxData && gdxData.Baseline) return gdxData.Baseline.name
      else return "-"
    },
    innovations() {
      if (this.gdxData) return Object.keys(this.gdxData).slice(1)
      else return []
    },
    baselineShown() {
      if (this.selected === "Baseline") return true
      else return false
    }
  },
  created() {
    console.log(Object.keys(gdxData));
  },
  components: {
    baseline,
    innovations
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
  
  @media screen and (max-width: 768px) {
    .page {
      width: 100%;
      margin: 0px;
      border-radius: none;
      min-height: unset;
    }
    
    .subpage {
      padding: 10px;
      min-height: unset;
    }
    
    .subpage .tab {
      border-left: none;
    }
  }
</style>
