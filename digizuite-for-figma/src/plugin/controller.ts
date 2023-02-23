figma.showUI(__html__, { width: 500, height: 655 });

figma.ui.onmessage = async msg => {

  if (msg.type === 'create-assets' && msg.assetsToReturn && msg.assetsToReturn.length > 0) {

    const asset: any = msg.assetsToReturn[0];

    try {
      figma.notify('Inserting Digizuite asset.');

      const image = await figma.createImageAsync(asset.downloadUrl);

      const node = figma.createRectangle()

      // Resize the node to match the image's width and height
      const { width, height } = await image.getSizeAsync()
      node.resize(width, height)
  
      // Set the fill on the node
      node.fills = [
        {
          type: 'IMAGE',
          imageHash: image.hash,
          scaleMode: 'FILL'
        }
      ];
  
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
  
      // This is how figma responds back to the ui
      figma.ui.postMessage({
        type: 'create-assets',
        message: `Created ${msg.count} Images`,
      });
    } catch(error) {
      figma.notify('Image too large or type not supported!', { error: true, timeout: 6000 });
    }

  }

  figma.closePlugin();
};
