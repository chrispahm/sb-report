function proteinCalories(data) {
  const protDirection = data.protChange > 0 ? 'increased' : 'decreased'
  const calDirection = data.calChange > 0 ? 'increased' : 'decreased'
  if (protDirection === calDirection) {
    return `Total calorie and protein efficiency both ${protDirection} due to the innovation as well.`
  } else {
    return `With the changes induced by the innovation, the total calorie efficiency ${calDirection}, while the total protein efficiency ${protDirection}.`
  }
}


module.exports = (data) => {
  return `In the ${data.scenario} scenario, the case study farm ${data.name} ${
    Math.abs(data.profitChange) < 0.05 ? 'slightly' : ''
  } ${
    data.profitChange >= 0 ? 'increases' : 'decreases'
  } its profits compared to the baseline scenario. The total global warming potential of the farm is ${
    data.GWPChange >= 0 ? 'increased' : 'decreased'
  } by utilising the given innovation. ${proteinCalories(data)}`
}