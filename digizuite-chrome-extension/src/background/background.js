import { createMenu } from './contextMenus.js';
import { closeWindow, openWindow } from "./openWindow.js";

// Create context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
   createMenu();
});

// Event listener for when the user clicks on the extension icon
chrome.action.onClicked.addListener(() => {
   openWindow();
});

// Event listener for when the user changes the url in the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === 'ChangeUrl') {
      // We have to close the existing window before we can open a new one with the updated URL
      closeWindow();
      openWindow();
   }
});