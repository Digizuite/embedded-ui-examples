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
  iframe.src = 'https://salmon-plant-05727d903.1.azurestaticapps.net/';
  document.body.appendChild(iframe);
})();
