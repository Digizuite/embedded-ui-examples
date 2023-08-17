const ChangeUrlMessage = "ChangeUrl";

window.addEventListener("message", event => {
    if (event?.data?.messageType === ChangeUrlMessage) {
        const receivedData = event.data;
        chrome.runtime.sendMessage({
            action: ChangeUrlMessage,
            data: {
                requestedSite: receivedData.mmUrl.replace(/\/$/, ""),
                origin: event.origin,
            }
        });
    }
});