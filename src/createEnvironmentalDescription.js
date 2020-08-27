module.exports = (data) => {
    const value = data.enviTot.find(p => p[0] === 'GWP')
    if (!value) return
    const gwp = Math.round(value[1] * 100) / 100
    const totMeat = Math.round(data.soldOutputQuant.filter(o => o[0].includes('Meat')).reduce((acc,val) => {
      acc += val[1]
      return acc
    }, 0))
    const caseStudy = data.name
    return `Indicators linked to environmental impacts of the farms overall production were calculated post simulation.
    The farms production processes were modeled in detail by FarmDyn, and subsequently mapped to life cycle inventory data provided by the ecoinvent database.
    Resulting from this novel approach, the global warming potential per kg of meat for the case-study ${caseStudy} was estimated to be approximately ${gwp.toLocaleString('en-GB')}kg CO₂/kg meat.`
}