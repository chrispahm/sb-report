/*
window.colors = [
  '#ef7a17',
  '#ef5948',
  '#dc466a',
  '#b84482',
  '#8a498e',
  '#584b89',
  '#274877',
  '#003f5c'
]
*/
///*
window.colors = [
  '#003f5c',
  '#274877',
  '#584b89',
  '#8a498e',
  '#b84482',
  '#dc466a',
  '#ef5948',
  '#ef7a17'
]
//*/

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function hexToRgbA(hex, val) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${val.toString()})`;
  }
  throw new Error('Bad Hex');
}

function format(string) {
  try {
    string = string.replace(/_/g, ' ')
    string = string.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    return string.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  } catch (e) {
    return string
  }
}

new window.Vue({
  el: '#app',
  data: () => {
    return {
      crops: [
        ['gras1_4_graz100', 33.08381588498732],
        ['gras2_7.6_graz40_1cuts_sil60', 18.725705941682627],
        ['gras3_9_graz40_2cuts_hay60', 1.6349118060410077],
        ['idleGras', 42.555566367289046]
      ],
      dryMatter: [
        ['gras1_4_graz100', 'earlyGraz', 264.67052707989853],
        ['gras1_4_graz100', 'middleGraz', 147.03918171105477],
        ['gras1_4_graz100', 'lateGraz', 330.83815884987314],
        ['gras2_7.6_graz40_1cuts_sil60',
          'middleGraz',
          237.19227526131328
        ],
        ['gras2_7.6_graz40_1cuts_sil60', 'lateGraz', 71.15768257839397],
        ['gras2_7.6_graz40_1cuts_sil60',
          'earlyGrasSil',
          243.96919741163643
        ],
        ['gras3_9_graz40_2cuts_hay60', 'lateGraz', 29.428412508738138],
        ['gras3_9_graz40_2cuts_hay60', 'hay', 10.265725293745861]
      ],
      profitFct: [
        ['sumVarCost', '', 46970.45046619068],
        ['Revenues', '', 112445.78419578116],
        ['Profit(Euro)', '', 46065.37313004615],
        ['SalesRevenues', '', 68500.64419578115],
        ['RevenuesAnimals', '', 68500.64419578115],
        ['RevenuesBeef', '', 68500.64419578115],
        ['RevenuesByBeef', 'bullMeat_Type1_Saler', 8039.446969696971],
        ['RevenuesByBeef',
          'bullMeat_Type1_SalChar',
          25833.891889728056
        ],
        ['RevenuesByBeef', 'oldCow', 13903.012499999997],
        ['RevenuesByBeef',
          'heifMeat_Type1_SalChar',
          20724.292836356126
        ],

        ['SumSubsidies', '', 43545.54],
        ['directPay', '', 32544],
        ['coupledSupport', '', 11001.539999999999],
        ['InterestGained', '', 399.6],
        ['sumBuyCost', '', 33594.06481505741],
        ['sumFeedBuyCost', '', 22311.07780979648],
        ['BuyCost', 'ConcCattle1', 22084.770220450708],
        ['BuyCost', 'SoyBeanMeal', 226.30758934577275],
        ['BuyCost', 'Diesel', 580.9884093002339],
        ['BuyCost', 'seed', 534.4443363271096],
        ['BuyCost', 'straw', 4757.238254307317],
        ['BuyCost', 'Other', 1881.3456712436323],
        ['BuyCost', 'fixedMach', 14.029163828586626],
        ['BuyCost', 'manCost', 3350.8979702540555],
        ['BuyCost', 'buildCost', 164.0432],
        ['buildVarCost', '', 4101.08],
        ['machVarCost', '', 119.70717164356253],
        ['manVarCost', '', 3350.8979702540555],
        ['otherVarCost', '', 11215.016514561925],
        ['depreciation', '', 19400.450671374794]
      ],
      soldOutputQuant: [
        ['bullMeat_Type1_Saler', 3828.3080808080813],
        ['bullMeat_Type1_SalChar', 10544.445669276756],
        ['oldCow', 9.875],
        ['heifMeat_Type1_SalChar', 9010.562102763533]
      ]
    }
  },
  components: {
    'pie': window.httpVueLoader('/src/components/pie.vue'),
    'bar': window.httpVueLoader('/src/components/bar.vue'),
    'stackedbar': window.httpVueLoader('/src/components/stacked-bar.vue'),
    'fdtable': window.httpVueLoader('/src/components/table.vue')
  },
})