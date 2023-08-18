import { createMenu } from './contextMenus.js';
import { openWindow } from "./openWindow.js";
import { changeUrlEventHandler } from "./events/change-url-event-handler.js";
import { messageTypes } from "../models/messageTypes.js";
import { openSettings } from "../utility/options.js";

// Tasks to run after the extension is installed
chrome.runtime.onInstalled.addListener(() => {
   // Create the context menu
   createMenu();

   // Redirect the user to the settings page
   openSettings();
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
});