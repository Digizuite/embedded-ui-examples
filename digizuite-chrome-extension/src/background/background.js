import { createMenu } from './contextMenus.js';
import { openWindow } from "./openWindow.js";
import { changeUrlEventHandler } from "./events/change-url-event-handler.js";
import { messageTypes } from "../models/messageTypes.js";
import { openSettings } from "../utility/options.js";

// Tasks to run after the extension is:
// 1. First installed
// 2. The extension is updated to a new version
// 3. Chrome is updated to a new version
chrome.runtime.onInstalled.addListener(() => {
   // Create the context menu
   createMenu();

   // Redirect the user to the settings page if they have not set the Media Manager URL
   chrome.storage.sync.get(['mmUrl'], response => {
      if (!response.mmUrl) {
         openSettings();
      }
   });
});

// Event listener for when the user clicks on the extension icon
chrome.action.onClicked.addListener(() => {
   openWindow();
});

// Event listener for messages from content scripts that don't interact with the DOM
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === messageTypes.changeUrl) {
      changeUrlEventHandler(request.data);
   }

   if (request.action === messageTypes.assetMessage) {
      chrome.storage.sync.get(['mmUrl', 'onlyAssetId', 'mediaFormatId', 'publicDestination', 'cdnUrl'], result =>  {
         const mediaManagerUrl = result.mmUrl;
         const onlyAssetId = result.onlyAssetId;
         const mediaFormatId = result.mediaFormatId;
         const publicDestination = result.publicDestination;
         const cdnUrl = result.cdnUrl;

         if (request.origin === mediaManagerUrl) {
            sendResponse({
               onlyAssetId,
               mediaFormatId,
               publicDestination,
               cdnUrl,
            });
         }
      });
   }
});