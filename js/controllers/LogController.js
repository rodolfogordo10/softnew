app.controller("LogController", function($scope, $rootScope, $location, $mdToast, $firebaseObject) {

    var token = window.sessionStorage.getItem('USER_SOFTNEW');
    
    if (!token)
        return $location.path('/login');

    $rootScope.loaderPaginate   = true;
    $rootScope.page             = 'Log';

    var ref 	= firebase.database().ref();
    var obj 	= $firebaseObject(ref);
    
    // to take an action after the data loads, use the $loaded() promise
    obj.$loaded().then(function() {

        $scope.logs = [];

        // To iterate the key/value pairs of the object, use angular.forEach()
        angular.forEach(obj, function(value, key) {
            if (key === 'Logs') {
                Object.keys(value).map(function (key) {
                    if (value[key][token]) {
                        Object.keys(value[key][token]).map(function (key2) {
                            if (value[key][token][key2]) {
                                Object.keys(value[key][token][key2]).map(function (key3) {
                                    if (value[key][token][key2][key3]) {
                                        $scope.logs.push(value[key][token][key2][key3]);
                                    }
                                });
                            }
                        });
                    }
                });
                $rootScope.loaderPaginate   = false;
            }
        });

    }).catch(function() {
        $mdToast.show($mdToast.simple().textContent('Error em buscar empresa.'));
    });

});
