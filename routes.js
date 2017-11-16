app.config( function($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'partials/login/login.html',
        controller: 'LoginController'
      });
      $locationProvider.html5Mode(false);
      $stateProvider.state('empresa', {
        url: '/empresa',
        controller: 'CompanyController',
        templateUrl: 'partials/company/company.html'
      });
      $stateProvider.state('colaborador', {
        url: '/colaborador',
        controller: 'SalerController',
        templateUrl: 'partials/saler/saler.html'
      });
      $stateProvider.state('log', {
        url: '/log',
        controller: 'LogController',
        templateUrl: 'partials/log/log.html'
      });

      var token        = window.sessionStorage.getItem('USER_SOFTNEW');
      var routeDefault = '/login';

      if (token)
        routeDefault = '/empresa';

      $urlRouterProvider.when('', routeDefault);

      $locationProvider.hashPrefix('');
  });
