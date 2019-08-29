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
      ]
    }
  },
  components: {
    'pie': window.httpVueLoader('/src/components/pie.vue'),
    'bar': window.httpVueLoader('/src/components/bar.vue'),
    'stackedbar': window.httpVueLoader('/src/components/stacked-bar.vue')
  },
})