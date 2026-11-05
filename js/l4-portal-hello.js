(()=>{
const COLOURS={"_":"Opus 058 · every blot colour in the portal comes from this one file (STANDING 13, his 19:37: the blots' colours are ours, not a reference's 1:1). To swap in cdesign 059's pick, change the six accents below; seeds, moods, the device light and the notes follow. V1 Sky-led blues (his 17:30) stay as they are.","pick":"W1 1104 (R2 NR-5, sky for all 14:28): the music-stage light and notes are the sky ramp only (were sky0, orchid, pink, coral). 059 final A: manager GO-059; cportal 075 colour-only integration; eyes/motion unchanged; DV3 4 Nov blot audit B2: no yellow or green blots (seed 3 sun -> v1.sky2, done -> seed 1, sun and mint out of light/notes; the two accents stay defined, unused)","v1":{"sky0":"#11B1F8","sky1":"#3CC3FE","sky2":"#8DDCFD","sky3":"#BEE9FC","sky4":"#C9ECFD"},"accents":{"pink":"#FC82CB","orchid":"#EB7BEF","sun":"#FCD16E","periwinkle":"#7C85F5","coral":"#FFBDA6","mint":"#3CE7B9"},"seeds":{"1":"v1.sky1","2":"pink","3":"v1.sky2","4":"orchid","5":"periwinkle","6":"coral"},"moods":{"idle":{"seed":1},"thinking":{"seed":4},"done":{"seed":1},"happy":{"seed":2}},"splash":"v1.sky0","light":["v1.sky0","v1.sky1","v1.sky2","v1.sky1"],"notes":["v1.sky0","v1.sky1","v1.sky0","v1.sky1"]};
const ARC = { x: [0.028, 0.027, 0.028, 0.028, 0.025, 0.025, 0.025, 0.025, 0.024, 0.027, 0.027, 0.028, 0.028, 0.028, 0.028, 0.028, 0.028, 0.028, 0.028, 0.029, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.029, 0.028, 0.028, 0.028, 0.028, 0.028, 0.028, 0.028, 0.028, 0.041, 0.047, 0.05, 0.049, 0.046, 0.04, 0.038, 0.032, 0.029, 0.024, 0.019, 0.015, 0.01, 0.006, 0.002, -0.001, -0.005, -0.008, -0.012, -0.015, -0.016, -0.019, -0.019, -0.02, -0.022, -0.022, -0.023, -0.023, -0.023, -0.023, -0.022, -0.022, -0.021, -0.02, -0.019, -0.018, -0.018, -0.017, -0.017, -0.016, -0.015, -0.015, -0.015, -0.015, -0.015, -0.014, -0.015, -0.015, -0.015, -0.015, -0.016, -0.018, -0.019, -0.023, -0.027, -0.028, -0.024, -0.018, -0.014, -0.005, 0.006, 0.023, 0.04, 0.061, 0.081, 0.101, 0.119, 0.136, 0.152, 0.164, 0.178, 0.189, 0.198, 0.205, 0.211, 0.215, 0.219, 0.219, 0.219, 0.219, 0.217, 0.213, 0.208, 0.205, 0.201, 0.198, 0.195, 0.193, 0.19, 0.188, 0.186, 0.185, 0.183, 0.181, 0.18, 0.178, 0.178, 0.177, 0.176, 0.176, 0.175, 0.175, 0.174, 0.174, 0.174, 0.174, 0.174, 0.174, 0.174, 0.174, 0.174, 0.176, 0.177, 0.181, 0.186, 0.193, 0.202, 0.213, 0.229, 0.249, 0.268, 0.292, 0.32, 0.357, 0.388, 0.399, 0.394, 0.382, 0.364, 0.342, 0.317, 0.29, 0.262, 0.233, 0.205, 0.176, 0.151, 0.126, 0.103, 0.083, 0.065, 0.05, 0.038, 0.026, 0.018, 0.011, 0.006, 0.003, 0.0, 0.0, 0.0, 0.002, 0.004, 0.007, 0.01, 0.013, 0.016, 0.018, 0.02, 0.022, 0.023, 0.024, 0.026, 0.027, 0.028, 0.028, 0.029, 0.031, 0.031, 0.031, 0.031, 0.032, 0.032, 0.033, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.034, 0.033, 0.033, 0.034], y: [-0.028, -0.014, -0.014, -0.014, -0.014, -0.014, -0.014, -0.014, -0.014, -0.014, -0.014, -0.007, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.007, -0.007, 0.007, 0.028, 0.042, 0.028, -0.014, -0.056, -0.083, -0.083, -0.083, -0.076, -0.062, -0.042, -0.007, 0.028, 0.056, 0.083, 0.118, 0.139, 0.16, 0.181, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.181, 0.181, 0.181, 0.181, 0.181, 0.174, 0.167, 0.167, 0.167, 0.16, 0.153, 0.153, 0.153, 0.146, 0.139, 0.132, 0.132, 0.125, 0.118, 0.111, 0.111, 0.125, 0.16, 0.174, 0.174, 0.16, 0.139, 0.104, 0.09, 0.076, 0.083, 0.09, 0.097, 0.097, 0.104, 0.104, 0.118, 0.118, 0.125, 0.132, 0.139, 0.146, 0.146, 0.146, 0.153, 0.16, 0.167, 0.167, 0.167, 0.167, 0.174, 0.174, 0.181, 0.181, 0.181, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.188, 0.194, 0.194, 0.194, 0.194, 0.194, 0.201, 0.201, 0.201, 0.201, 0.201, 0.201, 0.201, 0.201, 0.201, 0.188, 0.167, 0.146, 0.139, 0.132, 0.125, 0.118, 0.111, 0.104, 0.083, 0.069, 0.056, 0.042, 0.035, 0.021, 0.014, 0.007, 0.007, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.007, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.007, -0.007, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0], l: [0.986, 0.986, 0.986, 1.0, 1.0, 1.0, 1.014, 1.014, 1.014, 1.014, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 0.806, 0.542, 0.333, 0.25, 0.292, 0.361, 0.444, 0.514, 0.639, 0.736, 0.819, 0.889, 0.944, 0.972, 1.0, 1.014, 1.0, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.014, 1.0, 1.014, 1.0, 1.014, 1.0, 1.0, 0.986, 0.792, 0.528, 0.333, 0.25, 0.264, 0.347, 0.444, 0.542, 0.653, 0.75, 0.819, 0.889, 0.931, 0.972, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.986, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.986, 0.986, 0.986, 0.986, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.986, 0.986, 0.986, 0.972, 0.986, 0.986, 0.986, 0.986, 1.0, 0.986, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.014, 1.014, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], r: [0.986, 0.986, 0.986, 1.0, 1.0, 1.0, 1.0, 1.014, 1.014, 1.014, 1.014, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 0.792, 0.542, 0.333, 0.25, 0.278, 0.347, 0.403, 0.472, 0.583, 0.708, 0.806, 0.889, 0.944, 0.972, 1.0, 1.014, 1.014, 1.014, 1.014, 1.0, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.014, 1.014, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 0.986, 0.792, 0.528, 0.319, 0.25, 0.278, 0.347, 0.444, 0.528, 0.653, 0.736, 0.819, 0.875, 0.944, 0.972, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 0.986, 1.0, 1.0, 1.0, 0.986, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.986, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.986, 1.0, 1.0, 1.0, 0.875, 0.694, 0.528, 0.389, 0.278, 0.236, 0.264, 0.319, 0.403, 0.472, 0.556, 0.653, 0.736, 0.792, 0.861, 0.903, 0.944, 0.986, 0.986, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.014, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], a: [-0.0, 0.001, 0.004, -0.002, 0.0, 0.0, -0.002, -0.0, 0.002, 0.001, 0.0, -0.001, 0.001, 0.001, 0.002, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.001, -0.001, -0.001, -0.001, -0.001, -0.001, -0.001, -0.001, -0.001, -0.002, -0.002, -0.002, -0.0, -0.0, -0.002, -0.002, -0.002, -0.002, -0.002, 0.003, 0.01, 0.015, 0.016, 0.015, 0.017, -0.045, -0.013, 0.015, 0.03, 0.038, 0.04, 0.046, 0.044, 0.051, 0.055, 0.057, 0.058, 0.058, 0.059, 0.059, 0.06, 0.062, 0.063, 0.067, 0.067, 0.067, 0.067, 0.069, 0.07, 0.07, 0.071, 0.073, 0.073, 0.073, 0.075, 0.076, 0.075, 0.077, 0.077, 0.077, 0.079, 0.08, 0.079, 0.079, 0.08, 0.079, 0.08, 0.079, 0.078, 0.078, 0.077, 0.077, 0.075, 0.073, 0.068, 0.063, 0.061, 0.058, 0.044, 0.032, -0.003, -0.043, -0.005, 0.005, 0.013, 0.019, 0.01, 0.006, 0.003, 0.001, -0.002, -0.008, -0.011, -0.015, -0.02, -0.024, -0.026, -0.032, -0.035, -0.038, -0.041, -0.046, -0.048, -0.051, -0.051, -0.056, -0.057, -0.059, -0.062, -0.064, -0.061, -0.064, -0.065, -0.067, -0.069, -0.07, -0.071, -0.072, -0.071, -0.071, -0.069, -0.071, -0.07, -0.07, -0.072, -0.073, -0.075, -0.075, -0.075, -0.075, -0.074, -0.071, -0.071, -0.066, -0.064, -0.058, -0.051, -0.044, -0.034, -0.023, -0.001, 0.017, 0.032, 0.061, 0.096, 0.123, 0.129, 0.145, 0.15, 0.144, 0.134, 0.127, 0.115, 0.104, 0.089, 0.075, 0.063, 0.05, 0.037, 0.026, 0.02, 0.007, 0.001, -0.008, -0.015, -0.02, -0.019, -0.018, -0.023, -0.024, -0.022, -0.022, -0.02, -0.021, -0.021, -0.016, -0.013, -0.013, -0.01, -0.009, -0.008, -0.008, -0.006, -0.006, -0.003, -0.003, -0.003, -0.004, -0.004, -0.004, -0.002, -0.001, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.001, -0.001, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.0, -0.001, -0.001, -0.001, -0.001, -0.0, -0.0] };
const EYE = { x: 0.096, y: 0.24, r: 0.05, w: 0.054 };
const EYE_HEIGHT = 2 * EYE.w;
const EYE_SCALE = { default: 1, splash: 150 / 115 };
const EYE_RGB = "vec3(1.0)";
const EYE_GLSL = `
float capsule(vec2 p, float h, float r){ p.y -= clamp(p.y, -h, h); return length(p) - r; }
float arc(vec2 p, float R, float w){ float d = abs(length(p) - R) - w; return p.y < 0.0 ? length(vec2(abs(p.x) - R, p.y)) - w : d; }
float rbox(vec2 p, vec2 b, float r){ vec2 d = abs(p) - b + r; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r; }
float ellip(vec2 p, vec2 rr){ return (length(p / rr) - 1.0) * min(rr.x, rr.y); }
float eyeShape(vec2 pe, float o, float r, float w, float port, float happy){
  float open = ellip(pe, vec2(r, w * mix(0.12, 1.0, o)));            // the master's round eye; a blink squashes it to 12%
  float hw = w * max(o, 0.12);
  float wink = ellip(pe + vec2(0.0, w - hw), vec2(r, hw));          // the 194 wink: squashed from its bottom
  float hap = arc(pe + vec2(0.0, r * 0.6), r * 1.25, r * 0.42);      // happy: an arc
  return mix(mix(open, wink, port), hap, happy);
}`;
const EYE_SVG_RECTS = [
    { x: 101.4, y: 65.0, width: 18.2, height: 19.7, rx: 9.1, ry: 9.85 },
    { x: 136.4, y: 65.0, width: 18.2, height: 19.7, rx: 9.1, ry: 9.85 },
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const mixc = (a, b, u) => a.map((x, i) => x + (b[i] - x) * u);
const css = (c, a = 1) => `rgba(${c.map((x) => Math.round(x * 255)).join(",")},${a.toFixed(3)})`;
function colour(name) {
    if (name.startsWith("#"))
        return name;
    if (name.startsWith("v1."))
        return COLOURS.v1[name.slice(3)];
    return COLOURS.accents[name];
}
const SEED_HEX = (seed) => colour(COLOURS.seeds[String(seed)] ?? "v1.sky1");
const SPLASH_FILL = colour(COLOURS.splash);
const LIGHT = COLOURS.light.map((n) => hex(colour(n)));
const NOTE_COLOURS = COLOURS.notes.map((n) => css(mixc(hex(colour(n)), [0.055, 0.09, 0.15], 0.22)));
const moodTint = (mood) => css(mixc(hex(SEED_HEX(COLOURS.moods[mood].seed)), [1, 1, 1], 0.82));
function lightAt(x) {
    const n = LIGHT.length, i = Math.floor(((x % n) + n) % n), u = x - Math.floor(x), s = u * u * (3 - 2 * u);
    return mixc(LIGHT[i], LIGHT[(i + 1) % n], s);
}
const OUTLINE = "M 113.000 17.000 C 119.970 15.640 120.240 15.640 125.000 17.000 C 129.760 18.360 135.390 23.300 141.000 25.000 C 146.610 26.700 146.950 21.900 158.000 27.000 C 169.050 32.100 193.760 45.480 206.000 55.000 C 218.240 64.520 224.050 73.650 230.000 83.000 C 235.950 92.350 238.790 99.800 241.000 110.000 C 243.210 120.200 244.870 132.290 243.000 143.000 C 241.130 153.710 240.200 159.910 230.000 173.000 C 219.800 186.090 196.600 208.950 183.000 220.000 C 169.400 231.050 165.130 236.130 150.000 238.000 C 134.870 239.870 108.620 234.570 94.000 231.000 C 79.380 227.430 72.330 221.930 64.000 217.000 C 55.670 212.070 49.590 207.780 45.000 202.000 C 40.410 196.220 40.910 188.780 37.000 183.000 C 33.090 177.220 24.550 174.800 22.000 168.000 C 19.450 161.200 23.530 150.140 22.000 143.000 C 20.470 135.860 12.320 136.370 13.000 126.000 C 13.680 115.630 20.050 92.370 26.000 82.000 C 31.950 71.630 42.900 70.780 48.000 65.000 C 53.100 59.220 49.880 54.800 56.000 48.000 C 62.120 41.200 74.310 30.270 84.000 25.000 C 93.690 19.730 106.030 18.360 113.000 17.000 Z";
const BLOT_PATH = OUTLINE;
const N = 512, PAD = 0.15;
function edt1d(g, o, s, f, v, z, n) {
    v[0] = 0;
    z[0] = -1e20;
    z[1] = 1e20;
    f[0] = g[o];
    for (let q = 1, k = 0, r = 0; q < n; q++) {
        f[q] = g[o + q * s];
        do {
            const p = v[k];
            r = (f[q] - f[p] + q * q - p * p) / (q - p) / 2;
        } while (r <= z[k] && --k > -1);
        k++;
        v[k] = q;
        z[k] = r;
        z[k + 1] = 1e20;
    }
    for (let q = 0, k = 0; q < n; q++) {
        while (z[k + 1] < q)
            k++;
        const p = v[k], d = q - p;
        g[o + q * s] = f[p] + d * d;
    }
}
function sdf(alpha, n) {
    const out = new Float64Array(n * n), inn = new Float64Array(n * n);
    for (let i = 0; i < n * n; i++) {
        const a = alpha[i];
        if (a >= 1) {
            out[i] = 0;
            inn[i] = 1e20;
        }
        else if (a <= 0) {
            out[i] = 1e20;
            inn[i] = 0;
        }
        else {
            const d = 0.5 - a;
            out[i] = d > 0 ? d * d : 0;
            inn[i] = d < 0 ? d * d : 0;
        }
    }
    const f = new Float64Array(n), z = new Float64Array(n + 1), v = new Uint16Array(n);
    for (const g of [out, inn]) {
        for (let x = 0; x < n; x++)
            edt1d(g, x, n, f, v, z, n);
        for (let y = 0; y < n; y++)
            edt1d(g, y * n, 1, f, v, z, n);
    }
    const r = new Uint8Array(n * n * 4);
    for (let i = 0; i < n * n; i++) {
        const d = (Math.sqrt(out[i]) - Math.sqrt(inn[i])) / n;
        const b = Math.max(0, Math.min(255, Math.round((0.5 + d) * 255)));
        r[i * 4] = r[i * 4 + 1] = r[i * 4 + 2] = b;
        r[i * 4 + 3] = 255;
    }
    return r;
}
let fieldP = null;
function blotField() {
    fieldP ?? (fieldP = (async () => {
        const img = new Image();
        img.src = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path fill="white" d="${OUTLINE}"/></svg>`);
        await img.decode();
        const b = document.createElement("canvas");
        b.width = b.height = N;
        const bx = b.getContext("2d", { willReadFrequently: true });
        bx.filter = "blur(4px)";
        const s = (N * (1 - 2 * PAD)) / 256;
        bx.drawImage(img, (N - 256 * s) / 2, (N - 256 * s) / 2, 256 * s, 256 * s);
        const al = bx.getImageData(0, 0, N, N).data, A = new Float32Array(N * N);
        for (let i = 0; i < N * N; i++)
            A[i] = Math.min(1, Math.max(0, (al[i * 4 + 3] / 255 - 0.35) / 0.3));
        return sdf(A, N);
    })());
    return fieldP;
}
const VERT = `attribute vec2 p; uniform vec2 uRes, uCenter; uniform float uHalf;
void main(){ gl_Position = vec4((uCenter + p * uHalf) / uRes * 2.0 - 1.0, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform sampler2D uSdf;
uniform vec2 uCenter;
uniform float uSide, uTime, uSeed, uBreath, uRot, uHappy, uFlow, uTilt, uMorphMix, uPort, uTintK;
uniform vec3 uFill, uTintL, uTintR;
uniform vec2 uMorph, uSquash, uLook, uOpen;
uniform vec4 uEyeG;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed * 17.0) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * n2(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
// A · CRITIC-1104 §5: the outline's warp with its highest octave at half weight, so no notch is smaller than about 6% of the
// body (the band and anything else keep fbm as it was)
float fbmS(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += (i == 3 ? 0.5 : 1.0) * a * n2(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
${EYE_GLSL}
void main(){
  vec2 q = (gl_FragCoord.xy - uCenter) / uSide * 2.0;
  float cr = cos(uRot), sr = sin(uRot); q = mat2(cr, -sr, sr, cr) * q;
  q /= 1.0 + uBreath;
  float m = length(uSquash); vec2 dir = m > 1e-4 ? uSquash / m : vec2(1.0, 0.0);
  float along = dot(q, dir); vec2 across = q - along * dir; float k = 1.0 + m;
  along /= k * (1.0 + 0.6 * m * smoothstep(-0.2, 0.8, along));
  q = along * dir + across * k;
  float sa = uSeed * 1.9; vec2 qs = mat2(cos(sa), -sin(sa), sin(sa), cos(sa)) * q;
  qs *= vec2(1.0 + 0.14 * sin(uSeed * 2.7), 1.0 - 0.14 * sin(uSeed * 2.7));
  vec2 warp = vec2(fbmS(qs * 0.9 + uSeed * 3.1), fbmS(qs * 0.9 - uSeed * 2.3)) - 0.484;
  vec2 kA = vec2(fbmS(qs * 1.2 + uMorph.x * 7.3 + uSeed), fbmS(qs * 1.2 - uMorph.x * 5.1 + uSeed)) - 0.484;
  vec2 kB = vec2(fbmS(qs * 1.2 + uMorph.y * 7.3 + uSeed), fbmS(qs * 1.2 - uMorph.y * 5.1 + uSeed)) - 0.484;
  vec2 uv = (qs + warp * 0.38 + mix(kA, kB, uMorphMix) * 0.16) * 0.5 + 0.5;
  uv.y = 1.0 - uv.y;
  float d = texture2D(uSdf, uv).r - 0.5;
  float px = 2.0 / uSide, pxu = 1.0 / uSide;   // A: kept at 1 px; 1.5 drew a pale rim off the 8-bit field (a halo, STANDING 3)
  float bA = 1.0 - smoothstep(-pxu, pxu, d);
  vec3 col = uFill;
  float band = smoothstep(0.55, 0.8, fbm(uv * 2.4 + vec2(uTime * 0.22, -uTime * 0.17)));
  col = mix(col, min(col * 1.08 + 0.12, 1.0), band * uFlow * 0.7);
  float below = smoothstep(0.1, -0.55, q.y);
  vec3 tint = mix(uTintL, uTintR, smoothstep(-0.8, 0.8, q.x));
  vec3 lit = 1.0 - (1.0 - col) * (1.0 - tint);
  col = mix(col, mix(lit, tint, 0.6), clamp(uTintK * below, 0.0, 1.0));
  // A · CRITIC-1104 §5, from the 31 Oct master (a matte clay body: soft light top left, a darker underside; no outline,
  // no glow, no halo, STANDING 3): white at 30% centred 32% / 26% into the body, gone by 55%; the bottom 35% eases 14%
  // darker (the master's #13AEF8 -> #0E93D6 step)
  float hl = 1.0 - smoothstep(0.0, 1.1, length(q - vec2(-0.36, 0.48)));
  col = mix(col, vec3(1.0), 0.30 * hl);
  col *= mix(1.0, 0.86, smoothstep(-0.3, -1.0, q.y));
  vec2 e = q - uLook;
  float eye = 1e3;
  for (int i = 0; i < 2; i++) {
    vec2 c = vec2(i == 0 ? -uEyeG.x : uEyeG.x, uEyeG.y);
    vec2 pe = e - c;
    float ct = cos(uTilt), st = sin(uTilt); pe = mat2(ct, st, -st, ct) * pe;
    eye = min(eye, eyeShape(pe, i == 0 ? uOpen.x : uOpen.y, uEyeG.z, uEyeG.w, uPort, uHappy));   // eyes.ts
  }
  float eA = (1.0 - smoothstep(-px, px, eye)) * bA;
  gl_FragColor = vec4(mix(col, ${EYE_RGB}, eA) * bA, bA);
}`;
function bez(x1, y1, x2, y2) {
    return (x) => { let u = x; for (let n = 0; n < 8; n++) {
        const ex = 3 * x1 * u * (1 - u) ** 2 + 3 * x2 * u * u * (1 - u) + u ** 3 - x, dx = 3 * x1 * (1 - u) ** 2 + 6 * (x2 - x1) * u * (1 - u) + 3 * (1 - x2) * u * u;
        if (Math.abs(dx) < 1e-6)
            break;
        u = Math.min(1, Math.max(0, u - ex / dx));
    } return 3 * y1 * u * (1 - u) ** 2 + 3 * y2 * u * u * (1 - u) + u ** 3; };
}
const ease223 = bez(0.167, 0.167, 0.833, 0.833);
const KT = [0, 1.967, 4, 6, 8, 10];
const BREATH = 0.093;
const T = { blinkShut: 0.067, blinkHeld: 0.033, blinkOpen: 0.067 };
const EH = EYE_HEIGHT;
const ARC_LEN = ARC.x.length / 60;
const BEAT = 60 / 96;
const spring = (resp, zeta) => ({ x: 0, v: 0, w: (2 * Math.PI) / resp, z: zeta });
function stepSpring(s, target, dt) { const a = -s.w * s.w * (s.x - target) - 2 * s.z * s.w * s.v; s.v += a * dt; s.x += s.v * dt; }
function arcAt(st) {
    const f = Math.max(0, Math.min(ARC.x.length - 1.001, st * 60)), i = Math.floor(f), u = f - i, L = (a) => a[i] + (a[i + 1] - a[i]) * u;
    return { x: L(ARC.x), y: L(ARC.y), l: L(ARC.l), r: L(ARC.r), a: L(ARC.a) };
}
function rand(seed = 4242) { let rs = seed; return () => (rs = (rs * 9301 + 49297) % 233280) / 233280; }
const UNIFORMS = ["uSdf", "uRes", "uCenter", "uHalf", "uSide", "uTime", "uSeed", "uBreath", "uRot", "uHappy", "uFlow", "uTilt", "uMorph", "uMorphMix", "uPort", "uTintK", "uFill", "uTintL", "uTintR", "uSquash", "uLook", "uOpen", "uEyeG"];
class Blot {
    constructor(canvas, field, props, rnd = rand()) {
        this.dead = false;
        this.t = 0;
        this.tint = [[0, 0, 0], [0, 0, 0], 0];
        this.lift = spring(0.45, 1);
        this.U = {};
        this.sq = [spring(0.62, 0.32), spring(0.62, 0.32)];
        this.look = [spring(0.3, 0.85), spring(0.3, 0.85)];
        this.happy = spring(0.3, 1);
        this.flow = spring(0.8, 1);
        this.rest = spring(0.6, 1);
        this.open = [1, 1];
        this.blinkAt = -1;
        this.gaze = [0, 0];
        this.pendingGaze = null;
        this.stateAt = 0;
        this.lastBeat = -1;
        this.seq = -1;
        this.bob = 0;
        this.hp = 0;
        this.c = canvas;
        this.rnd = rnd;
        this.o = Object.assign({ seed: 1, state: "idle", music: false, wink: "moment", arcFirst: 2.0, arcEvery: 10, look: [0, 0], size: 0.62, floatAmp: 0.04, eyeScale: 1, still: false }, props);
        this.ph = rnd() * 6.283;
        this.ph2 = rnd() * 6.283;
        this.nextBlink = 1.2 + rnd() * 2.5;
        this.arcStart = this.o.wink === "loop" ? 0 : this.o.arcFirst;
        let gl = null;
        try {
            gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: true });
        }
        catch {
            gl = null;
        }
        if (!gl) {
            this.dead = true;
            return;
        }
        this.gl = gl;
        const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(x) ?? "shader"); return x; };
        try {
            const p = gl.createProgram();
            gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
            gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
            gl.bindAttribLocation(p, 0, "p");
            gl.linkProgram(p);
            gl.useProgram(p);
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, field);
            for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
                gl.texParameteri(gl.TEXTURE_2D, k, v);
            for (const n of UNIFORMS)
                this.U[n] = gl.getUniformLocation(p, n);
        }
        catch {
            this.dead = true;
        }
    }
    setState(s, t) { this.o.state = s; this.stateAt = t; }
    sim(dt) {
        if (this.dead)
            return;
        this.t += dt;
        const t = this.t, o = this.o, st = o.state;
        let seq = -1;
        if (o.wink === "loop")
            seq = t % ARC_LEN;
        else if (o.wink === "moment" && st === "idle" && t >= this.arcStart) {
            seq = t - this.arcStart;
            if (seq >= ARC_LEN) {
                this.arcStart += o.arcEvery;
                seq = -1;
            }
        }
        this.seq = seq;
        stepSpring(this.lift, seq >= 0 && seq < ARC_LEN - 0.9 ? 1 : 0, dt);
        let lookT = [this.gaze[0], this.gaze[1]];
        if (o.music) {
            const bt = t / BEAT, beat = Math.floor(bt), ph = bt - beat, m = 1 - this.lift.x;
            if (beat !== this.lastBeat) {
                this.lastBeat = beat;
                this.sq[0].v += 1.1 * m;
            }
            this.bob = Math.pow(Math.sin(Math.PI * ph), 2) * m;
            lookT = [o.look[0] * m, o.look[1] * m];
        }
        if (st === "thinking")
            lookT = [0.07 * Math.sin(t * 0.9 + this.ph), 0.08];
        if (st === "happy") {
            const ph = (t / 0.9) % 1;
            this.bob = Math.pow(Math.sin(Math.PI * ph), 2);
            if (ph < this.hp)
                this.sq[1].v += 0.8;
            this.hp = ph;
        }
        for (let k = 0; k < 2; k++) {
            stepSpring(this.sq[k], 0, dt);
            stepSpring(this.look[k], lookT[k], dt);
        }
        const since = t - this.stateAt;
        const barHappy = o.music && this.lift.x < 0.1 && Math.floor(t / BEAT) % 8 === 4;
        stepSpring(this.happy, st === "happy" || (st === "done" && since < 0.9) || barHappy ? 1 : 0, dt);
        stepSpring(this.flow, st === "thinking" ? 1 : 0, dt);
        stepSpring(this.rest, st === "done" ? 1 : 0, dt);
        if (seq < 0 && t >= this.nextBlink && this.happy.x < 0.2) {
            this.blinkAt = t;
            this.nextBlink = t + 2.5 + this.rnd() * 3;
            if (st === "idle" && !o.music)
                this.pendingGaze = this.rnd() < 0.4 ? [0, 0] : [(this.rnd() - 0.5) * 0.2, (this.rnd() - 0.4) * 0.1];
        }
        const s = this.blinkAt < 0 ? 1 : t - this.blinkAt, shut = T.blinkShut, hd = shut + T.blinkHeld, op = hd + T.blinkOpen;
        const ob = s < shut ? 1 - s / shut : s < hd ? 0 : s < op ? (s - hd) / T.blinkOpen : 1;
        if (s >= shut && this.pendingGaze) {
            this.gaze = this.pendingGaze;
            this.pendingGaze = null;
        }
        this.open = [ob, ob];
    }
    draw() {
        if (this.dead)
            return;
        const gl = this.gl, c = this.c, o = this.o, t = this.t, still = o.still;
        const dpr = Math.min(devicePixelRatio || 1, 2), w = Math.round(c.clientWidth * dpr), h = Math.round(c.clientHeight * dpr);
        if (!w || !h)
            return;
        if (c.width !== w || c.height !== h) {
            c.width = w;
            c.height = h;
        }
        const side = Math.min(w, h) * o.size, A = still ? 0 : side * o.floatAmp;
        const pos = [A * Math.sin(t * 0.31 * 2.25 + this.ph), A * 0.8 * Math.cos(t * 0.23 * 2.25 + this.ph2) - this.bob * side * (o.music ? 0.035 : 0.05)];
        gl.viewport(0, 0, w, h);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const U = this.U;
        gl.uniform2f(U.uRes, w, h);
        gl.uniform1i(U.uSdf, 0);
        gl.uniform2f(U.uCenter, w / 2 + pos[0], h / 2 - pos[1]);
        gl.uniform1f(U.uHalf, side * 0.78);
        gl.uniform1f(U.uSide, side);
        const br = still ? 0 : BREATH * (0.6 * Math.sin((t * 6.2832) / 3.9 + this.ph) + 0.4 * Math.sin((t * 6.2832) / 6.1 + this.ph2)) * (1 - 0.6 * this.rest.x);
        gl.uniform1f(U.uTime, t);
        gl.uniform1f(U.uSeed, o.seed);
        gl.uniform1f(U.uBreath, br);
        const sway = o.music ? 0.07 * Math.sin((Math.PI * t) / BEAT) * (1 - this.lift.x) : 0;
        gl.uniform1f(U.uRot, still ? 0 : 0.045 * Math.sin((t * 6.2832) / 14 + this.ph) + sway);
        gl.uniform2f(U.uSquash, this.sq[0].x * 0.12, this.sq[1].x * 0.12);
        const es = o.eyeScale;
        let lx = this.look[0].x, ly = this.look[1].x, tilt = -lx * 1.6, open = this.open, port = 0;
        if (this.seq >= 0) {
            const a = arcAt(this.seq);
            lx += a.x * EH * es;
            ly += a.y * EH * es;
            tilt = a.a;
            open = [a.l, a.r];
            port = 1;
        }
        gl.uniform2f(U.uLook, lx, ly);
        gl.uniform1f(U.uTilt, tilt);
        gl.uniform2f(U.uOpen, open[0], open[1]);
        gl.uniform1f(U.uPort, port);
        gl.uniform1f(U.uHappy, Math.max(0, Math.min(1, this.happy.x)));
        gl.uniform1f(U.uFlow, Math.max(0, this.flow.x));
        gl.uniform4f(U.uEyeG, EYE.x * es, EYE.y, EYE.r * es, EYE.w * es);
        gl.uniform3fv(U.uFill, hex(o.fill || SEED_HEX(o.seed)));
        gl.uniform3fv(U.uTintL, this.tint[0]);
        gl.uniform3fv(U.uTintR, this.tint[1]);
        gl.uniform1f(U.uTintK, this.tint[2]);
        const mt = t % 10;
        let k = 0;
        while (k < 4 && mt >= KT[k + 1])
            k++;
        gl.uniform2f(U.uMorph, k, (k + 1) % 5);
        gl.uniform1f(U.uMorphMix, ease223((mt - KT[k]) / (KT[k + 1] - KT[k])));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    dispose() { if (!this.dead)
        this.gl.getExtension("WEBGL_lose_context")?.loseContext(); this.dead = true; }
}
function runScene(host, blots, tick, still) {
    let t = 0, raf = 0, last = null, visible = true, stopped = false;
    const step = (dt) => {
        const n = Math.max(1, Math.ceil(dt / (1 / 240)));
        for (let i = 0; i < n; i++) {
            t += dt / n;
            blots.forEach((b) => b.sim(dt / n));
        }
        tick(t, dt);
        blots.forEach((b) => b.draw());
    };
    if (still) {
        step(1 / 60);
        const redraw = () => blots.forEach((b) => b.draw());
        addEventListener("resize", redraw);
        return () => { removeEventListener("resize", redraw); blots.forEach((b) => b.dispose()); };
    }
    const w = window;
    const frame = (now) => {
        raf = 0;
        if (stopped || !visible || document.hidden) {
            last = null;
            return;
        }
        const dt = last === null ? 1 / 60 : Math.min(0.05, (now - last) / 1000);
        const c0 = performance.now();
        step(dt);
        if (Array.isArray(w.__blotFrames) && last !== null)
            w.__blotFrames.push({ dt: now - last, cpu: performance.now() - c0 });
        last = now;
        raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf && !stopped && visible && !document.hidden)
        raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; wake(); });
    io.observe(host);
    document.addEventListener("visibilitychange", wake);
    wake();
    return () => { stopped = true; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", wake); blots.forEach((b) => b.dispose()); };
}
const PALETTE = [COLOURS.v1.sky0, COLOURS.v1.sky1, ...Object.values(COLOURS.accents)];
function blotPath() {
    const n = 10, h = [2, 3, 4].map(k => [k, Math.random() * 0.14, Math.random() * Math.PI * 2]);
    const pts = Array.from({ length: n }, (_, i) => {
        const t = (2 * Math.PI * i) / n, r = 5 * (1 + h.reduce((s, [k, a, p]) => s + a * Math.cos(k * t + p), 0));
        return [r * Math.cos(t), r * Math.sin(t)];
    });
    const p = new Path2D();
    p.moveTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < n; i++) {
        const [p0, p1, p2, p3] = [pts[(i + n - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
        p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    p.closePath();
    return p;
}
const SHOTS = [
    { share: 0.25, spread: 26, startVelocity: 55 },
    { share: 0.2, spread: 60 },
    { share: 0.35, spread: 100, decay: 0.91, scalar: 0.8 },
    { share: 0.1, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 },
    { share: 0.1, spread: 120, startVelocity: 45 },
];
function burst({ host, scale = 1, count = 200, originX = 0.5, originY = 0.7, now = () => performance.now() } = {}) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
        return () => { };
    const canvas = document.createElement("canvas");
    canvas.className = "cf-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        canvas.remove();
        return () => { };
    }
    const box = host.getBoundingClientRect(), w = box.width / scale, h = box.height / scale, dpr = Math.min(devicePixelRatio || 1, 2) * scale;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pieces = [];
    for (const s of SHOTS) {
        const v = s.startVelocity ?? 45, spread = (s.spread * Math.PI) / 180;
        for (let i = 0; i < Math.floor(count * s.share); i++)
            pieces.push({
                x: w * originX, y: h * originY,
                velocity: v * 0.5 + Math.random() * v,
                angle: -Math.PI / 2 + (0.5 * spread - Math.random() * spread),
                decay: s.decay ?? 0.9, gravity: 3, scalar: s.scalar ?? 1,
                wobble: Math.random() * 10, wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
                tilt: (Math.random() * 0.5 + 0.25) * Math.PI, tick: 0, ticks: 200,
                colour: PALETTE[Math.floor(Math.random() * PALETTE.length)], path: blotPath(),
            });
    }
    const step = (p) => {
        p.x += Math.cos(p.angle) * p.velocity;
        p.y += Math.sin(p.angle) * p.velocity + p.gravity;
        p.velocity *= p.decay;
        p.wobble += p.wobbleSpeed;
        p.tilt += 0.1;
        p.tick++;
    };
    const draw = (p) => {
        const sx = Math.abs(Math.cos(p.wobble)) * p.scalar + 0.08, sy = Math.abs(Math.sin(p.wobble)) * p.scalar + 0.08;
        const rot = (Math.PI / 10) * p.wobble, c = Math.cos(rot), s = Math.sin(rot);
        ctx.setTransform(dpr * c * sx, dpr * s * sx, -dpr * s * sy, dpr * c * sy, dpr * p.x, dpr * p.y);
        ctx.globalAlpha = 1 - p.tick / p.ticks;
        ctx.fillStyle = p.colour;
        ctx.fill(p.path);
    };
    const t0 = now();
    let ticks = 0, raf = 0;
    const frame = () => {
        const due = Math.floor(((now() - t0) / 1000) * 60);
        while (ticks < due) {
            pieces.forEach(step);
            ticks++;
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let live = 0;
        for (const p of pieces)
            if (p.tick < p.ticks && p.y < h + 40) {
                draw(p);
                live++;
            }
        if (live)
            raf = requestAnimationFrame(frame);
        else
            canvas.remove();
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); canvas.remove(); };
}

window.L4Blot={Blot,blotField,rand,runScene,SPLASH_FILL,EYE_SCALE,BLOT_PATH,EYE_SVG_RECTS,burst};
})();
