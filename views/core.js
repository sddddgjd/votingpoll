var app = angular.module('myApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

app.controller('AppCtrl', function($scope, $mdDialog) {
    $scope.status = '  ';
    $scope.customFullscreen = false;

    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'new.ejs',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };

    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }
});

app.controller("user", function($scope, $http) {
    $scope.logged = false;
    $scope.isLogged = function() {
        $http({
                url: '/api/isLogged',
                method: "POST",
                data: {}
            })
            .then(function(response) {
                $scope.logged = response.data;
            });
    }
});