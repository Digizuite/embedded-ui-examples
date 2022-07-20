(function () {
  const oldIframe = document.getElementById('browser-extension-container');

  if (oldIframe) {
    oldIframe.remove();
    return;
  }

  chrome.storage.sync.get(['mmUrl', 'onlyAssetId'], function(result) {
    var mediaManagerUrl = result.mmUrl;

    var container = document.createElement('div');
    container.className = 'browser-extension-container';
    container.id = 'browser-extension-container';
    container.style.background = 'white';
    container.style.height = '100%';
    container.style.width = '400px';
    container.style.position = 'fixed';
    container.style.top = '0px';
    container.style.right = '0px';
    container.style.zIndex = '99999';
    container.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';

    if(!mediaManagerUrl) {      
      container.innerHTML = '<div class="go-to-options-container"> <div class="baseUrl-container"> <div class="baseUrl-header"> <p>Digizuite Chrome Extension</p> </div> <div class="baseUrl-form"> <div class="baseUrl-icon-wrapper"> <div class="baseUrl-icon"> <i class="icon-link"></i> </div> <p>You have not configured your extension yet. Please click below to go to options.</p> </div> </div> <div class="baseUr-wrapper"> <button id="go-to-options-button" class="base-submit-button">Go to options</button> <br> </div> </div> </div>';
    } else {
      
      const iframe = document.createElement('iframe');
      iframe.id = 'dziframe';
      iframe.style.width = '400px';
      iframe.style.height = '100%';
      iframe.src = `${mediaManagerUrl}/embedded`;
      container.appendChild(iframe);

      // Add event listener
      window.addEventListener("message", (event) => {
        if(event.origin === mediaManagerUrl && event?.data?.messageType === "AssetMessage") {
            // If you need to make the asset url public, then this is where you would need to remove
            // access key and use a different destination
    
            // Coyping traditional download url
            var copyString = event.data.asset.downloadUrl;
            if(result.onlyAssetId) {
              copyString = event.data.asset.assetId;
            } else {

            }
            navigator.clipboard.writeText(copyString).then(function() {
              console.log("Async: Copying to clipboard was successful!");
      
              // Do you wish to download instead then use 
              // downloadFile(event.data.asset.downloadUrl)
          }, function(err) {
              console.error('Async: Could not copy text: ', err);
          });
        }
      });
 
    }

    document.body.appendChild(container);

    if(!mediaManagerUrl) {
      // creating the botton
      document.querySelector('#go-to-options-button').addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
      });
    }

  });

})();
