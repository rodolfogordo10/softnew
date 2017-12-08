app.controller("CompanyController", function($scope, $rootScope, $location, $mdToast, $firebaseObject) {

    var token = window.sessionStorage.getItem('USER_SOFTNEW');
    
    if (!token)
        return $location.path('/login');

    $rootScope.loaderPaginate   = true;
    $rootScope.page             = 'Empresa';

    var ref 	= firebase.database().ref();
    var obj 	= $firebaseObject(ref);
    
    // to take an action after the data loads, use the $loaded() promise
    obj.$loaded().then(function() {

        $scope.company = {};

        // To iterate the key/value pairs of the object, use angular.forEach()
        angular.forEach(obj, function(value, key) {
            if (key === 'softnew')
                if (value['empresas'])
                    if (value['empresas'][token]['empresa-info']) {
                        $scope.company              = value['empresas'][token]['empresa-info'];
                        $rootScope.loaderPaginate   = false;
                    }
        });

    }).catch(function() {
        $mdToast.show($mdToast.simple().textContent('Error em buscar empresa.'));
    });

});
