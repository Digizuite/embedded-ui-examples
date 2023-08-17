let currentWindowId = 0;

const contextMenusIds = {
    openExtension: 'openExtension',
    openOptions: 'openOptions',
}

createMenu();

chrome.contextMenus.onClicked.addListener(menuClickHandler);

// Event listener for when the user changes the url in the settings
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === 'ChangeUrl') {
       // We have to close the existing window before we can open a new one with the updated URL
       closeWindow();
       openWindow();
   }
});

// When the user clicks the menu item, open the Media Manager
chrome.action.onClicked.addListener(() => {
    openWindow();
});

function openWindow() {
    focusIfExists(() => {
        chrome.storage.sync.get(['mmUrl'], response => {
            const mediaManagerUrl = response.mmUrl;
            if (!mediaManagerUrl) {
                openSetting();
                return;
            }

            const customOptions = { left: 0, top: 0, width: 650, height: 800 };
            chrome.windows.create({
                type: 'popup',
                ...customOptions,
                url: `${mediaManagerUrl}/embedded/`,
            }, window => {
                currentWindowId = window.id;
            });
        });
    });
}

function closeWindow() {
    chrome.windows.remove(currentWindowId);
    currentWindowId = 0;
}

function focusIfExists(callback) {
    chrome.windows.get(currentWindowId, (window) => {
        if (chrome.runtime.lastError || !window) {
            callback();
        } else {
            chrome.windows.update(window.id, { focused: true }, () => {
                if (chrome.runtime.lastError) {
                    callback();
                }
            });
        }
    });
}

// Create context menu for when the user right-clicks on a page or the extension
function createMenu() {
    const menus = [
        {'id': contextMenusIds.openExtension, 'title': 'Open extension', contexts: ['all']},
        {'id': contextMenusIds.openOptions, 'title': 'Open settings', contexts: ['page']},
    ];

    for (const menu of menus) {
        chrome.contextMenus.create({
            id: menu.id,
            title: menu.title,
            contexts: menu.contexts,
        });
    }
}

function menuClickHandler(event) {
    const menuItemId = event.menuItemId;

    if (menuItemId === contextMenusIds.openExtension) {
        openWindow();
    }

    if (menuItemId === contextMenusIds.openOptions) {
        openSetting();
    }
}

function openSetting() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('../options/options.html'));
    }
}