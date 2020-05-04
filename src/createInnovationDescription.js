module.exports = (data) => {
  return `In the ${data.scenario} scenario, the case study farm ${data.name} ${
    Math.abs(data.profitChange) < 0.05 ? 'slightly' : ''
  } ${
    data.profitChange >= 0 ? 'increases' : 'decreases'
  } its profits compared to the baseline scenario. The total global warming potential of the farm is ${
    data.GWPChange >= 0 ? 'increased' : 'decreased'
  } by utilising the given innovation. Total calorie efficiency of the farm is ${
    data.calChange >= 0 ? 'increased' : 'decreased'
  } by the use of the innovation as well.`
}