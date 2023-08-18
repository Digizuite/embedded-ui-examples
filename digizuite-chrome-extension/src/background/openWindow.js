import { openSettings } from "../utility/options.js";

let currentWindowId = 0;

export function openWindow() {
    focusIfExists(() => {
        chrome.storage.sync.get(['mmUrl'], response => {
            const mediaManagerUrl = response.mmUrl;
            if (!mediaManagerUrl) {
                openSettings();
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

export function closeWindow() {
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