function handleChangeUrlEvent(event) {
    const requestedSite = event.data.mmUrl.replace(/\/$/, "");

    if (!requestedSite) {
        console.error('Could not get the requested site');
        return;
    }

    // Update the mmUrl
    chrome.storage.sync.set({mmUrl: requestedSite});

    // Send message to background.js
    chrome.runtime.sendMessage({ action: 'ChangeUrl' });
}

window.addEventListener("message", (event) => {
    chrome.storage.sync.get(['mmUrl'], result =>  {
        const mediaManagerUrl = result.mmUrl;

        const isCurrentSite = event.origin === mediaManagerUrl;

        if (isCurrentSite && event?.data?.messageType === 'ChangeUrl') {
            handleChangeUrlEvent(event);
        }
    });
});