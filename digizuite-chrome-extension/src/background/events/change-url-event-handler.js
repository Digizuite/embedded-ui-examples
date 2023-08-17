import { closeWindow, openWindow } from "../openWindow.js";

export function changeUrlEventHandler(data) {
    chrome.storage.sync.get(['mmUrl'], result =>  {
        const mediaManagerUrl = result.mmUrl;

        const isCurrentSite = data.origin === mediaManagerUrl;
        if (isCurrentSite) {
            // Update the mmUrl
            chrome.storage.sync.set({mmUrl: data.requestedSite});

            // Close the current window and open a new one with the new url
            closeWindow();
            openWindow();
        }
    });
}