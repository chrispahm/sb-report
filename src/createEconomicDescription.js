module.exports = (data) => {
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR'
    })
    const revenues = Math.round(data.profitFct.find(p => p[0] === 'Revenues')[2])
    const share = Math.round(Math.round(data.profitFct.find(p => p[0] === 'RevenuesAnimals')[2]) / revenues * 100)
    const hasArab  = data.cropHa.filter(c => !c[0].includes('gras') && !c[0].includes('MaizSil')).length ? true : false
    const varCost = Math.round(data.profitFct.find(p => p[0] === 'sumVarCost')[2])
    const profits = Math.round(data.profitFct.find(p => p[0] === 'Profit(Euro)')[2])
    const caseStudy = data.name

    return `Given the farms endowments, FarmDyn simulated a yearly average revenue of ${formatter.format(revenues)}.
    Approximately ${share}% of the revenue stream resulted from livestock sales.
    The remainder of the revenue originated from ${hasArab ? 'subsidies as well as cash crop production.' : 'various subsidies.'}
    Given overall variable costs of ${formatter.format(varCost)}, an average yearly farm profit of ${formatter.format(profits)} was estimated.
    Please note that profits calculated in FarmDyn may diverge from profits actually realized on the case-study farm ${caseStudy}:
    Assumptions made about work loads, storage losses, available field work hours, building costs (resulting in depreciation costs), taxation and many other parameters
    highly influence the profitability.
    The baseline presented in this report was calibrated with respect to the herd sizes of the original case-study farm, closely resembling the ones presented in this baseline simulation report.`
}
