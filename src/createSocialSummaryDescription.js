module.exports = (data) => {
    const hasExtraWork = data.work.find(p => p[1] === 'animalExtraWork')
    const fieldWorkVaries = data.work.filter(p => p[1] === 'field').reduce((acc,val,i) => {
      if (i === 0) return val[2]
      if (acc == val[2]) {
        return val[2]
      }
      return true
    }, false)
    const animalWorkVaries = data.work.filter(p => p[1] === 'animalWork').reduce((acc,val,i) => {
      if (i === 0) return Math.round(val[2])
      if (acc == Math.round(val[2])) {
        return Math.round(val[2])
      }
      return true
    }, false)
    
    const totalWorkload = Math.round(data.work1.find(d => d[0] === 'totWork')[1])
    const caseStudy = data.name
    
    return `As previously stated, the total workload of the the given case-study ${caseStudy} was simulated to be ${totalWorkload} hours per year.
    ${animalWorkVaries === true ? 'Due to seasonal shifts within the herd sizes, work loads for the animals differ between the months.' : 'Due to homogenous herd sizes, work related to animals was simulated to remain equal throughout the year.'}
    ${hasExtraWork ? 'The calvings significantly add to the work peaks, as displayed by the "Animal Extra Work" area in the graph below.' : ''}
    ${fieldWorkVaries === true ? 'Seasonal work peaks are additionally caused by the required field work. ' : 'Due to the structure of the farm, field work is expected to be evenely distributed throughout the year.'}`
}