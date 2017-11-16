app.controller("SalerController", function($scope, $rootScope, $location, $mdToast, $firebaseObject, $mdDialog) {

    var token = window.sessionStorage.getItem('USER_SOFTNEW');
    
    if (!token)
        return $location.path('/login');

    $rootScope.loaderPaginate   = true;
    $rootScope.page             = 'Colaborador';

    var ref 	= firebase.database().ref();
    var obj 	= $firebaseObject(ref);
    
    // to take an action after the data loads, use the $loaded() promise
    obj.$loaded().then(function() {

        $scope.salers = [];

        // To iterate the key/value pairs of the object, use angular.forEach()
        angular.forEach(obj, function(value, key) {
            if (key === 'softnew')
                if (value['saler']) {
                    Object.keys(value['saler']).map(function (key) {
                        if (value['saler'][key]['saler-info']['company']['uid'] === token) {
                            $scope.salers.push(value['saler'][key]['saler-info']);
                        }
                    });
                    $rootScope.loaderPaginate   = false;
                }
        });

    }).catch(function() {
        $mdToast.show($mdToast.simple().textContent('Error em buscar empresa.'));
    });

    $scope.newSaler = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
        .title('Cadastrar um novo colaborador')
        .placeholder('Email')
        .ariaLabel('Email')
        .targetEvent(ev)
        .required(true)
        .ok('Salvar')
        .cancel('Cancelar');

        $mdDialog.show(confirm).then(function(result) {
            $scope.status = 'Colaborador salvo com sucesso. ' + result + '.';
        });
    };

});
