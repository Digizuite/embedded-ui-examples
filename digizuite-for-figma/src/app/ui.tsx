import React, { useRef, useState } from 'react';
import ChangeUrl from './components/changeurl/ChangeUrl';
import styles from './ui.module.scss';

const UI = ({}) => {
  const [presetNewUrl, setPresentNewUrl] = useState<string>('');
  const [provideUrl, setProvideUrl] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [digiMmEmbedUrl, setDigiMmEmbedUrl] = useState<string>('');
  const initializedRef = useRef(initialized);

  const onCreate = (assetsToReturn: any[]) => {
    parent.postMessage({ pluginMessage: { type: 'create-assets', assetsToReturn } }, '*');
  };

  const saveUrl = async (url: string) => {
    setLoading(true);

    const urlToSave = url.replace(/\/$/, '');
    parent.postMessage({ pluginMessage: { type: 'store-client-url', clientUrl: urlToSave } }, '*');
    initializedRef.current = false;
    setDigiMmEmbedUrl(urlToSave);
    setProvideUrl(false);
  }

  /**
   * Is called when the iframe is loaded.
   * It will basically use a timeout function to check if the iframe was initialized.
   * It checks a boolean which is set when we receive a post message from the dgz iframe.
   * @param {any} loadEvent
   */
  const onLoadHandler = (loadEvent: any) => {
    try {
      setTimeout(() => {
        if(!loadEvent || (loadEvent && !loadEvent.target)) {
          throw Error('No event');
        }

        if(!initializedRef.current) {
          setProvideUrl(true);
          parent.postMessage({ pluginMessage: { type: 'store-client-url', clientUrl: '' } }, '*');
        }

        setLoading(false);

      }, 2500)

    } catch (error) {
      parent.postMessage({ pluginMessage: { type: 'store-client-url', clientUrl: '' } }, '*');
      setProvideUrl(true);
    }

  }

  React.useEffect(() => {

    parent.postMessage({ pluginMessage: { type: 'load-settings' } }, '*');

    // This is how we read messages sent from the plugin controller
    window.onmessage = (event: any) => {
      const { type, message, payload } = event.data.pluginMessage;
      if (type === 'create-assets') {
        console.log(`Figma Says: ${message}`);
      } else if(type == 'send-client-url') {
        if(!payload && !digiMmEmbedUrl) {
          setProvideUrl(true);
        } else if(payload) {
          setDigiMmEmbedUrl(payload);
          setProvideUrl(false);
        }
      }
    };

    window.addEventListener('message', (event) => {

        // Digizuite Event Received. The asset message  contains asset id and info.
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

      // When we have received the request to change url
      if(event?.data?.messageType === "ChangeUrl") {
        setPresentNewUrl(event.data.mmUrl);
        setProvideUrl(true);
      }

      // Received when we have rendered the iframe successfully
      if(event?.data?.messageType === "SmartPickerInitialized") {
        setInitialized(true);
        initializedRef.current = true;
      }

    });
  }, []);

  return (
    <div className={styles.container} id="mainContainer">
        { provideUrl && !loading ? 
            <>
              <ChangeUrl saveUrl={saveUrl} currentUrl={presetNewUrl}></ChangeUrl>
            </> :
            <iframe
              id="digizuite-embedded-view"
              className="iframe-container"
              src={digiMmEmbedUrl + "/embedded"}
              onError={() => setProvideUrl(true)}
              onLoad={(loadElement) => onLoadHandler(loadElement)}
              width={476}
              height={640}
              style={ { border: 'none' }}></iframe>
        }

        { loading && (
          <div className={styles.loadContainer}>
          <div className={styles.spinner}>
            <div className={styles.dot1}></div>
            <div className={styles.dot2}></div>
          </div>
        </div>
        )}
        

    </div>
  );
};

export default UI;
