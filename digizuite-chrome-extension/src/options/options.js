// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restoreOptions() {
    document.getElementById('successful').hidden = true;

    chrome.storage.sync.get([ 'mmUrl', 'onlyAssetId', 'mediaFormatId', 'publicDestination', 'cdnUrl'], (result) => {
        document.getElementById('mmUrl').value = result.mmUrl ?? '';
        document.getElementById('mediaFormatId').value = result.mediaFormatId ?? '';
        document.getElementById('publicDestination').value = result.publicDestination ?? '';
        document.getElementById('cdnUrl').value = result.cdnUrl ?? '';
        document.getElementById('onlyAssetId').checked = result.onlyAssetId;
    });
}

function saveOptions() {
    const mmUrl = document.getElementById('mmUrl').value.replace(/\/$/, "");
    const onlyAssetId = document.getElementById('onlyAssetId').checked;
    const mediaFormatId = document.getElementById('mediaFormatId').value;
    const publicDestination = document.getElementById('publicDestination').value;
    const cdnUrl = document.getElementById('cdnUrl').value;

    chrome.storage.sync.set({
        mmUrl,
        onlyAssetId,
        mediaFormatId,
        publicDestination,
        cdnUrl
    });

    const successful = document.getElementById('successful');
    successful.hidden = false;

    setTimeout(() => {
        successful.hidden = true;
    }, 3000);
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('save-btn').addEventListener('click', saveOptions);