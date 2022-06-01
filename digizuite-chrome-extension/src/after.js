// this code will be executed after page load
(function() {
  // MM url without / at the end
  var mediaManagerUrl = "https://your-digizuite-media-manager.your-domain.com";

  var button = document.createElement('button');
  var hidden = true;
  var src = chrome.runtime.getURL("images/logo_32_px.png");
  button.innerHTML = `<img src='${src}'>`;
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "10px";
  button.style.zIndex = "10000";
  button.style.backgroundColor = "white";
  button.style.borderRadius = "10px";
  button.style.border = "none";
  button.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
  button.style.color = "black";
  document.body.appendChild(button);

  var iframe = document.createElement("iframe"); 
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
  
  // Add button on click
  button.onclick = () => {
    var iframe = document.getElementById("digizuite-iframe");
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

  function downloadFile(url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    window.open(`${url}&download=true`);
  }
})();
