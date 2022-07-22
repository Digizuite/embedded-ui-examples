# Digizuite Chrome Extension

This project is based on the Digizuite [Unified DAM Connector](https://digizuite.atlassian.net/wiki/spaces/DD/pages/3177121185/MM5.6+Unified+DAM+Connector) together with [Chrome Extension - Getting started](https://developer.chrome.com/docs/extensions/mv3/getstarted/).

The Digizuite DAM Connector for Chrome is already on [Chrome Web Store](https://chrome.google.com/webstore/detail/digizuite-dam-connector/oaoljlnnfajdknoldafoelalijmaebkg). It is based on this example here which is also available for your benefit if wanting to customize specifically to your needs outside of what the standard extension can do.

## Custom Embedded: Adding the Unified DAM Connector

All the magic happens in the after.js. First ensure that you have added a correct Media Manager URL:
```
  // Your Media Manager url without / at the end
  var mediaManagerUrl = "https://your-digizuite-media-manager.your-domain.com";
```

Then initiate the iframe and appdended to body so that it can be shown.
```
    var iframe = document.createElement('iframe'); 
    iframe.id = "digizuite-iframe";
    iframe.style.background = "white";
    iframe.style.height = "100%";
    iframe.style.width = "360px";
    iframe.style.position = "fixed";
    iframe.style.top = "0px";
    iframe.style.right = "0px";
    iframe.style.zIndex = "9999";
    iframe.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
    iframe.src = `${mediaManagerUrl}/embedded`;
    iframe.hidden = true;
    document.body.appendChild(iframe);
```

Add a Digizuite botton to all pages which will bring forward or close the iframe.
```
     var button = document.createElement('button');
    var hidden = true;
    var src = chrome.runtime.getURL('images/logo_32_px.png');
    button.innerHTML = `<img src='${src}'>`;
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
       .... styling ....
       .... styling ....
    document.body.appendChild(button);

    // Add button on click
    button.onclick = () => {
      var iframe = document.getElementById("digizuite-iframe");
      hidden = !hidden;
      iframe.hidden = hidden
    }
```

Registering and reacting to users selecting assets in the Unified DAM Connector:
```
    window.addEventListener("message", (event) => {
    if(event.origin === mediaManagerUrl && event?.data?.messageType === "AssetMessage") {
        // If you need to make the asset url public, then this is where you would need to remove
        // access key and use a different destination

        // Coyping traditional download url
		    navigator.clipboard.writeText(event.data.asset.downloadUrl).then(function() {
			  console.log('Async: Copying to clipboard was successful!');

        // Do you wish to download instead then use 
        // downloadFile(event.data.asset.downloadUrl)
		  }, function(err) {
			console.error('Async: Could not copy text: ', err);
		  });
    }
  });
```

Obviously, you have the flexibility to change what happens when the asset is clicked.

Please read the Unified DAM Conenctor documentation for more information [here](https://digizuite.atlassian.net/wiki/spaces/DD/pages/3092348945/MM5.5+Unified+DAM+Connector).

## Adding it to Chrome

1. Enter the following as url in your browser to bring forward the chrome extension window:
```
  chrome://extensions/
```

2. Enable Developer Mode in the right corder

3. Download or clone this repo (the contents of src folder is what is important)

3. Press 'Load Unpacked' and navigate to 'digizuite-chrome-extension/embedded' or 'digizuite-chrome-extension/out-of-box' and then 'Select Folder'

4. See the extension in the list of extesions

5. Go to a new page and refresh. See the button in the lower right corder.


## Further help

Do you need more information about Chrome Extension then look at [Getting started with Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/) or visit [Digizuite Unified DAM Connector](https://digizuite.atlassian.net/wiki/spaces/DD/pages/3092348945/MM5.5+Unified+DAM+Connector).
