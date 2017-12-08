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

        $scope.logs     = [];
        $scope.salers   = [];

        // To iterate the key/value pairs of the object, use angular.forEach()
        angular.forEach(obj, function(value, key) {
            if (key === 'softnew')
                if (value['empresas']) {
                    if (value['empresas'][token]['Logs']) {
                        Object.keys(value['empresas'][token]['Logs']).map(function (key) {
                            value['empresas'][token]['Logs'][key].dataHora = moment(value['empresas'][token]['Logs'][key].dataHora).format('DD/MM/YYYY HH:MM:SS');
                            $scope.logs.push(value['empresas'][token]['Logs'][key]);
                        });
                    }
                    if (value['empresas'][token]['colaboradores']) {
                        Object.keys(value['empresas'][token]['colaboradores']).map(function (key) {
                            $scope.salers.push(value['empresas'][token]['colaboradores'][key]['colaborador-info']);
                        });
                    }
                    $rootScope.loaderPaginate   = false;
                }
        });

    }).catch(function() {
        $mdToast.show($mdToast.simple().textContent('Error em buscar logs.'));
    });

    $scope.salerLog = function(salerId) {
        for (var i = 0; i < $scope.salers.length; i++) {
            if ($scope.salers[i].uid === salerId) {
                return $scope.salers[i].displayName;
            }
        }
    };

    $scope.getDate = function() {
        console.log($scope.search, $scope.dataHora);
        $scope.search.dataHora = moment($scope.dataHora).format(DD/MM/YYYY);
    };

});
