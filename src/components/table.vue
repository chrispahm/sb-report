<template>
  <div>
    <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
    <table class="table is-striped is-fullwidth">
      <thead style="page-break-inside: auto;" v-if="header">
        <th v-for="(head,i) in header" :key="`${head}_${i}_head`">
          {{head}}
        </th>
      </thead>
      <tbody>
        <tr v-for="(row,j) in filteredData" :key="`${JSON.stringify(row)}_${j}_row`">
          <td v-for="(cell,k) in row" :key="`${cell}_${k}_cell`">{{
            cellFormat(cell)}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import helpers from '../helpers'
import _ from 'lodash'

export default {
  name: "fdtable",
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    isEcon: {
      type: Boolean,
      required: false,
      default: false
    },
    round: {
      type: Number,
      required: false,
      default: 2
    },
    header: {
      type: Array,
      required: false,
      default: undefined
    },
    id: {
      type: String,
      required: false
    }
  },
  computed: {
    filteredData() {
      return this.data.filter(r => {
        const ignore = ['bullsKept','oldCows']
        if (ignore.indexOf(r[0]) === -1) {
          return r
        }
      })
    }
  },
  methods: {
    cellFormat(cell) {
      const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'EUR'
      })
      if (this.isEcon && !isNaN(Number(cell)) && cell) {
        return formatter.format(cell)
      } else if (!isNaN(Number(cell)) && Number(cell) > 100000000 ) {
        return 'inf'
      } else if (!isNaN(Number(cell)) && cell) {
        return _.round(cell,this.round).toLocaleString('en-GB')
      } else if (!this.isEcon) {
        return helpers.addUnits(helpers.format(cell))
      }
      return helpers.format(cell)
    }
  }
}
</script>
<style scoped>
</style>
