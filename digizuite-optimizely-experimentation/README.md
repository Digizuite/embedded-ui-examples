# Digizuite for Optimizely Experimentation

This project is an example of how to use Digizuite with Optimizely Experimentation. The overall guide is found in the [Digizuite Documentation](https://digizuite.atlassian.net/wiki/spaces/DD/pages/3294593025/How+to+use+Extension).

It  consists of two elements:
1. Digizuite Browser Extension (https://digizuite.atlassian.net/wiki/spaces/DD/pages/3276046348/DCE+5.5+-+Installation)
2. A config.json for the actual extension logic which can imported directly into Optimizely Experimentation from its editor (Read [here](https://docs.developers.optimizely.com/web/docs/extensions)).

## Digizuite Browser Extension

Simply go to https://digizuite.atlassian.net/wiki/spaces/DD/pages/3276046348/DCE+5.5+-+Installation and install it in your browser.

## Optimizely Experimentation Extension

Injecting your Digizuite Images directly into an HTML Element with an Optimizely Extension.

Add the asset id to the field (either manually or using the Browser Extension for asset selection):
![Screenshot](extension_screenshot.jpg)

If you are using at least DC 5.6.0 then there is the option to focal point crop by changing the parameters seen here:
![Screenshot](extension_crop_screenshot.jpg)

### Extension Fields

Following fields are available
1. Digizuite Asset Id
2. Digizuite DAM CDN URL
3. Digizuite Media Format ID
4. Digizuite Destination ID
5. Digizuite Image Width (optional)
6. Digizuite Image Height (optional)
7. Crop Gravity (optional)
8. Crop Width (must be used with gravity)
9. Crop Height (must be used with gravity)

## Further help

If you still have any questions please visit [Digizuite Optimizely Extension Docs](https://digizuite.atlassian.net/wiki/spaces/DD/pages/3294593025/How+to+use+Extension).
