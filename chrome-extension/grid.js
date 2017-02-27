const STATES = ['off', 'grid', 'protanopia', 'deuteranopia'];
const STATES_INDEX_MAX = STATES.length - 1;
const GRID_CLASS = 'g-grid';
const FILTER_CLASS = 'g-filter';
const GRID_ID = 'g-grid';
const GRID = `<div id="${GRID_ID}"></div>`;
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
  code = `if (!document.getElementById('${GRID_ID}')) document.body.innerHTML += '${GRID}';
          if (!document.getElementById('${FILTER_ID}')) document.body.innerHTML += '${FILTERS}';
          document.documentElement.style.setProperty('--document-height', document.body.scrollHeight + 'px');`;

  // Toggle Grid
  if (currentState === 'grid') {
    code += `document.getElementById('${GRID_ID}').classList.add('${GRID_CLASS}');`;
  } else {
    code += `document.getElementById('${GRID_ID}').classList.remove('${GRID_CLASS}');`;
  }

  // Toggle Color Vision Filters
  if (currentState === 'protanopia' || currentState === 'deuteranopia') {
    code += `document.documentElement.style.setProperty('--g-help-text', '"${currentState}"');
         document.documentElement.style.setProperty('--g-color-vision-url', 'url("#${currentState}")');
         document.getElementById('${GRID_ID}').classList.add('${FILTER_CLASS}');`;
  } else {
    code += `document.documentElement.style.removeProperty('--g-help-text');
         document.documentElement.style.removeProperty('--g-color-vision-url');
         document.getElementById('${GRID_ID}').classList.remove('${FILTER_CLASS}');`;
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
