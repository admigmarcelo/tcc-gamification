'use strict';
var appModule = angular.module('app', [ 'ngResource', 'ui.bootstrap', 'route']);

appModule.factory('Usuario', function ($resource) {
	var login = "";
	
    return{
    	getUsuario: function () {
    		return $resource('http://localhost:8080/TCC-GamificationJava/usuario/' + login, {}, {
    	        'update': { method: 'PUT'}
    	    });
        },
    	getUsuarios: function () {
    		return $resource('http://localhost:8080/TCC-GamificationJava/usuario/', {}, {
    	        query: { method: "GET", isArray: true }
    	    });
        },
        setLogin: function (data) {
            login = data;
        },
        getLogin: function () {
        	return $resource('http://localhost:8080/TCC-GamificationJava/usuario/login');
        },
        
    };

});

appModule.factory('Login', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/usuario/login');
});

appModule.factory('Progresso', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/progresso/:progresso/nivel/:nivel');
});

appModule.factory('Modulo', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/modulo/:modulo/assunto/:assunto/exercicio/:exercicio', {}, {
        query: { method: "GET", isArray: true }
    });
});

appModule.controller('LoginController', function ($rootScope, $scope, $location, Usuario, breadcrumbs, Login) {
	$rootScope.breadcrumbs = breadcrumbs;
	$rootScope.activetab = $location.path();
    $scope.usuario = {
        "login": "",
        "senha": ""
    };
    $scope.mensagem = "";

    $scope.logarUsuario = function () {
        var data = $scope.usuario;
        Usuario.getLogin().save(data, function (response) {
            var status = response.retorno;
            if (status === true) {
                Usuario.setLogin(data.login);
                $location.path('/home/');
            } else {
                $scope.mensagem = "Usuário ou senha incorreto";
                console.log(status);
            }
        });

    };
});

appModule.controller('UsuarioController', function ($rootScope, $location, $scope, $http,  breadcrumbs, Usuario, Progresso) {
	$scope.breadcrumbs = breadcrumbs;
	$rootScope.activetab = $location.path();
    $rootScope.usuarioLogado = Usuario.getUsuario().get();
    $scope.usuario = {};
    Usuario.getUsuarios().query(function (data) {
        $scope.usuariosTop = data;
    });

    Usuario.getUsuario().get(function (data) {
        $scope.usuario = data;
        
        Progresso.get({ nivel: $scope.usuario.nivel.id }, function (data) {
            var proxNivel = data;
            if(proxNivel != null){
	            var percentMaxima =  proxNivel.pontos - $scope.usuario.nivel.pontos;
	            var percentAtual = $scope.usuario.pontos - $scope.usuario.nivel.pontos;
	            var resultPercent = (percentAtual / percentMaxima) * 100;
	            $scope.percentNivel = parseInt(resultPercent.toFixed(0));
            }else{
            	$scope.percentNivel = 100;
            }
        });
    });
    
    

});

appModule.controller('ModuloController', function ($rootScope, $location, $scope, Modulo, Usuario, ExerciciosFactory, breadcrumbs) {
	$scope.breadcrumbs = breadcrumbs;
	$rootScope.activetab = $location.path();
	$scope.conquistado = [];
	$scope.usuario = {};
	var progressos = [];
	var assuntosProgresso = [];
	var modulosProgresso = [];
	var badges = [];
	var conquistas = [];
	
	Usuario.getUsuario().get()
	.$promise.then(function (data){
		$scope.usuario = data;
		conquistas = $scope.usuario.badges;
		progressos = $scope.usuario.progressos;
		if(progressos != undefined){
			$scope.progresso = progressos[progressos.length - 1];
			for(var p in progressos){
				modulosProgresso.push(progressos[p].exercicio.assunto.modulo);
				assuntosProgresso.push(progressos[p].exercicio.assunto);
			}
		};

		Modulo.query()
		.$promise.then(function (data){
			$scope.moduloProgresso = [];
			$scope.assuntoProgresso = [];
			$scope.modulos = data;
			var modulos = data;
			var contModulos = 0;
			var contAssuntos = 0;
			
			for(var m in modulos){
				var modulo = modulos[m];
				$scope.moduloProgresso[modulo.id] = 0;
				for(var mp in modulosProgresso){
					if(modulosProgresso[mp].id == modulo.id){
						contModulos += 1;
						$scope.moduloProgresso[modulo.id] = (contModulos / modulo.assuntos.length) * 100;
					}else{
						contModulos = 0;
					}
				}
				
				for(var a in modulo.assuntos){
					var assunto = modulo.assuntos[a];
					badges = badges.concat(assunto.conquistas);
					
					var contExercicios = 0;
					$scope.assuntoProgresso[assunto.id] = 0;
					if(assunto.exercicios.length == 0)
						contExercicios = 1;
					else
						contExercicios = assunto.exercicios.length;
					for(var ap in assuntosProgresso){
						if(assuntosProgresso[ap].id == assunto.id){
							contAssuntos += 1;
							$scope.assuntoProgresso[assunto.id] = (contAssuntos / contExercicios) * 100;
						}else{
							contAssuntos = 0;
						}
					}
				}
			}
			$scope.badges = badges;
			$scope.badgesConquistados = [];
			for(var b in badges){
				var badge = badges[b];
				$scope.badgesConquistados[badge.id] = true;
				for(var c in conquistas){
					if(conquistas[c].badge.id == badge.badge.id)
						$scope.badgesConquistados[badge.id] = false;
				}
			}
			
		});
	});	
      
        
    $scope.escolherAssunto = function (assunto, index) {
    	
        if (assunto.modulo.nome == "UML") {
            Modulo.query({ assunto: assunto.id }, function (data) {
                ExerciciosFactory.setExercicios(data);
                ExerciciosFactory.setBadges(assunto.conquistas);
                ExerciciosFactory.setProxEx(0);
                $location.path("/home/modulos/uml/exercicios");
            });
        } else {
            Modulo.query({ assunto: assunto.id }, function (data) {
                ExerciciosFactory.setExercicios(data);
                ExerciciosFactory.setBadges(assunto.conquistas);
                ExerciciosFactory.setProxEx(0);
                $location.path("/home/modulos/java/exercicios");
            });
        }

    };

});

appModule.controller('CadastroController', function ($scope, $http, $location, Usuario, breadcrumbs) {
	$scope.breadcrumbs = breadcrumbs;
	$scope.usuario = {
        "nome": "",
        "login": "",
        "senha": ""
    };

    $scope.cadastrarUsuario = function () {
        var data = $scope.usuario;
        Usuario.getUsuario().save(data, function (response) {
            if(response.retorno == true){
            	$location.path("/home/");
            }else{
            	$scope.mensagem = "Usuario já cadastrado";
            }
        });
    };

});

