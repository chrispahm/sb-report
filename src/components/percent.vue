<template lang="html">
  <div>
    <h5 v-bind:id="id + '_head'" class="title is-5 fd-item">{{ title }}</h5>
    <div>
      <h1 class="title" style="text-align: center;" :class="{ positive: !isNegative, negative: isNegative }">
        {{ animatedValue }}
      </h1>
    </div>  
  </div>  
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    finalValue: {
      type: Number,
      required: true
    }
  },
  computed: {
    isNegative() {
      if (this.title.includes('Global')) {
        if (this.finalValue < 0) return false
        else return true
      } else {
        if (this.finalValue < 0) return true
        else return false
      }    
    }
  },
  data() {
    return {
      animatedValue: '0%'
    }
  },
  mounted() {
    setTimeout(() => {
      this.animate()
    }, 600)
    
  },
  methods: {
    async animate() {
      if (isNaN(this.finalValue) || !this.finalValue) return
      if (this.finalValue === 0) return
      const steps = new Array(50)
      for (let i = 1; i < steps.length; i++) {
        await this.update(this.finalValue / steps.length * i)
      }
    },
    update(value) {
      return new Promise(resolve => {
        setTimeout(() => {
          this.animatedValue = (value * 100).toFixed(2) + '%'
          resolve()
        }, 20)
      })
    }
  }
}
</script>

<style lang="css" scoped>
.positive {
  color: #55854c;
}
.negative {
  color: #db4e3b;
}
</style>
