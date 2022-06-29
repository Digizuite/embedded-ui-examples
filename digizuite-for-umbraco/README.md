# Digizuite for Umbraco

This project is based on the Digizuite [Unified DAM Connector](https://digizuite.atlassian.net/wiki/spaces/DD/pages/3177121185/MM5.6+Unified+DAM+Connector).

## Adding the Digizuite Asset Picker to umbraco

1. Download the DigizuiteAssetPicker component files.
2. Open your umbraco website root folder and open App_Plugins folder.
3. Create folder DigizuiteAssetPicker and copy the DigizuiteAssetPicker component files inside;
4. Open umbraco website and go to umbraco → Settings and create new Data Type
5. Set datatype name and choose "Digizuite - Asset Picker" as property editor
6. Open just created data type and configure connection to your digizuite media manager, fill DAM name and URL
7. Create new document type with template
8. Add an "Asset" property to the document and set "Digizuite - Asset Picker" as an editor
9. Update the template, so it will show the "Asset" property
```
	<div>
		<img src="@Model.Asset"/>
	</div>
```
10. Go to Content and create page witth just created document type
11. Setup the name and click “Choose The Asset“
12. The list of assets should be shown, please choose any asset
13. And click on “Use“ for choosing the quality
14. Save and publush the changes
15. Open the pagr and make sure you can see the selected asset.


## Further help

If you still have any questions please visit [Umbraco Digizuite integration](https://digizuite.atlassian.net/wiki/spaces/RDG/pages/3266904088/Umbraco+Digizuite+integration).