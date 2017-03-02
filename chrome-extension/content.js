const GRID_CLASS = 'g-grid';
const FILTER_CLASS = 'g-filter';
const OVERLAY_ID = 'g-overlay';
const OVERLAY = `<div id="${OVERLAY_ID}"></div>`;
const FILTER_ID = 'g-filter';
const FILTERS = `<svg id="${FILTER_ID}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="protanopia"><feColorMatrix in="SourceGraphic" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"/></filter><filter id="deuteranopia"><feColorMatrix in="SourceGraphic" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"/></filter></defs></svg>`;
const STYLE_VARIABLE_TEXT = '--g-help-text';
const STYLE_VARIABLE_COLOR = '--g-color-vision-url'

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    const CURRENT_STATE = request.currentState;

    // Add default element to page if they don't already exist
    if (!document.getElementById(OVERLAY_ID)) document.body.innerHTML += OVERLAY;
    if (!document.getElementById(FILTER_ID)) document.body.innerHTML += FILTERS;

    // Toogle grid
    if (CURRENT_STATE === 'grid') {
        document.body.classList.add(GRID_CLASS);
    } else {
        document.body.classList.remove(GRID_CLASS);
    }

    // Toggle color vision filters
    if (CURRENT_STATE === 'protanopia' || CURRENT_STATE === 'deuteranopia') {
        document.body.classList.add(FILTER_CLASS);
        document.documentElement.style.setProperty(STYLE_VARIABLE_TEXT, `"${CURRENT_STATE}"`);
        document.documentElement.style.setProperty(STYLE_VARIABLE_COLOR, `url("#${CURRENT_STATE}")`);;
    } else {
        document.body.classList.remove(FILTER_CLASS);
        document.documentElement.style.removeProperty(STYLE_VARIABLE_TEXT);
        document.documentElement.style.removeProperty(STYLE_VARIABLE_COLOR);
    }
  }
);
