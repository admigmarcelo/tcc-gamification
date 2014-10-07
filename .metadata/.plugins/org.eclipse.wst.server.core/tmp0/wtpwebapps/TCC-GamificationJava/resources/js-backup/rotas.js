'use strict';
var appRoute = angular.module('app');

appRoute.config([ '$routeProvider',
		function($routeProvider, $locationProvider) {
			// remove o # da url use the HTML5 History API
			// $locationProvider.html5Mode(true);
			$routeProvider.when('/', {
				templateUrl : 'login.html',
				controller : 'LoginController'
			}).when('/home/', {
				templateUrl : 'home.html',
				controller : 'UsuarioController'
			}).when('/modulos', {
				templateUrl : 'modulos.html',
				controller : 'ModuloController'
			}).when('/cadastro', {
				templateUrl : 'cadastro.html',
				controller : 'CadastroController'
			}).when('/java/exercicios', {
				templateUrl : 'java/exercicios.html',
				controller : 'JavaController'
			}).when('/uml/exercicios', {
				templateUrl : 'uml/exercicios-teste.html',
				controller : 'UmlController'
			}).when('/sair', {
				templateUrl : 'login.html',
				controller : 'LoginController'
			}).otherwise({
				redirectTo : '/'
			});

		} ]);