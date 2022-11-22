import pick from 'lodash/pick';
import { Asset, setup } from '@contentful/dam-app-base';

const CTA = 'Select asset from Digizuite';

type AssetMessage = {
  assetId: number;
  itemId: number;
  title: string;
  linkUrl: string;
  description: string;
  downloadUrl: string;
  extension: string;
  lastModifiedTimeInMs: number;
}

const ASSET_FIELDS = [
  'title',
  'description',
  'extension',
  'downloadUrl',
  'asset',
];

function makeThumbnail(attachment: Asset): [string, string | undefined] {
  const url = attachment.downloadUrl;
  const alt = attachment.title;

  return [url, alt];
}

function renderDialog(sdk: any) {
  // Either we have the model on invocation or instace.
  const config = sdk.parameters.invocation;
  let { digizuiteMmUrl } = config;
  if(!digizuiteMmUrl) {
    digizuiteMmUrl = sdk.parameters.instance.digizuiteMmUrl;
  }

  // Constructing URL and iframe to show on selection
  const container = document.createElement('div');
  const bf_embed_url = digizuiteMmUrl;

  const iframe = document.createElement('iframe');
  iframe.id = 'digizuite-embedded-view';
  iframe.className = 'iframe-container';
  iframe.src = bf_embed_url;
  iframe.width = "400";
  iframe.height = "650";
  iframe.style.border = 'none';
  container.appendChild(iframe);

  document.body.appendChild(container);

  sdk.window.startAutoResizer();

  window.addEventListener('message', (event) => {
    if (event.source !== iframe.contentWindow) {
      return;
    }
	
    if(event?.data?.messageType === "AssetMessage") {
		var assetsToReturn: AssetMessage[] = [];
		
		var asset: AssetMessage = event.data.asset;
		if(asset) {
			assetsToReturn.push(asset);
		}
		
    if(event.data.assets && event.data.assets.length > 0) {
			assetsToReturn = event.data.assets;
    }
		
		if (assetsToReturn && assetsToReturn.length > 0) {
			sdk.close(assetsToReturn);
		}
	}

  });
}

async function openDialog(sdk: any, _currentValue: Asset[], config: any) {
  const result = await sdk.dialogs.openCurrentApp({
    position: 'center',
    title: CTA,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { ...config },
    width: 440,
    allowHeightOverflow: true,
  });

  if (!Array.isArray(result)) {
    return [];
  }

  // Example result is Array of:
  //  export interface AssetMessage {
  //      assetId: number;
  //		  itemId: number;
  //		  title: string;
  //		  linkUrl: string;
  //		  description: string;
  //		  downloadUrl: string;
  //		  extension: string;
  //		  lastModifiedTimeInMs: number;
  //	}

  return result.map((asset: any) => extractAsset(asset));
}

function extractAsset(asset: any) {
  let res = pick(asset, ASSET_FIELDS);
  return res;
}

setup({
  cta: CTA,
  name: 'Digizuite',
  logo: 'https://mango-tree-001f62003.1.azurestaticapps.net/assets/logo_256_px.png',
  color: '#40D1F5',
  description:
    'Digizuite is amazing.',
  parameterDefinitions: [
    {
      id: 'digizuiteMmUrl',
      type: 'Symbol',
      name: 'Digizuite MM URL',
      description:
        'Provide your media manager URL',
      required: true,
    },
  ],
  validateParameters: () => null,
  makeThumbnail,
  renderDialog,
  openDialog,
  isDisabled: () => false,
});