const TOGGLE_MAP = {
    'on': 'add',
    'off': 'remove'
};
const COLOR_VISION = [' ', 'protanopia', 'deuteranopia'];
const GRID_CLASS = 'momo-grid';
const SVG_FILTERS_ID = 'momo-grid-color-filters';
const SVG_FILTERS = `<svg id="${SVG_FILTERS_ID}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="protanopia"><feColorMatrix in="SourceGraphic" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="protanomaly"><feColorMatrix in="SourceGraphic" values="0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="deuteranopia"><feColorMatrix in="SourceGraphic" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="deuteranomaly"><feColorMatrix in="SourceGraphic" values="0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="tritanopia"><feColorMatrix in="SourceGraphic" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="tritanomaly"><feColorMatrix in="SourceGraphic" values="0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="achromatopsia"><feColorMatrix in="SourceGraphic" values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="achromatomaly"><feColorMatrix in="SourceGraphic" values="0.618, 0.320, 0.062, 0, 0 0.163, 0.775, 0.062, 0, 0 0.163, 0.320, 0.516, 0, 0 0, 0, 0, 1, 0"/></filter></defs></svg>`;

let toggle = 'off';
let colorIndex = COLOR_VISION.length;

function updateGrid(click = false) {
    if (click) toggle === 'on' ? toggle = 'off' : toggle = 'on';

    chrome.browserAction.setIcon({ path: {
        '16': `images/icon16-${toggle}.png`,
        '24': `images/icon24-${toggle}.png`,
        '32': `images/icon32-${toggle}.png`
    }});

    chrome.tabs.query({}, tabs => {
        for (tab of tabs) {
            chrome.tabs.executeScript(tab.id, {
                code: `
                    !document.getElementById('${SVG_FILTERS_ID}') ? document.body.innerHTML += '${SVG_FILTERS}' : '';
                    document.documentElement.classList.${TOGGLE_MAP[toggle]}('${GRID_CLASS}');
                    document.documentElement.setAttribute('color-vision', '${COLOR_VISION[colorIndex]}');
                `
            });
        }
    });

    if(click && toggle === 'on') {
        colorIndex < COLOR_VISION.length - 1 ? colorIndex += 1 : colorIndex = 0;
    }
};

chrome.browserAction.onClicked.addListener(() => updateGrid(true));
chrome.tabs.onUpdated.addListener(() => updateGrid());
