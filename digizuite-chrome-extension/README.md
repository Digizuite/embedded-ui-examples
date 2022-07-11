# Digizuite Chrome Extension

This project is based on the Digizuite [Unified DAM Connector](https://digizuite.atlassian.net/wiki/spaces/DD/pages/3177121185/MM5.6+Unified+DAM+Connector) together with [Chrome Extension - Getting started](https://developer.chrome.com/docs/extensions/mv3/getstarted/).

The project has two folders. One for each variant of the Digizuite Chrome Extension. 
```
    custom-embedded // Use the Unified DAM Connector and customize with own Media Manager and how to listen to clicks to insert own functionality.
    out-of-box // Out-of-box experience which requires no further setup. Simply add it to chrome and your users can enter their URL directly from there.
```

Most of the readme will focus on the embedded variant. This is where you can are allowed to customize and listen to asset clicks directly from your Digizuite Media Manager embedded UI.

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

## Out-of-box: How to configure

If you have no need for customized functionality then you can simply use the out-of-box. It has a wrapper that allows you to simply add it to chrome (see next steps) without having to change anything in the code first. The embedded version requires you to change the src url in the iframe to your own media manager URL before adding it. Otherwise no change.

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
