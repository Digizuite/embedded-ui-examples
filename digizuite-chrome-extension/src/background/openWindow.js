import { openSettings } from "../utility/options.js";

let currentWindowId = 0;

export function openWindow() {
    focusIfExists(() => {
        chrome.storage.sync.get(['mmUrl', 'mediaFormatId'], response => {
            const mediaManagerUrl = response.mmUrl;
            if (!mediaManagerUrl) {
                openSettings();
                return;
            }

            let url = `${mediaManagerUrl}/embedded?behaviourOverwrite=CopyUrl&enableMultiInsert=false`;
            if (response.mediaFormatId) {
                url = `${url}&insertQuality=${response.mediaFormatId}`;
            }

            const customOptions = { left: 0, top: 0, width: 650, height: 800 };
            chrome.windows.create({
                type: 'popup',
                ...customOptions,
                url,
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