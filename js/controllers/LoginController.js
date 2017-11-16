app.controller("LoginController", function($scope, $css, $mdToast, $location) {

	$css.bind('partials/login/login.css', $scope);

	$scope.user 	= {};

	$scope.loginUser = function() {

		firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {

			$mdToast.show($mdToast.simple().textContent(firebaseUser.email + ' conectado'));

			window.sessionStorage.setItem('USER_SOFTNEW', firebaseUser.uid);

			$location.path('/empresa');

		}).catch(function(error) {
			var errMsg;

			if (error.code === 'auth/user-not-found')
				errMsg = 'Não há registro de usuário correspondente a esse identificador. O usuário pode ter sido excluído';

			if (error.code === 'auth/wrong-password')
				errMsg = 'A senha é inválida ou o usuário não possui uma senha';
				
			$mdToast.show($mdToast.simple().textContent(errMsg));
		});


	};
	
});
