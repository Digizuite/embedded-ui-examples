const mmUrlInput = document.getElementById('mmUrl');
const mediaFormatIdInput = document.getElementById('mediaFormatId');
const publicDestinationInput = document.getElementById('publicDestination');
const cdnUrlInput = document.getElementById('cdnUrl');
const onlyAssetIdInput = document.getElementById('onlyAssetId');

const form = document.getElementById('form');
const successfulDiv = document.getElementById('successful');

// Containers
const mmUrlContainer = document.getElementById('mmUrlContainer');
const mediaFormatIdContainer = document.getElementById('mediaFormatIdContainer');
const publicDestinationContainer = document.getElementById('publicDestinationContainer');
const cdnUrlContainer = document.getElementById('cdnUrlContainer');
const onlyAssetIdContainer = document.getElementById('onlyAssetIdContainer');

// Restores select box and checkbox state using the preferences stored in chrome.storage.
async function restoreOptions() {
    successfulDiv.hidden = true;

    const result = await getStorageValues(['mmUrl', 'onlyAssetId', 'mediaFormatId', 'publicDestination', 'cdnUrl']);

    mmUrlInput.value = result.mmUrl ?? '';
    mediaFormatIdInput.value = result.mediaFormatId ?? '';
    publicDestinationInput.value = result.publicDestination ?? '';
    cdnUrlInput.value = result.cdnUrl ?? '';
    onlyAssetIdInput.checked = result.onlyAssetId ?? false;

    if (result.mmUrl) {
        await validateCurrentProductVersion(result.mmUrl);
    }
}

async function saveOptions(event) {
    event.preventDefault();

    const enteredMmUrl = mmUrlInput.value.replace(/\/$/, "");

    const result = await getStorageValues(['mmUrl']);
    const storedMmUrl = result.mmUrl ?? '';

    if (enteredMmUrl !== storedMmUrl) {
        const isValid = await validateCurrentProductVersion(enteredMmUrl);

        if (isValid) {
            updateOptions(enteredMmUrl)
        } else {
            console.error('Failed to update options')
        }
    } else {
        updateOptions(enteredMmUrl)
    }
}

function updateOptions(url) {
    chrome.storage.sync.set({
        mmUrl: url,
        onlyAssetId: onlyAssetIdInput.checked,
        mediaFormatId: mediaFormatIdInput.value,
        publicDestination: publicDestinationInput.value,
        cdnUrl: cdnUrlInput.value
    });

    const successful = successfulDiv;
    successful.hidden = false;

    setTimeout(() => {
        successful.hidden = true;
    }, 3000);
}

async function validateCurrentProductVersion(url) {
    try {
        const version = await getReleaseVersion(url);

        // Split the version into major, minor, and patch components
        const [major, minor, patch] = version.split('.').map(Number);

        if (major < 5 || (major === 5 && minor < 8)) {
            publicDestinationContainer.style.display = "flex";
            cdnUrlContainer.style.display = "flex";
            onlyAssetIdContainer.style.display = "flex";
        } else {
            publicDestinationContainer.style.display = "none";
            cdnUrlContainer.style.display = "none";
            onlyAssetIdContainer.style.display = "none";
        }

        return true;

    }
    catch (error) {
        console.error("Failed to validate current product version", error);
        mmUrlInput.setCustomValidity("An error occurred. Either the provided url is invalid or the site is unresponsive.");
        form.reportValidity();
        return false;
    }
}

async function getReleaseVersion(url) {
    if (url === 'http://localhost:4210') {
        return;
    }

    try {
        const response = await fetchWithTimeout(url + '/api/config', {
            timeout: 10000,
        });

        if (!response.ok) {
            console.error('Failed to get release version', response.status, response.statusText);
            throw new Error(message);
        }

        const data = await response.json();

        const version = data.productVersion.split('-')[0];

        console.log('Current release version', version);

        return version;
    } catch (error) {
        console.error('Fetch error', error);
        throw error;
    }
}

function fetchWithTimeout(input, options) {
    const { timeout = 10000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return fetch(input, {
        ...options,
        signal: controller.signal,
    }).then(response => {
        clearTimeout(id);

        return response;
    });
}

async function getStorageValues(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (result) => {
            resolve(result);
        });
    });

}

// Disable extra options by default
publicDestinationContainer.style.display = "none";
cdnUrlContainer.style.display = "none";
onlyAssetIdContainer.style.display = "none";

mmUrlInput.addEventListener('input', () => mmUrlInput.setCustomValidity(''));

document.addEventListener('DOMContentLoaded', restoreOptions);

form.addEventListener('submit', saveOptions);