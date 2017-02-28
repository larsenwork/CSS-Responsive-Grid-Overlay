const STATES = ['off', 'grid', 'protanopia', 'deuteranopia'];
const STATES_INDEX_MAX = STATES.length - 1;
const GRID_CLASS = 'g-grid';
const FILTER_CLASS = 'g-filter';
const OVERLAY_ID = 'g-overlay';
const OVERLAY = `<div id="${OVERLAY_ID}"></div>`;
const FILTER_ID = 'g-filter';
const FILTERS = `<svg id="${FILTER_ID}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="protanopia"><feColorMatrix in="SourceGraphic" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="deuteranopia"><feColorMatrix in="SourceGraphic" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"/></filter></defs></svg>`;

let statesIndex = 0;
let code = '';
let currentState = 'off';
let tab = {};

function updateGrid(click = false) {
  // State Handling
  if (click) {
    statesIndex < STATES_INDEX_MAX ? statesIndex += 1 : statesIndex = 0;
  }
  currentState = STATES[statesIndex];

  // Default Settings
  code = `if (!document.getElementById('${OVERLAY_ID}')) document.body.innerHTML += '${OVERLAY}';
          if (!document.getElementById('${FILTER_ID}')) document.body.innerHTML += '${FILTERS}';`;

  // Toggle Grid
  if (currentState === 'grid') {
    code += `document.body.classList.add('${GRID_CLASS}');`;
  } else {
    code += `document.body.classList.remove('${GRID_CLASS}');`;
  }

  // Toggle Color Vision Filters
  if (currentState === 'protanopia' || currentState === 'deuteranopia') {
    code += `document.body.classList.add('${FILTER_CLASS}');
             document.documentElement.style.setProperty('--g-help-text', '"${currentState}"');
             document.documentElement.style.setProperty('--g-color-vision-url', 'url("#${currentState}")');`;
  } else {
    code += `document.body.classList.remove('${FILTER_CLASS}');
             document.documentElement.style.removeProperty('--g-help-text');
             document.documentElement.style.removeProperty('--g-color-vision-url');`;
  }

  // Update Icon
  chrome.browserAction.setIcon({
    path: {
      16: `images/icon16-${currentState}.png`,
      24: `images/icon24-${currentState}.png`,
      32: `images/icon32-${currentState}.png`,
    },
  });

  // Run Code
  chrome.tabs.query({}, (tabs) => {
    for (tab of tabs) {
      chrome.tabs.executeScript(tab.id, {
        code,
      });
    }
  });
}

chrome.browserAction.onClicked.addListener(() => updateGrid(true));
chrome.tabs.onUpdated.addListener(() => updateGrid());
updateGrid();
