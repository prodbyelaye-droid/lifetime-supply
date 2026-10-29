// Round 2 colour plan. Every hex is a pixel sampled from Elaye's own reference image
// (3x3 mean at the stated source coordinate; see scripts/r2-sample.py). Nothing invented.
// cool/warm: light -> deep ramps the fluid's two structural families map onto.
// glow: the luminous stop screened over the fluid's highlights. ground: 'white' blooms out
// of the page white; 'deep' is a full saturated field (white ink).
export const PALETTES = {
  // Hero cloud. 183 Conduit, PRIMARY: "those deep colours are perfect". Sky tile + bloom tile.
  hero: {ref: '183', ground: 'white',
    cool: ['#76d5f4', '#a2bfee', '#7370ce'], warm: ['#f0b99f', '#f8ab6a', '#da7146'], glow: '#76d5f4',
    src: {'#76d5f4': '183 @33,22', '#a2bfee': '183 @681,364', '#7370ce': '183 @960,617', '#f0b99f': '183 @798,467', '#f8ab6a': '183 @680,487', '#da7146': '183 @803,651'}},
  // Everything, day one: the split card's blend half. 010: "100%".
  inside: {ref: '010', ground: 'white',
    cool: ['#ceb7d1', '#deabb4', '#e89f96'], warm: ['#f4bb80', '#faa56d', '#fb8c5e'], glow: '#f4bb80',
    src: {'#ceb7d1': '010 @562,176', '#deabb4': '010 @689,160', '#e89f96': '010 @704,208', '#f4bb80': '010 @801,224', '#faa56d': '010 @749,366', '#fb8c5e': '010 @713,364'}},
  // Flow strands. 044: "I love all of the coloring on the actual calendar."
  flow: {ref: '044', ground: 'white',
    cool: ['#a5d5f4', '#7bb7e4', '#5c9ee1'], warm: ['#b8e4ea', '#90ded9', '#92c4ec'], glow: '#b8e4ea',
    src: {'#a5d5f4': '044 @11,12', '#7bb7e4': '044 @83,114', '#5c9ee1': '044 @91,27', '#b8e4ea': '044 @202,10', '#90ded9': '044 @143,126', '#92c4ec': '044 @56,123'}},
  // Deep section, the stop-the-viewer. VAR2 02 (ref 150) deep blue; glow from 145's bloom.
  deep: {ref: 'VAR2 02 (150) + 145 glow', ground: 'deep',
    cool: ['#3f2cdd', '#2324d9', '#1420d6'], warm: ['#2e27dc', '#1821d8', '#1420d6'], glow: '#07c1fc',
    src: {'#3f2cdd': '150 @486,528', '#2324d9': '150 @304,432', '#1420d6': '150 @388,345', '#2e27dc': '150 @449,500', '#1821d8': '150 @488,344', '#07c1fc': '145 @357,586'}},
  // Stats. 185: "Deeper, 1:1 in blending and depth; use for a section."
  stats: {ref: '185', ground: 'white',
    cool: ['#c7e1f8', '#76bffa', '#46a7fd'], warm: ['#f9dece', '#fee39c', '#fde199'], glow: '#cfebfb',
    src: {'#c7e1f8': '185 @890,761', '#76bffa': '185 @362,40', '#46a7fd': '185 @135,325', '#f9dece': '185 @625,702', '#fee39c': '185 @270,576', '#fde199': '185 @30,520', '#cfebfb': '185 @365,123'}},
  // Everything-day-one boxes, one gradient each (Stage 2 assigns the rest of the plan).
  vault: {ref: '155', ground: 'white',
    cool: ['#f89a9e', '#f99c7b', '#d9a986'], warm: ['#f99c7b', '#f69e60', '#f69e60'], glow: '#ecd5c6',
    src: {'#f89a9e': '155 @418,137', '#f99c7b': '155 @448,158', '#d9a986': '155 @550,152', '#f69e60': '155 @486,153', '#ecd5c6': '155 @579,191'}},
  modules: {ref: '026', ground: 'white',
    cool: ['#a2bddb', '#75a3cb', '#50769b'], warm: ['#e5ccbc', '#f2cba5', '#f2cba5'], glow: '#e5ccbc',
    src: {'#a2bddb': '026 @145,52', '#75a3cb': '026 @110,40', '#50769b': '026 @59,52', '#e5ccbc': '026 @231,95', '#f2cba5': '026 @115,101'}},
  // The portal arch. 034: "the arched colourway with white at the edges."
  portal: {ref: '034', ground: 'white',
    cool: ['#b6e5fd', '#72c6fa', '#49a2f6'], warm: ['#d6f1ff', '#98d8fb', '#49a2f6'], glow: '#e3f4fe',
    src: {'#b6e5fd': '034 @831,114', '#72c6fa': '034 @552,190', '#49a2f6': '034 @529,243', '#d6f1ff': '034 @775,255', '#98d8fb': '034 @488,145', '#e3f4fe': '034 @144,182'}},
  // Get started. 145: "Likes the bloom from the bottom"; "much deeper".
  steps: {ref: '145', ground: 'white',
    cool: ['#8cdbff', '#07c1fc', '#0176fd'], warm: ['#cdf0fe', '#45c8fd', '#0394f7'], glow: '#cdf0fe',
    src: {'#8cdbff': '145 @585,514', '#07c1fc': '145 @357,586', '#0176fd': '145 @463,724', '#cdf0fe': '145 @505,477', '#45c8fd': '145 @398,545', '#0394f7': '145 @474,700'}},
  // Price. 189: "The way the card sits holographically on the colour is how everything should sit."
  price: {ref: '189', ground: 'deep',
    cool: ['#a2beed', '#d9b9e4', '#6c6cce'], warm: ['#f3bb9a', '#f5a466', '#d87647'], glow: '#f5a466',
    src: {'#a2beed': '189 @244,11', '#d9b9e4': '189 @465,49', '#6c6cce': '189 @187,593', '#f3bb9a': '189 @62,103', '#f5a466': '189 @53,213', '#d87647': '189 @262,596'}},
  // Footer. 005: "The colour is a perfect reference ... (deepened)."
  footer: {ref: '005', ground: 'deep',
    cool: ['#cfddfe', '#b1d0ff', '#acaafe'], warm: ['#dfe5ff', '#bed5ff', '#afbffe'], glow: '#dfe5ff',
    src: {'#cfddfe': '005 @608,112', '#b1d0ff': '005 @176,96', '#acaafe': '005 @596,243', '#dfe5ff': '005 @798,128', '#bed5ff': '005 @480,100', '#afbffe': '005 @991,156'}},
  // Deep section (landing task 010): the Sabo material in VAR2's 183R colourway "Sky / honey" (MAT/VAR2/palettes.json:
  // #77d5f2, #e3b670), deepened with 183's own green and orange so the logo's white strokes reach 3:1.
  deep183: {ref: 'VAR2 01 (183R) + 183 deep tones', ground: 'deep',
    cool: ['#77d5f2', '#34d0fd', '#138643'], warm: ['#e3b670', '#c0ab3e', '#d88735'], glow: '#77d5f2',
    src: {'#77d5f2': 'VAR2 01 @758,151', '#e3b670': 'VAR2 01 @490,750', '#34d0fd': 'GRAD 183 @1071,364', '#138643': 'GRAD 183 @1085,819', '#c0ab3e': '183 sheet hex', '#d88735': '183 sheet hex'}},

};

// Headline full stops: 3D blots, each a different deep colour. light/base/deep shade the body.
export const BLOTS = {
  // 184: "like that blue" (small design detail across the site). Voice orb in the phone.
  setup: {ref: '184', light: '#92dcfb', base: '#238af9', deep: '#037afd',
    src: {'#92dcfb': '184 @501,806', '#238af9': '184 @449,835', '#037afd': '184 @486,816'}},
  // Picks up the hero cloud's deep warm stop (183 bloom tile), as the 22:39 note allows.
  forever: {ref: '183', light: '#f8ab6a', base: '#da7146', deep: '#da7146',
    src: {'#f8ab6a': '183 @680,487', '#da7146': '183 @803,651'}},
};
