'use strict';
var appController = angular.module('app');

appModule.factory('exercicios', [ 'Modulo', 'Usuario', 'usuario',
    function (Modulo, Usuario, usuario) {

        var dataEx = {
            exercicios: {},
            qtd: 0,
            proxEx: 0,
            badges: []
        };

        return {
            getExercicios: function () {
                return dataEx.exercicios;
            },
            setExercicios: function (exercicios) {
                dataEx.exercicios = exercicios;
            },
            getQuantidade: function () {
                var x;
                for (x in dataEx.exercicios) {
                    dataEx.qtd = +1;
                }
                return dataEx.qtd;
            },
            getProxEx: function () {
                return dataEx.proxEx;
            },
            setProxEx: function (reset) {
                dataEx.proxEx = reset;
            },
            setBadges: function (conquistas) {
                dataEx.badges = conquistas;
            },
            salvarConquista: function () {
                dataEx.proxEx = dataEx.proxEx + 1;
                if (dataEx.exercicios[dataEx.proxEx] == undefined) {
                    var badge = dataEx.badges[0];
                    Usuario.update({
                        login: usuario.getUsuario().login
                    }, {
                        id: badge.id
                    });

                    return true;
                } else {
                    return false;
                }
            }
        };
    } ]);

appModule.factory('resposta', function () {
    var data = {
        resposta: false,
        tentativas: 0,
        pontos: 0
    };

    return {
        verificarResposta: function (resposta, respostaCorreta) {
            if (resposta === respostaCorreta) {
                data.resposta = true;
                return data.resposta;
            } else {
                data.resposta = false;
                return data.resposta;
            }
        },
        verificarTentativa: function (tentativa) {
            if (tentativa !== 0) {
                return data.tentativas = tentativa - 1;
            } else {
                return data.tentativas;
            }
        },
        verificarPontos: function (pontos) {
            if (data.tentativas === 0 && pontos !== data.pontos) {
                data.pontos = pontos - 20;
                return data.pontos;
            } else {
                return pontos;
            }
        }
    };
});

appModule.factory('dicas', function () {
    var data = [];
    var dicas = [];
    var pontosDicas = [ 10, 10, 10 ];
    return {
        setDicas: function (dica) {
            data = dica;
        },
        getDicas: function () {
            return data;
        },
        tirarPontos: function (index) {
            var pontos = 0;
            if (index === 0 && pontosDicas[0] === 10) {
                pontos = pontosDicas[0];
                pontosDicas[0] = 0;
                return pontos;
            }
            if (index === 1 && pontosDicas[1] === 10) {
                pontos = pontosDicas[1];
                pontosDicas[1] = 0;
                return pontos;
            }
            if (index === 2 && pontosDicas[2] === 10) {
                pontos = pontosDicas[2];
                pontosDicas[2] = 0;
                return pontos;
            }
            return pontos;
        },
        getDica: function (tentativas) {
            switch (tentativas) {
                case 3:
                    dicas[0] = data[0];
                    return dicas;
                    break;
                case 2:
                    dicas[0] = data[0];
                    dicas[1] = data[1];
                    return dicas;
                    break;
                case 1:
                    dicas[0] = data[0];
                    dicas[1] = data[1];
                    dicas[2] = data[2];
                    return dicas;
                    break;
                default:
                    return data;
            }
        }
    };
});

appController.controller('JavaController', function ($scope, $modal, $log, usuario, Modulo, Usuario, exercicios, resposta, dicas) {

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/java");

    $scope.exercicioJava = {};
    var codigo = "";

    var exercicio = exercicios.getExercicios();
    var ex = exercicios.getProxEx();
    Modulo.get({modulo: 'java', exercicio: exercicio[ex].id}, function (data) {
        $scope.exercicioJava = data;
        $scope.modulo = data.assunto.modulo;
        codigo = $scope.exercicioJava.codigoReferencia;
        editor.setValue(codigo);
        dicas.setDicas($scope.exercicioJava.dicas);
    });
    
    $scope.enviarResposta = function (size) {
        codigo = editor.getSession().getValue();
        Modulo.save({
            modulo: 'java',
            exercicio: exercicio[ex].id
        }, {
            codigo: codigo
        }).$promise.then(function (data) {
                // success
                $scope.retornoJava = data;

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ModalInstanceCtrlJava,
                    size: size,
                    resolve: {
                        respostaEx: function () {
                            return $scope.retornoJava.resposta;
                        },
                        exercicio: function () {
                            return $scope.exercicioJava;
                        }
                    }
                });

                modalInstance.result.then(function (resultado) {
                    if (resultado.fim === true) {
                    	exercicios.setProxEx(0);
                        resultado.location.path('/modulos');
                    } else {
                        resultado.location.path('/uml/exercicios');
                    }

                }, function (pontos) {
                    $scope.exercicioJava.tentativas = resposta
                        .verificarTentativa($scope.exercicioJava.tentativas);
                    $scope.exercicioJava.pontos = resposta
                        .verificarPontos($scope.exercicioJava.pontos);
                    $scope.exercicioJava.pontos -= pontos;
                });
            }, function (errResponse) {
                // fail
            });

    };
});

var ModalInstanceCtrlJava = function ($scope, $location, $position, $modalInstance, Usuario, Progresso, usuario, resposta, exercicios, respostaEx, exercicio, dicas) {

    $scope.resultado = {
        fim: false,
        erro: false,
        location: $location
    };
    $scope.modal = {
        alert: "",
        mensagem: ""
    };
    $scope.exercicio = exercicio;
    $scope.exercicio.dicas = dicas.getDica(exercicio.tentativas);

    var pontos = 0;
    var retorno = resposta.verificarResposta(exercicio.respostaJava, respostaEx);
    if (retorno === true) {
        Usuario.save({
            login: usuario.getUsuario().login,
            exercicioId: $scope.exercicio.id
        }, {
            pontos: exercicio.pontos
        });
        if (exercicios.salvarConquista()) {
            $scope.modal.alert = "success";
            $scope.modal.mensagem = "Parabéns! você chegou ao fim dos exercicios";
            $scope.resultado.fim = true;
        } else {
            $scope.modal.alert = "success";
            $scope.modal.mensagem = "Parabéns você acertou!";
            $scope.resultado.fim = false;
        }
    } else {

        $scope.resultado.erro = true;
        $scope.modal.alert = "danger";
        $scope.modal.mensagem = "Que pena você errou!";

    }
    $scope.tirarPontos = function (index) {
        pontos += dicas.tirarPontos(index, $scope.exercicio.pontos);
    };

    $scope.ok = function () {
        $modalInstance.close($scope.resultado);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss(pontos);
    };
};

appController.controller('UmlController', function ($scope, $modal, $log, usuario, Modulo, Usuario, exercicios, resposta, dicas) {

    $scope.usuario = usuario.getUsuario();
    $scope.resposta = "";
    $scope.respostaUml = {};
    var exercicio = exercicios.getExercicios();
    var ex = exercicios.getProxEx();
    Modulo.get({
        modulo: 'uml',
        exercicio: exercicio[ex].id
    }, function (data) {
        $scope.exercicio = data;
        $scope.alternativa = data.alternativas;
        $scope.modulo = data.assunto.modulo;
        $scope.exercicio.dicas = [ "Teste1", "Teste2", "Teste3" ];
        dicas.setDicas($scope.exercicio.dicas);
    });
    
    
    $scope.enviarResposta = function (size) {    
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrlUml,
            size: size,
            resolve: {
                respostaEx: function () {
                    return $scope.resposta;
                },
                exercicio: function () {
                    return $scope.exercicio;
                }
            }
        });

        modalInstance.result.then(function (resultado) {
            if (resultado.fim === true) {
            	exercicios.setProxEx(0);
                resultado.location.path('/modulos');
            } else {
                resultado.location.path('/uml/exercicios');
            }

        }, function (pontos) {
            $scope.exercicio.tentativas = resposta
                .verificarTentativa($scope.exercicio.tentativas);
            $scope.exercicio.pontos = resposta
                .verificarPontos($scope.exercicio.pontos);
            $scope.exercicio.pontos -= pontos;
        });
    };

});

var ModalInstanceCtrlUml = function ($scope, $location, $position, $modalInstance, Usuario, Progresso,
                                     usuario, resposta, exercicios, respostaEx, exercicio, dicas) {

    $scope.resultado = {
        fim: false,
        erro: false,
        location: $location
    };
    $scope.modal = {
        alert: "",
        mensagem: ""
    };
    $scope.exercicio = exercicio;
    $scope.exercicio.dicas = dicas.getDica(exercicio.tentativas);

    var pontos = 0;
    var retorno = resposta.verificarResposta(exercicio.respostaUml, respostaEx);
    if (retorno === true) {
        Usuario.save({
            login: usuario.getUsuario().login,
            exercicioId: $scope.exercicio.id
        }, {
            pontos: exercicio.pontos
        });
        if (exercicios.salvarConquista()) {
            $scope.modal.alert = "success";
            $scope.modal.mensagem = "Parabéns! você chegou ao fim dos exercicios";
            $scope.resultado.fim = true;
        } else {
            $scope.modal.alert = "success";
            $scope.modal.mensagem = "Parabéns você acertou!";
            $scope.resultado.fim = false;
        }
    } else {

        $scope.resultado.erro = true;
        $scope.modal.alert = "danger";
        $scope.modal.mensagem = "Que pena você errou!";

    }
    $scope.tirarPontos = function (index) {
        pontos += dicas.tirarPontos(index, $scope.exercicio.pontos);
    };

    $scope.ok = function () {
        $modalInstance.close($scope.resultado);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss(pontos);
    };
};