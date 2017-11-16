var app = angular.module('Softnew', [
  'ngMaterial',
  'ngAnimate',
  'firebase',
  'ui.router',
  'angularCSS'
])

.run(function($rootScope, $state, $location) {
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

  $rootScope.menuAction = function(action) {
    return $location.path('/' + action);
  };

}).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('brown')
    .accentPalette('red');
});
