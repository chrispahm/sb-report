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

window.shortMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

window.data.enviOptions = {
  scales: {
      yAxes: [{
      type: 'logarithmic'  
    }]
  }
}

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
  data: window.data,
  components: {
    'pie': window.httpVueLoader('/src/components/pie.vue'),
    'bar': window.httpVueLoader('/src/components/bar.vue'),
    'stackedbar': window.httpVueLoader('/src/components/stacked-bar.vue'),
    'stackedlines': window.httpVueLoader('/src/components/stacked-lines.vue'),
    'fdtable': window.httpVueLoader('/src/components/table.vue')
  },
})