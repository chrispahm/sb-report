module.exports = {
  summary(data) {
    const country = data.name.substring(0,2).toUpperCase()
    let description = this.getIntro(data.name, data.scenario, country)
    description += this.getHerdDescription(data.sumHerd)
    description +=  this.getLuDesc(data.lu, country)
    description += this.getCrops(data.cropHa, country)
    description += this.closingStatement(data)
    return description
  },
  closingStatement(data) {
    const rand = Math.random()
    
    if (rand < 0.33) {
      let share = 'only a small share of ' + Math.round(data.autoShareInput * 100) + '%'
      if (data.autoShareInput > 0.2) share = 'a quarter of the share'
      if (data.autoShareInput > 0.3) share = 'a third of the total share'
      if (data.autoShareInput > 0.4) share = 'half of the share'
      if (data.autoShareInput > 0.6) share = 'two thirds of the share'
      if (data.autoShareInput > 0.7) share = 'three quarters of the share'
      if (data.autoShareInput > 0.8) share = 'the major share'
      return `Given the overall variable costs, ${share} is devoted to the buying of external inputs.`
    } else if (rand < 0.66) {
      return `Approximately ${Math.round(data.autoSharePrem * 100)}% of the farms overall revenue originate from coupled and single farm premium schemes.`
    } else {
      return `With the herd sizes and crop shares previously described, a yearly workload of ${Math.round(data.work1.find(d => d[0] === 'totWork')[1])} hours was estimated in the ${data.scenario} scenario.`
    }
  },
  getCrops(cropHa, country) {
    const crops = cropHa.filter(c => !c[0].includes('idle')).sort((a,b) => b[1] - a[1])
    const arabCrops = crops.filter(c => !c[0].includes('gras'))
    const grasCrops = crops.filter(c => c[0].includes('gras'))
    const silage = crops.filter(c => c[0].includes('sil'))
    const hay = crops.filter(c => c[0].includes('hay'))
    const grazing = crops.filter(c => c[0].includes('graz'))
    
    const hasArab = arabCrops.length ? true : false
    const mainProduce = this.getCropsName(crops[0][0])
    
    const rand = Math.random()
    let text = ''
    if (rand < 0.5) {
      text += `Mainly ${mainProduce} is produced on an area of ${Math.round(crops[0][1])}ha. `  
      if (!hasArab) text += 'The farm does not produce any arable crops. '
      if (!grasCrops.length) text += 'The farm is not endowed with grassland that could be valorized by the herd. '
    } else {
      text += `${mainProduce.charAt(0).toUpperCase() + mainProduce.slice(1)} covers the major part of the farms land on an area of ${Math.round(crops[0][1])}ha. `
      if (!hasArab) text += 'No arable crops are produced on the farm. '
      if (!grasCrops.length) text += 'The farm is not endowed with grassland that could be valorized by the herd. '
    }
    return text
  },
  getCropsName(crop) {
    if (crop.includes('sil')) return 'grass silage as a feedstock'
    else if (crop.includes('graz')) return 'grass for grazing as a feedstock'
    else if (crop.includes('hay')) return 'hay as a feedstock'
    else if (crop === 'WinterWheat') return 'winter wheat for sale'
    else if (crop === 'maizSil' || crop === 'MaizSil') return 'maize silage as a feedstock'
    else return crop
  },
  getLuDesc(lu, country) {
    const rand = Math.random()
    const LUperha = lu.find(l => l[0] === 'LUperha')[1].toFixed(1)
    const sumLU = lu.find(l => l[0] === 'sumLU')[1].toFixed(0)
    const countryAvg = this.lusPerCountry(country)
    const direction = (countryAvg - LUperha) > 0 ? 'below' : 'above'
    let deviation = 'equal to'
    if (Math.abs(countryAvg - LUperha) > 0.1) deviation = 'slightly ' + direction
    if (Math.abs(countryAvg - LUperha) > 0.3) deviation = direction
    if (Math.abs(countryAvg - LUperha) > 0.6) deviation = 'well ' + direction
    if (rand < 0.5) {
      return `The average livestock density per ha (LU/ha) is found to be ${LUperha}, ${deviation} the countries average value of ${countryAvg}. `
       + `The total livestock density is ${sumLU}. `
    } else {
      return `Given this herd size, the total livestock density of the farm is ${sumLU}. The average livestock density per ha (LU/ha) is simulated to be ${LUperha}. `
      + `Given the countries average stocking density of ${countryAvg}, the case-study is ${direction} to the ${this.countriesDecl(country)} mean value. `
    }
  },
  lusPerCountry(country) {
    countries = {
      IE: 1.3,
      DE: 1.1,
      FR: 0.8,
      BE: 2.8,
      IT: 0.8
    }
    return countries[country]
  },
  getHerdDescription(sumHerd) {
    const relevant = ['sucklerCows','cows','bullsSold']
    const breedsMapping = {
      SalChar: 'Saler x Charolais',
      MontCha: 'Montbeliarde x Charolais',
      CrossBulls: ''
    }
    
    const baseHerds = sumHerd.filter(h => relevant.includes(h[0]) && !(h[1] in breedsMapping))
    const crossHerds = sumHerd.filter(h => relevant.includes(h[0]) && (h[1] in breedsMapping))
    // check if duplicate bulls exist
    const names = {
      sucklerCows: 'suckler cows',
      cows: 'cows',
      bullsSold: 'bulls'
    }
    

    let herdText = ''
    
    if (baseHerds.length === 3) {
      herdText += `${Math.round(baseHerds[0][2])} ${names[baseHerds[0][0]]}, ${Math.round(baseHerds[1][2])} ${names[baseHerds[1][0]]}, and ${Math.round(baseHerds[2][2])} ${names[baseHerds[2][0]]}. `
    } else if (baseHerds.length === 2) {
      herdText += `${Math.round(baseHerds[0][2])} ${names[baseHerds[0][0]]}, and ${Math.round(baseHerds[1][2])} ${names[baseHerds[1][0]]}. `
    } else if (baseHerds.length === 1) {
      herdText += `${Math.round(baseHerds[0][2])} ${names[baseHerds[0][0]]}. `
    } 
    
    if (crossHerds.length && herdText) {
      herdText += `In addition, ${Math.round(crossHerds[0][2])} crossbred ${breedsMapping[crossHerds[0][1]]} ${names[crossHerds[0][0]]} were sold annually. `
    } else if (crossHerds.length) {
      herdText += `${Math.round(crossHerds[0][2])} crossbred ${breedsMapping[crossHerds[0][1]]} ${names[crossHerds[0][0]]}. `
    } else if (!herdText) {
      herdText += 'no animals. '
    }
    return herdText
  },
  getIntro(name, scenario, country) {
    const rand = Math.random()
    if (scenario === 'Baseline') {
      if (rand < 0.33) {
        return `In the baseline scenario, the ${this.countriesDecl(country)} farm "${name}" is herding `
      } else if (rand < 0.66) {
        return `The case-study farm "${name}" based in ${this.countries(country)} was simulated to herd `
      } else {
        return `In the FarmDyn simulation, the ${this.countriesDecl(country)} case-study farm "${name}" herds an average of `
      }
    } else {
      if (rand < 0.66) {
        return `In the ${scenario} scenario, the farm is herding `
      } else {
        return `In the FarmDyn simulation of the ${scenario} scenario, the farm herds an average of `
      }
    }
  },
  countries(country) {
    const countries = {
      IE: 'Ireland',
      GE: 'Germany',
      FR: 'France',
      BE: 'Belgium',
      IT: 'Italy'
    }
    return countries[country]
  },
  countriesDecl(country) {
    const countries = {
      IE: 'Irish',
      GE: 'German',
      FR: 'French',
      BE: 'Belgian',
      IT: 'Italian'
    }
    return countries[country]
  }
}