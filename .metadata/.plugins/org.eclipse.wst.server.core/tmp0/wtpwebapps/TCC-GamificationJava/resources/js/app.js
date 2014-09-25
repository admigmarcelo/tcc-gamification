'use strict';
var appModule = angular.module('app', [ 'ngRoute','ngResource', 'ui.bootstrap' ]);

var appModule = angular.module('app').factory('Usuario', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/usuario/:login', {}, {
            query: { method: "GET", isArray: true },
    		'update': { method:'PUT'}
    });

});

var appModule = angular.module('app').factory('Login', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/usuario/login');
});

var appModule = angular.module('app').factory('Progresso', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/progresso/:progresso/usuario/:usuario/exercicio/:exercicio');
});

var appModule = angular.module('app').factory('Modulo', function ($resource) {
	return $resource('http://localhost:8080/TCC-GamificationJava/modulo/:modulo/assunto/:assunto/exercicio/:exercicio', {}, {
        query: { method: "GET", isArray: true }
	});
});

appModule.factory('usuario', function () {

    var data = {};

    return {
    	getUsuario: function () {
            return data;
        },
        setUsuario: function (usuario) {
            data = usuario;
        },
    };
});

appModule.controller('LoginController', function ($rootScope, $scope, $http, $location, usuario, Login) {
    $rootScope.activetab = $location.path();
    $scope.usuario = {
        "login": "",
        "senha": ""
    };
    $scope.mensagem = "";

    $scope.logarUsuario = function () {
        var data = $scope.usuario;
        Login.save(data, function(response) {
            var status = response.retorno;
            if (status === true) {
                usuario.setUsuario($scope.usuario);
                $location.path('/home');
                $location.replace();
            } else {
                $scope.mensagem = "Usuário ou senha incorreto";
                console.log(status);
            }
        });

    };
});

appModule.controller('UsuarioController', function ($rootScope, $location, $scope, $http, usuario, Usuario) {
    $rootScope.activetab = $location.path();
    $scope.usuario = {};
    Usuario.query(function(data) {
        $scope.usuariosTop = data;
    });
    
    Usuario.get({ login: usuario.getUsuario().login }, function(data) {
    	$scope.usuario = data;
    	usuario.setUsuario($scope.usuario);
   });
    
});

appModule.controller('ModuloController', function ($rootScope, $location, $scope, Modulo, exercicios) {
    $rootScope.activetab = $location.path();

    Modulo.query(function(data) {
    	$scope.modulos = data;
    });
    
    $scope.escolherAssunto = function (assunto) {
    	if(assunto.modulo.nome == "UML"){
    		Modulo.query({ assunto: assunto.id }, function(data) {
     	       exercicios.setExercicios(data);
     	       exercicios.setBadges(assunto.conquistas);
     	       $location.path("/uml/exercicios");
     	   });
    	}else{
    		Modulo.query({ assunto: assunto.id }, function(data) {
      	       exercicios.setExercicios(data);
      	       exercicios.setBadges(assunto.conquistas);
      	       $location.path("/java/exercicios");
      	   });
    	}
    
    };
    
});

appModule.controller('CadastroController', function ($scope, $http, Usuario) {
    $scope.usuario = {
        "nome": "",
        "login": "",
        "senha": ""
    };
    $scope.mensagem = "";
    $scope.status = "";

    $scope.cadastrarUsuario = function () {
        var data = $scope.usuario;
        Usuario.save(data, function(response) {
            //data saved. do something here.
        }); //saves an entry. Ass
    };

});

