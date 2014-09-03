package com.unigranrio.tcc.control;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.unigranrio.tcc.dao.AssuntoDAO;
import com.unigranrio.tcc.dao.ExercicioDAO;
import com.unigranrio.tcc.dao.ModuloDAO;
import com.unigranrio.tcc.dao.NivelDAO;
import com.unigranrio.tcc.dao.UsuarioDAO;
import com.unigranrio.tcc.model.Alternativa;
import com.unigranrio.tcc.model.entity.Assunto;
import com.unigranrio.tcc.model.entity.ExercicioJava;
import com.unigranrio.tcc.model.entity.ExercicioUml;
import com.unigranrio.tcc.model.entity.ImagemExercicio;
import com.unigranrio.tcc.model.entity.Modulo;
import com.unigranrio.tcc.model.entity.Nivel;

@Transactional
@Controller
public class CRUDControle {

	private UsuarioDAO usuarioDAO = new UsuarioDAO();
	private NivelDAO nivelDAO = new NivelDAO();
	private AssuntoDAO assuntoDAO = new AssuntoDAO();
	private ModuloDAO moduloDAO = new ModuloDAO();
	private ExercicioDAO exercicioDAO = new ExercicioDAO();

	@Autowired
	public void setDAOs(UsuarioDAO usuarioDAO, NivelDAO nivelDAO,
			AssuntoDAO assuntoDAO, ModuloDAO moduloDAO,
			ExercicioDAO exercicioDAO) {
		this.usuarioDAO = usuarioDAO;
		this.nivelDAO = nivelDAO;
		this.assuntoDAO = assuntoDAO;
		this.moduloDAO = moduloDAO;
		this.exercicioDAO = exercicioDAO;
	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public void receberRespostaExercicio() {
		// buscarModulo();
		// alterarModulo();
		// inserirNivel();
		//cadastrarExercicio();
		//inserirExercicioJava();
	}

	
	
	 
	
	public void inserirExercicioJava(){
		ArrayList<String> dicas = new  ArrayList<String>();
		dicas.add("Use as dicas quando estiver com dificuldade de resolver algum exercicio");
		dicas.add("Mas cuidado, cada uso de dica diminui 10 pontos do exercicio");
		dicas.add("E se ultrapassar o número de tentativas perde 20 pontos do exercicio.");
		
		ExercicioJava exJava = new ExercicioJava();
		exJava.setNome("Exercicio 1: Olá Mundo");
		exJava.setDescricao(" O seu primeiro programa é bem simples,"
				+ " digite dentro dos parênteses no comando Java ao lado a frase junto com as aspas duplas \"Olá Mundo\"."
                + " Clique no botão “Enviar” e veja o resultado da execução do seu primeiro programa");
		exJava.setTentativas(3);
		exJava.setPontos(130);
		exJava.setDicas(dicas);
		exJava.setCodigoReferencia("System.out.println();");
		exJava.setAssunto(assuntoDAO.buscarAssuntoByNome("Primeiro Programa"));
		exJava.setRespostaJava("Olá Mundo");
		
		exercicioDAO.gravarExercicioJava(exJava);
	}

	public void buscarModulo() {
		Modulo modulo0 = moduloDAO
				.buscarModuloByNome("Conceitos de Orientação a Objeto com Java");
		for (Assunto assunto : modulo0.getAssuntos()) {
			System.out.println("ID: " + assunto.getId());
			System.out.println("Nome: " + assunto.getNome());
		}
	}

	public void cadastrarExercicio() {
		ImagemExercicio imExA = new ImagemExercicio();
		imExA.setId((long) 1);
		imExA.setNomeImagem("alternativaA.png");
		imExA.setCaminhoImagem("imagens/exercicios/uml/diagrama_de_caso_de_uso/exercicio1");

		ImagemExercicio imExB = new ImagemExercicio();
		imExB.setId((long) 2);
		imExB.setNomeImagem("alternativaB.png");
		imExB.setCaminhoImagem("imagens/exercicios/uml/diagrama_de_caso_de_uso/exercicio1");

		ImagemExercicio imExC = new ImagemExercicio();
		imExC.setId((long) 3);
		imExC.setNomeImagem("alternativaC.png");
		imExC.setCaminhoImagem("imagens/exercicios/uml/diagrama_de_caso_de_uso/exercicio1");

		ImagemExercicio imExD = new ImagemExercicio();
		imExD.setId((long) 4);
		imExD.setNomeImagem("alternativaD..png");
		imExD.setCaminhoImagem("imagens/exercicios/uml/diagrama_de_caso_de_uso/exercicio1");

		exercicioDAO.gravarImagemExercicio(imExA);
		exercicioDAO.gravarImagemExercicio(imExB);
		exercicioDAO.gravarImagemExercicio(imExC);
		exercicioDAO.gravarImagemExercicio(imExD);

		HashMap<Alternativa, ImagemExercicio> alternativas = new HashMap<Alternativa, ImagemExercicio>();
		alternativas.put(Alternativa.A, imExA);
		alternativas.put(Alternativa.B, imExB);
		alternativas.put(Alternativa.C, imExC);
		alternativas.put(Alternativa.D, imExD);

		ExercicioUml exUml = new ExercicioUml();
		exUml.setNome("Exercicio 1");
		exUml.setDescricao("Qual desses desenhos representa corretamente um ator do sistema.");
		exUml.setAssunto(assuntoDAO
				.buscarAssuntoByNome("Diagrama de Casos de Uso"));
		exUml.setAlternativas(alternativas);
		exUml.setRespostaUml(Alternativa.B);

		exercicioDAO.gravarExercicioUml(exUml);

	}

	public void alterarModulo() {

		Modulo modulo2 = moduloDAO.buscarModuloById(3);
		modulo2.setAssuntos(assuntoDAO.listarAssuntosByModulo(modulo2));
		moduloDAO.alterarModulo(modulo2);

	}

	public void inserirNivel() {
		Nivel nivel1 = new Nivel();
		nivel1.setNome("Novato");
		nivel1.setPontos(0);

		Nivel nivel2 = new Nivel();
		nivel2.setNome("Programador");
		nivel2.setPontos(500);

		Nivel nivel3 = new Nivel();
		nivel3.setNome("Ninja");
		nivel3.setPontos(1000);

		Nivel nivel4 = new Nivel();
		nivel4.setNome("Experiente");
		nivel4.setPontos(2000);

		Nivel nivel5 = new Nivel();
		nivel5.setNome("Javaman");
		nivel5.setPontos(2500);

		nivelDAO.gravarNivel(nivel1);
		nivelDAO.gravarNivel(nivel2);
		nivelDAO.gravarNivel(nivel3);
		nivelDAO.gravarNivel(nivel4);
		nivelDAO.gravarNivel(nivel5);
	}
}