app.controller("SalerController", function($scope, $rootScope, $location, $mdToast, $firebaseObject, $mdDialog, ApiService) {

    var token = window.sessionStorage.getItem('USER_SOFTNEW');
    
    if (!token)
        return $location.path('/login');

    function salerNewController($scope, $mdDialog) {

        $scope.labelTitle   = 'Novo Colaborador';

        $scope.newSaler = function() {
            
            $scope.loaderModal   = true;
    
            payload = {
                'empresaId'     : token,
                'colaborador'   : $scope.saler
            }
    
            // Salva o colaborador no API
            ApiService.post('colaborador', payload, function(err, sucess) {
                $scope.loaderModal   = false;
    
                if (err) {
                    $mdToast.show($mdToast.simple().textContent('Error em salvar um colaborador.'));
                }
    
                if (sucess) {
                    $mdToast.show($mdToast.simple().textContent('salvar colaborador ' + $scope.saler.nome));
                    $scope.saler = {};
                    $mdDialog.hide();
                }
    
            });
            
        };

    }

    $rootScope.loaderPaginate   = true;
    $rootScope.page             = 'Colaborador';

    var ref 	= firebase.database().ref();
    var obj 	= $firebaseObject(ref);

    $scope.editSaler = function(item) {

        // Salva o colaborador no API
        ApiService.delete('colaborador/' + token, item.uid, function(err, sucess) {
            $scope.loaderModal   = false;

            if (err) {
                $mdToast.show($mdToast.simple().textContent('Error em excluir um colaborador.'));
            }

            if (sucess) {
                $mdToast.show($mdToast.simple().textContent('colaborador ' + item.nome + ' excluído.'));
                $scope.listSaler();
            }

        });
        
    };
    
    // to take an action after the data loads, use the $loaded() promise
    $scope.listSaler = function() {
        obj.$loaded().then(function() {

            $scope.salers       = [];
            $scope.schedules    = [];

            // To iterate the key/value pairs of the object, use angular.forEach()
            angular.forEach(obj, function(value, key) {
                if (key === 'softnew')
                    if (value['empresas'])
                        if (value['empresas'][token]['colaboradores']) {
                            Object.keys(value['empresas'][token]['colaboradores']).map(function (key) {
                                $scope.salers.push(value['empresas'][token]['colaboradores'][key]['colaborador-info']);
                                $scope.schedules.push(value['empresas'][token]['colaboradores'][key]['agenda-colaborador']);
                            });
                            $rootScope.loaderPaginate   = false;
                        }
            });

        }).catch(function() {
            $mdToast.show($mdToast.simple().textContent('Error em buscar empresa.'));
        });
    };

    $scope.newSaler = function(ev) {
        $mdDialog.show({
            'controller'      : salerNewController,
            'templateUrl'     : 'partials/saler/salerNew.html',
            'parent'          : angular.element(document.body),
            'targetEvent'     : ev,
            'clickOutsideToClose' : true
        }).finally(function() {
            $scope.listSaler();
        });
    };

    $scope.listSaler();

});
