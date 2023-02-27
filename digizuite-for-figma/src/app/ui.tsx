import React, { useState } from 'react';
import styles from './ui.module.scss';

const UI = ({}) => {

  const [provideUrl, setProvideUrl] = useState<boolean>(false);

  const onCreate = (assetsToReturn: any[]) => {
    parent.postMessage({ pluginMessage: { type: 'create-assets', assetsToReturn } }, '*');
  };

  const digiMmEmbedUrl = 'https://mm-url.com';

  React.useEffect(() => {

    if(!digiMmEmbedUrl) {
       setProvideUrl(true);
    }

    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-assets') {
        console.log(`Figma Says: ${message}`);
      }
    };

    window.addEventListener('message', (event) => {
        if(event?.data?.messageType === "AssetMessage" && event.origin.includes(digiMmEmbedUrl)) {
        var assetsToReturn: any[] = [];
        
        var asset: any = event.data.asset;
        if(asset) {
          assetsToReturn.push(asset);
        }
        
        if(event.data.assets && event.data.assets.length > 0) {
          assetsToReturn = event.data.assets;
        }
        
        if (assetsToReturn && assetsToReturn.length > 0) {
            onCreate(assetsToReturn);
        }
      }
    });
  }, []);

  return (
    <div className={styles.container} id="mainContainer">
        { provideUrl ? 
            <>
              
            </> : 
            <iframe
              id="digizuite-embedded-view"
              className="iframe-container"
              src={digiMmEmbedUrl + "/embedded"}
              width={476}
              height={640}
              style={ { border: 'none' }}></iframe>
        }
        

    </div>
  );
};

export default UI;
