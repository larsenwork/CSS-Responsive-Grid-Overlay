const TOGGLE_MAP = {
    'on': 'add',
    'off': 'remove'
}
let toggle;

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
                code: `document.documentElement.classList.${TOGGLE_MAP[toggle]}('momo-grid');`
            });
        }
    });
};

chrome.browserAction.onClicked.addListener(() => updateGrid(true));
chrome.tabs.onUpdated.addListener(() => updateGrid());
chrome.runtime.getURL('images/filters.svg');
