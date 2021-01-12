import { JSDOM } from 'jsdom';
const dom = new JSDOM();

// // test specific window size
// global.window.innerWidth = 766;
// global.window.innerHeight = 1440;

global.document = dom.window.document;
let canv = document.createElement('canvas');
canv.id = 'skiCanvas';
global.document.body.appendChild(canv);
