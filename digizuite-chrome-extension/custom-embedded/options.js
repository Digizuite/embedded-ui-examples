// Saves options to chrome.storage
function save_options() {
  var mmUrl = document.getElementById('mmUrl').value.replace(/\/$/, "");;
  var assetId = document.getElementById('onlyAssetId').checked;

  console.log(mmUrl);

  chrome.storage.sync.set({
      mmUrl: mmUrl,
      onlyAssetId: assetId
  });

  chrome.storage.sync.get([ 'mmUrl', 'onlyAssetId'], function(items) {
    console.log(items);
  });

  document.getElementById('successfull').hidden = false;

  setTimeout(() => {
    document.getElementById('successfull').hidden = true;
  }, 3000);
  
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get([ 'mmUrl', 'onlyAssetId'], function(items) {
    console.log(items);
    document.getElementById('mmUrl').value = items.mmUrl;
    document.getElementById('onlyAssetId').checked = items.onlyAssetId;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);