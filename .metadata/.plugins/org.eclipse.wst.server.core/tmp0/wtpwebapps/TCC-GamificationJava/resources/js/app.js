'use strict';
var appModule = angular.module('app', [ 'ngRoute' ]);

appModule.config([ '$routeProvider',
		function($routeProvider, $locationProvider) {
			// remove o # da url use the HTML5 History API
			// $locationProvider.html5Mode(true);
			$routeProvider.when('/', {
				templateUrl : 'login.html',
				controller : 'LoginController'
			}).when('/home/:login', {
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
				templateUrl : 'uml/exercicios.html',
				controller : 'UmlController'
			}).when('/sair', {
				templateUrl : 'login.html',
				controller : 'LoginController'
			}).otherwise({
				redirectTo : '/'
			});

		} ]);

appModule.controller('LoginController', function($scope, $http, $location) {

	$scope.usuario = {
		"login" : "",
		"senha" : ""
	};
	$scope.mensagem = "";

	$scope.logarUsuario = function() {
		var data = $scope.usuario;
		$http.post('http://localhost:8080/TCC-GamificationJava/usuario/login',
				data).success(function(data) {
			var status = data;
			if (status == "ok") {
				$location.path('/home/' + $scope.usuario.login);
				$location.replace();
			} else {
				$scope.mensagem = data;
			}

		});
	};
});

appModule.controller('UsuarioController', function($scope, $http, $routeParams) {

	$scope.pontuacao = 0;
	var usuarioLogin = {
			"login" : $routeParams.login,
			"pontos" : 1000
		};

	$http.get('http://localhost:8080/TCC-GamificationJava/usuario/listByMelhores')
				.success(function(data) {
					$scope.usuariosTop = data;
				});
	
	$http.post('http://localhost:8080/TCC-GamificationJava/usuario/get',usuarioLogin)
	.success(function(data) {
		$scope.usuario = data;
		usuarioLogin.pontos = $scope.usuario.pontos;
		
		$http.post('http://localhost:8080/TCC-GamificationJava/usuario/listByClassificacao', usuarioLogin)
		.success(function(data) {
			$scope.usuariosClassificacao = data;
		});
	});
	
});

appModule.controller('ModuloController', function($scope, $http) {
	$http.get('http://localhost:8080/TCC-GamificationJava/modulos/get')
			.success(function(data) {
				$scope.modulos = data;
			});
});

appModule.controller('CadastroController', function($scope, $http) {
	$scope.usuario = {
		"nome" : "",
		"login" : "",
		"senha" : ""
	};
	$scope.mensagem = "";
	$scope.status = "";

	$scope.cadastrarUsuario = function() {
		var data = $scope.usuario;
		$http.post('http://localhost:8080/TCC-GamificationJava/usuario/post',
				data).success(function(data) {
			var cadastro = data;
			if (cadastro == "true") {
				$scope.mensagem = "Cadastrado com sucesso";
				$scope.status = "success";

			} else {
				$scope.mensagem = "Usuário já existe";
				$scope.status = "warning";
			}
		
		});
	};

});

appModule.controller('JavaController', function($scope, $http) {
	
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/eclipse");
	editor.getSession().setMode("ace/mode/java");
	
	$scope.exercicioJava = {};
	var codigo = "";
	$scope.dica1 = {"status" : true, "id" : 1};
	$scope.dica2 = {"status" : true, "id" : 2};
	$scope.dica3 = {"status" : true, "id" : 3};
	
	$scope.dicas = function(dica){
		if(dica.status === true && dica.id === 1){
			$scope.exercicioJava.pontos = $scope.exercicioJava.pontos - 10;
			$scope.dica1.status = false;
		}
		if(dica.status === true && dica.id === 2){
			$scope.exercicioJava.pontos = $scope.exercicioJava.pontos - 10;
			$scope.dica2.status = false;
		}
		if(dica.status === true && dica.id === 3){
			$scope.exercicioJava.pontos = $scope.exercicioJava.pontos - 10;
			$scope.dica3.status = false;
		}
	};
	
	$http.get('http://localhost:8080/TCC-GamificationJava/java/exercicio/get')
	.success(function(data) {					 
		$scope.exercicioJava = data;
		codigo = $scope.exercicioJava.codigoReferencia;	
		editor.setValue(codigo);
	});

	$scope.resposta = {"codigo" : ""};
	$scope.enviarExercicio = function() {
		codigo = editor.getSession().getValue();
		$scope.resposta.codigo = codigo;
		

		var data = $scope.resposta;
		$http.post('http://localhost:8080/TCC-GamificationJava/java/exercicio/post', data)
				.success(function(data) {					 
					$scope.retornoJava = data;
					var retorno = data.resposta;
					var resposta = $scope.exercicioJava.respostaJava;
					$scope.mensagem = verificarReposta(retorno, resposta);
					$('#javaModal').modal();

				});
	};
	
	function verificarReposta(retorno, resposta) {
		var mensagem = "";
		if(retorno === resposta){
			mensagem = "Parabéns você acertou!";
			if($scope.exercicioJava.tentativas === 0){
				$scope.exercicioJava.pontos = $scope.exercicioJava.pontos - 20;
			}
			console.log("Acertou!!!");
		}else{
			if($scope.exercicioJava.tentativas !== 0){
				$scope.exercicioJava.tentativas = $scope.exercicioJava.tentativas - 1;
			}
			mensagem = "Você errou, tente novamente";
			console.log("Errou!!!");	
		}
	    return mensagem;
	}

});

appModule.controller('UmlController', function($scope, $http) {
	
	$scope.exercicio = {};
	$scope.alternativa = {};
	$scope.resposta = "";	
	$scope.respostaUml = {};
	
	$http.get('http://localhost:8080/TCC-GamificationJava/uml/exercicio/get')
	.success(function(data) {
		$scope.exercicio = data;
		$scope.alternativa = data.alternativas;
	});
	
	$scope.enviarResposta = function() {
		$scope.mensagem = verificarReposta($scope.resposta, $scope.exercicio.respostaUml);
		$('#umlModal').modal();

	};
	
	function verificarReposta(resposta, respostaCorreta){
		var mensagem = "";
		if(resposta === respostaCorreta){
			mensagem = "Parabéns você acertou!";
			if($scope.exercicio.tentativas === 0){
				$scope.exercicio.pontos = $scope.exercicio.pontos - 20;
			}
		}else{
			if($scope.exercicio.tentativas !== 0){
				$scope.exercicio.tentativas = $scope.exercicio.tentativas - 1;
			}
			mensagem = "Que pena você errou! Tente novamente";
		}
		return mensagem;
	}
});
