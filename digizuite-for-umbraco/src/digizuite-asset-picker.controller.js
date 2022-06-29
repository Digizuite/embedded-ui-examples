(function (angular) {
    'use strict';

    var controller = function ($scope) {
        debugger;
        var vals = _.values($scope.model.config.dams.items);
        var keys = _.keys($scope.model.config.dams.items);
        var damUrl = $scope.model.config.dams.items[0].value;
        
        var imgPreview = document.getElementById("imgSelectedAsset");
        var digizuiteAssetSelector = document.getElementById("digizuite-iframe");
        digizuiteAssetSelector.src = damUrl +"/embedded";

        if ($scope.model.value == '') {
            imgPreview.hidden = true;
        }
        else {
            imgPreview.src = $scope.model.value;
            imgPreview.hidden = false;
        }

        window.addEventListener("message", (event) => {
            if (event.origin === damUrl && event?.data?.messageType === "AssetMessage") {
                // If you need to make the asset url public, then this is where you would need to remove
                // access key and use a different destination

                $scope.model.value = event.data.asset.downloadUrl;

                // Coyping traditional download url
                imgPreview.src = event.data.asset.downloadUrl;
                imgPreview.hidden = false;
                
                navigator.clipboard.writeText(event.data.asset.downloadUrl).then(function () {
                    console.log('Async: Copying to clipboard was successful!');

                    // Do you wish to download instead then use 
                    // downloadFile(event.data.asset.downloadUrl)
                }, function (err) {
                    console.error('Async: Could not copy text: ', err);
                });

                digizuiteAssetSelector.hidden = true;
            }
        });

        $scope.showHideDigizuiteAssetSelector = function () {
            digizuiteAssetSelector.hidden = !digizuiteAssetSelector.hidden
        };

        $scope.clearDigizuiteAsset = function () {
            imgPreview.src = '';
            imgPreview.hidden = true;
            $scope.model.value = '';
        };
    }

    controller.$inject = ["$scope"];

    angular.module("umbraco").controller("digizuiteAssetPickerController", controller);
})(angular);