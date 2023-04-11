(function () {
  const oldIframe = document.getElementById('browser-extension-container');

  if (oldIframe) {
    oldIframe.remove();
    return;
  }

  chrome.storage.sync.get([ 'mmUrl', 'onlyAssetId', 'mediaFormatId', 'publicDestination', 'cdnUrl'], function(result) {
    var mediaManagerUrl = result.mmUrl;
    var mediaFormatId = result.mediaFormatId;
    var publicDestination = result.publicDestination;
    var cdnUrl = result.cdnUrl;

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
      iframe.src = `${mediaManagerUrl}/embedded/`;
      container.appendChild(iframe);

      // Add event listener
      window.addEventListener("message", (event) => {
        if(event.origin === mediaManagerUrl && event?.data?.messageType === "AssetMessage") {
            // If you need to make the asset url public, then this is where you would need to remove
            // access key and use a different destination

            var asset = event.data.asset;
            if(event.data.assets && event.data.assets.length > 0) {
                asset = event.data.assets[0];
            }

            // Coyping traditional download url
            var copyString = asset.downloadUrl;
            if(result.onlyAssetId) {
              copyString = asset.assetId;
            } else if(publicDestination && publicDestination.length > 0) {
              // Replacing access key and stuff
              copyString = handleDestinationAndAccessKey(copyString, publicDestination, mediaFormatId, cdnUrl);
            } else if(cdnUrl && cdnUrl.length > 0) {
              copyString = replaceCdn(copyString, cdnUrl);
            }
            navigator.clipboard.writeText(copyString).then(function() {
              console.log("Async: Copying to clipboard was successful!");

              // are we in experimentation?
              if(window.location.toString().includes('app.optimizely') && 
                  window.location.toString().includes('extensions')) {
                 handleExperimentation(asset.assetId);
              }

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

  /**
   * Little hack for optimizely experimentation
   * @param {string} assetId 
   */
  function handleExperimentation(assetId) {
    // First we need to identify the edit json butto and click it
    var buttons = document.getElementsByTagName("button");    
    var identifiedButton = returnIdentifiedElement(buttons, 'Edit JSON');

    if(identifiedButton) {
      identifiedButton.click();
      
      // Then we need to find the JSON code text area
      var labels = document.getElementsByTagName("label");
      var identifiedLabel = returnIdentifiedElement(labels, 'JSON Code');

      if(identifiedLabel) {
        var jsonText = identifiedLabel.parentElement.getElementsByTagName("textarea")[0];

        var jsonValue = JSON.parse(jsonText.value);
        jsonValue.form_schema[0].default_value = assetId;
        jsonText.value = JSON.stringify(jsonValue);

        // Save
        setTimeout(function() {
          var saveButtons = document.getElementsByTagName("button");
          var identifiedSaveButton = undefined;
          for (var i = 0; i < saveButtons.length; i++) {
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
    var identifiedElement = undefined;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].textContent.includes(searchText)) {
        identifiedElement = elements[i];
        break;
      }
    }

    return identifiedElement;
  }

  function replaceCdn(urlString, cdnUrl) {
    let assetUrl = new URL(urlString);
    var urlParams = assetUrl.searchParams;

    const newParams = new URLSearchParams();
    urlParams.forEach((value, key) => {
      newParams.append(key.toLowerCase(), value);
    });

    if(cdnUrl && cdnUrl.length > 0) {
      var newCdnAssetUrl = new URL('', cdnUrl);
      newCdnAssetUrl.pathname = assetUrl.pathname.replace('//', '/');
      assetUrl = newCdnAssetUrl;
    }

    assetUrl.search = newParams.toString();
  
    return assetUrl.toString();
  }

  function handleDestinationAndAccessKey(urlString, destinationId, mediaFormatId, cdnUrl) {
    // if no destination then just return URL
    let assetUrl = new URL(urlString);
    var urlParams = assetUrl.searchParams;
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

    if(mediaFormatId && mediaFormatId.length > 0) {
      newParams.set('mediaformatid', mediaFormatId);
    }

    if(cdnUrl && cdnUrl.length > 0) {
      var newCdnAssetUrl = new URL('', cdnUrl);
      newCdnAssetUrl.pathname = assetUrl.pathname.replace('//', '/');
      assetUrl = newCdnAssetUrl;
    }

    assetUrl.search = newParams.toString();
  
    return assetUrl.toString();
  }
  

})();
