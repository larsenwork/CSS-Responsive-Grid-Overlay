const STATES = ['off', 'grid', 'protanopia', 'deuteranopia'];
const STATES_INDEX_MAX = STATES.length - 1;

let statesIndex = 0;
let currentState = 'off';

function updateGrid(click = false) {
  // State Handling
  if (click) {
    statesIndex < STATES_INDEX_MAX ? statesIndex += 1 : statesIndex = 0;
  }
  currentState = STATES[statesIndex];

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
      chrome.tabs.sendMessage(tab.id, {"currentState": currentState});
    }
  });
}

chrome.browserAction.onClicked.addListener(() => updateGrid(true));
chrome.tabs.onUpdated.addListener(() => updateGrid());
updateGrid();
