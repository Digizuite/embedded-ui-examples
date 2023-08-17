const MessageTypes = {
    ChangeUrl: "ChangeUrl",
    AssetMessage: "AssetMessage"
}

/**
 * Little hack for optimizely experimentation
 * @param {string} assetId
 */
function handleExperimentation(assetId) {
    // First we need to identify the edit json button and click it
    const buttons = document.getElementsByTagName("button");
    const identifiedButton = returnIdentifiedElement(buttons, 'Edit JSON');

    if(identifiedButton) {
        identifiedButton.click();

        // Then we need to find the JSON code text area
        const labels = document.getElementsByTagName("label");
        const identifiedLabel = returnIdentifiedElement(labels, 'JSON Code');

        if(identifiedLabel) {
            const jsonText = identifiedLabel.parentElement.getElementsByTagName("textarea")[0];

            const jsonValue = JSON.parse(jsonText.value);
            jsonValue.form_schema[0].default_value = assetId;
            jsonText.value = JSON.stringify(jsonValue);

            // Save
            setTimeout(function() {
                const saveButtons = document.getElementsByTagName("button");
                let identifiedSaveButton = undefined;
                for (let i = 0; i < saveButtons.length; i++) {
                    if (saveButtons[i].textContent.includes('Save')) {
                        identifiedSaveButton = saveButtons[i];
                    }
                }
                identifiedSaveButton.click();
            }, 100);
        }
    }
}

function returnIdentifiedElement(elements, searchText) {
    let identifiedElement = undefined;
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent.includes(searchText)) {
            identifiedElement = elements[i];
            break;
        }
    }

    return identifiedElement;
}

function replaceCdn(urlString, cdnUrl) {
    let assetUrl = new URL(urlString);
    const urlParams = assetUrl.searchParams;

    const newParams = new URLSearchParams();
    urlParams.forEach((value, key) => {
        newParams.append(key.toLowerCase(), value);
    });

    if(cdnUrl && cdnUrl.length > 0) {
        const newCdnAssetUrl = new URL('', cdnUrl);
        newCdnAssetUrl.pathname = assetUrl.pathname.replace('//', '/');
        assetUrl = newCdnAssetUrl;
    }

    newParams.delete('accesskey');
    newParams.delete('assetoutputident');
    newParams.delete('cachebust');
    newParams.delete('downloadname');

    assetUrl.search = newParams.toString();

    return assetUrl.toString();
}

function handleDestinationAndAccessKey(urlString, destinationId, mediaFormatId, cdnUrl) {
    // if no destination then just return URL
    let assetUrl = new URL(urlString);
    const urlParams = assetUrl.searchParams;
    if (!destinationId) {
        return urlParams;
    }

    const newParams = new URLSearchParams();
    urlParams.forEach((value, key) => {
        newParams.append(key.toLowerCase(), value);
    });

    newParams.set('destinationid', destinationId);
    newParams.delete('accesskey');
    newParams.delete('assetoutputident');
    newParams.delete('cachebust');
    newParams.delete('downloadname');

    if(mediaFormatId && mediaFormatId.length > 0) {
        newParams.set('mediaformatid', mediaFormatId);
    }
    newParams.set('lastmodified', new Date().getTime().toString());

    if(cdnUrl && cdnUrl.length > 0) {
        const newCdnAssetUrl = new URL('', cdnUrl);
        newCdnAssetUrl.pathname = assetUrl.pathname.replace('//', '/');
        assetUrl = newCdnAssetUrl;
    }

    assetUrl.search = newParams.toString();

    return assetUrl.toString().toLowerCase();
}

window.addEventListener("message", (event) => {
    chrome.storage.sync.get([ 'mmUrl', 'onlyAssetId', 'mediaFormatId', 'publicDestination', 'cdnUrl'], result =>  {
        const mediaManagerUrl = result.mmUrl;
        const onlyAssetId = result.onlyAssetId;
        const mediaFormatId = result.mediaFormatId;
        const publicDestination = result.publicDestination;
        const cdnUrl = result.cdnUrl;

        const isCurrentSite = event.origin === mediaManagerUrl;

        if (isCurrentSite && event?.data?.messageType === MessageTypes.ChangeUrl) {
            const requestedSite = event?.data?.mmUrl?.replace(/\/$/, "");

            if (!requestedSite) {
                console.error('Could not get the requested site');
                return;
            }

            // Update the mmUrl
            chrome.storage.sync.set({
                mmUrl: requestedSite,
                onlyAssetId,
                publicDestination,
                mediaFormatId,
                cdnUrl
            });

            // Send message to background.js
            chrome.runtime.sendMessage({ action: MessageTypes.ChangeUrl });
        }

        if (isCurrentSite && event?.data?.messageType === MessageTypes.AssetMessage) {
            // If you need to make the asset url public, then this is where you would need to remove
            // access key and use a different destination

            let asset = event.data.asset;
            if(event.data.assets && event.data.assets.length > 0) {
                asset = event.data.assets[0];
            }

            // Copying traditional download url
            let copyString = asset.downloadUrl;
            if(result.onlyAssetId) {
                copyString = asset.assetId;
            } else if(publicDestination && publicDestination.length > 0) {
                // Replacing access key and stuff
                copyString = handleDestinationAndAccessKey(copyString, publicDestination, mediaFormatId, cdnUrl);
            } else if(cdnUrl && cdnUrl.length > 0) {
                copyString = replaceCdn(copyString, cdnUrl);
            }

            navigator.clipboard.writeText(copyString)
                .then(() => {
                    console.log("Async: Copying to clipboard was successful!");

                    // Check if we are in an experimentation environment
                    if (window.location.toString().includes('app.optimizely') &&
                        window.location.toString().includes('extensions')) {
                        handleExperimentation(asset.assetId);
                    }

                    // If you want to download instead, use this:
                    // downloadFile(event.data.asset.downloadUrl)
                })
                .catch(error => {
                    console.error('Async: Could not copy text: ', error);
                });
        }
    });
});