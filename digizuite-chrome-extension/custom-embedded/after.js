(function () {
  const oldIframe = document.getElementById('dziframe');

  if (oldIframe) {
    oldIframe.remove();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'dziframe';
  iframe.style.background = 'white';
  iframe.style.height = '100%';
  iframe.style.width = '400px';
  iframe.style.position = 'fixed';
  iframe.style.top = '0px';
  iframe.style.right = '0px';
  iframe.style.zIndex = '99999';
  iframe.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';
  iframe.src = `${mediaManagerUrl}/embedded`;
  document.body.appendChild(iframe);

  // Add button on click
  button.onclick = () => {
    var iframe = document.getElementById("dziframe");
    hidden = !hidden;
    iframe.hidden = hidden
  }

  // Add event listener
  window.addEventListener("message", (event) => {
    if(event.origin === mediaManagerUrl && event?.data?.messageType === "AssetMessage") {
        // If you need to make the asset url public, then this is where you would need to remove
        // access key and use a different destination

        // Coyping traditional download url
		    navigator.clipboard.writeText(event.data.asset.downloadUrl).then(function() {
			  console.log("Async: Copying to clipboard was successful!");

        // Do you wish to download instead then use 
        // downloadFile(event.data.asset.downloadUrl)
		  }, function(err) {
			console.error('Async: Could not copy text: ', err);
		  });
    }
  });

  // Can be used if you wish to download on click
  function downloadFile(url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    window.open(`${url}&download=true`);
  }
})();
