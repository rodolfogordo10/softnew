var app = angular.module('Softnew', [
  'ngMaterial',
  'ngAnimate',
  'firebase',
  'ui.router',
  'angularCSS',
  'ui.utils.masks',
  'angularMoment',
])

.run(function($rootScope, $state, $location, $mdSidenav) {
  $rootScope.$on('$stateChangeStart', function(evt, to, params) {
    if (to.redirectTo) {
      evt.preventDefault();
      $state.go(to.redirectTo, params)
    }
  });

  var config = {
		apiKey: "AIzaSyA9sLdBmN_c-UAaCQKwRn6DeDz_9cnyH_8",
		authDomain: "softnew-6ad61.firebaseapp.com",
		databaseURL: "https://softnew-6ad61.firebaseio.com",
		projectId: "softnew-6ad61",
		storageBucket: "softnew-6ad61.appspot.com",
		messagingSenderId: "669090403630"
	};
  firebase.initializeApp(config);
  
  var token = window.sessionStorage.getItem('USER_SOFTNEW');
  
  if (token)
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
      if (!firebaseUser.uid)
        window.sessionStorage.removeItem('USER_SOFTNEW')

      if (firebaseUser.uid)
        window.sessionStorage.setItem('USER_SOFTNEW', firebaseUser.uid);
    });

  $rootScope.menuItem = [
    {
      'name' : 'empresa',
      'icon' : 'ic_store_black_24px.svg'
    },
    {
      'name' : 'colaborador',
      'icon' : 'ic_account_circle_black_24px.svg'
    },
    {
      'name': 'log',
      'icon' : 'ic_history_black_24px.svg'
    }
  ];

  $rootScope.menuAction = function(action) {
    $mdSidenav('sidenavmenu').toggle();
    return $location.path('/' + action.name);
  };

  $rootScope.menu = function() {
    return $mdSidenav('sidenavmenu').toggle();
  };

}).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('brown')
    .accentPalette('red');
});
