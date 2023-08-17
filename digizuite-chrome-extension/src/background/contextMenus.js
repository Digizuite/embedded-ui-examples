import { openWindow } from "./openWindow.js";
import { openSettings } from "../utility/options.js";

const contextMenusIds = {
    openExtension: 'openExtension',
    openOptions: 'openOptions',
}

/**
 * Create context menu for when the user right-clicks on a page or the extension
 */
export function createMenu() {
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

chrome.contextMenus.onClicked.addListener(event => {
    const menuItemId = event.menuItemId;

    if (menuItemId === contextMenusIds.openExtension) {
        openWindow();
    }

    if (menuItemId === contextMenusIds.openOptions) {
        openSettings();
    }
});

