package com.unigranrio.tcc.control;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.unigranrio.tcc.dao.ConquistaDAO;
import com.unigranrio.tcc.dao.ExercicioDAO;
import com.unigranrio.tcc.dao.ProgressoDAO;
import com.unigranrio.tcc.dao.UsuarioDAO;
import com.unigranrio.tcc.exercicio.Programa;
import com.unigranrio.tcc.model.ConquistaBean;
import com.unigranrio.tcc.model.ExercicioJavaBean;
import com.unigranrio.tcc.model.ExercicioUmlBean;
import com.unigranrio.tcc.model.RespostaBean;
import com.unigranrio.tcc.model.UsuarioBean;
import com.unigranrio.tcc.model.entity.Assunto;
import com.unigranrio.tcc.model.entity.Conquista;
import com.unigranrio.tcc.model.entity.Exercicio;
import com.unigranrio.tcc.model.entity.ExercicioJava;
import com.unigranrio.tcc.model.entity.ExercicioUml;
import com.unigranrio.tcc.model.entity.Progresso;
import com.unigranrio.tcc.model.entity.Usuario;

@Transactional
@Controller
public class ExercicioControle {

	private Programa programa = new Programa();
	private ExercicioDAO exercicioDAO = new ExercicioDAO();
	private UsuarioDAO usuarioDAO = new UsuarioDAO();
	private ConquistaDAO conquistaDAO = new ConquistaDAO();
	private ProgressoDAO progressoDAO = new ProgressoDAO();
	private RespostaBean retornoJava = new RespostaBean();

	@Autowired
	public void setDAOs(
			ExercicioDAO exercicioDAO, UsuarioDAO usuarioDAO,
			ConquistaDAO conquistaDAO, ProgressoDAO progressoDAO) {
		this.exercicioDAO = exercicioDAO;
		this.usuarioDAO = usuarioDAO;
		this.conquistaDAO = conquistaDAO;
		this.progressoDAO = progressoDAO;
	}

	@RequestMapping(value = "/modulo/java/assunto/exercicio/{exercicioJava}", method = RequestMethod.GET)
	public @ResponseBody ExercicioJavaBean getExercicioJava(
			@PathVariable long exercicioJava) {
		ExercicioJava exJava = exercicioDAO
				.buscarExercicioJavaById(exercicioJava);
		ExercicioJavaBean exJavaBean = exJava.getExercicioJavaBean();

		return exJavaBean;
	}

	@RequestMapping(value = "/modulo/java/assunto/exercicio/{exercicioJava}", method = RequestMethod.POST)
	public @ResponseBody RespostaBean receberRespostaExercicioJava(
			@RequestBody RespostaBean codigo) {
		System.out.println("Codigo Recebido: " + codigo.getCodigo());

		String respostaConsole = programa.executar(codigo.getCodigo());
		System.out.println("Resposta da Compilação: " + respostaConsole);

		retornoJava.setResposta(respostaConsole);
		return retornoJava;
	}

	@RequestMapping(value = "/modulo/uml/assunto/exercicio/{exercicioUml}", method = RequestMethod.GET)
	public @ResponseBody ExercicioUmlBean getExercicioUml(
			@PathVariable long exercicioUml) {

		ExercicioUml exUml = exercicioDAO.buscarExercicioUmlById(exercicioUml);
		ExercicioUmlBean exUmlBean = exUml.getExercicioUmlBean();
		exUmlBean.setAlternativas(exUml.getAlternativasBean());

		return exUmlBean;
	}

	@RequestMapping(value = "/modulo/assunto/{assuntoId}/exercicio/{exercicio}", method = RequestMethod.GET)
	public @ResponseBody List<ConquistaBean> listarBadges(
			@PathVariable long assuntoId, @PathVariable long exercicio) {
		List<ConquistaBean> conquistasBean = new ArrayList<ConquistaBean>();
		Assunto assunto = new Assunto();
		assunto.setId(assuntoId);

		for (Conquista conquista : conquistaDAO.listarBadges(assunto)) {
			ConquistaBean conquistaBean = conquista.getConquistaBean();
			conquistasBean.add(conquistaBean);
		}
		return conquistasBean;
	}

	@RequestMapping(value = "/usuario/{login}", method = RequestMethod.PUT)
	public @ResponseBody RespostaBean atualizarBadgeUsuario(
			@PathVariable String login, @RequestBody ConquistaBean conquistaBean) {
		Collection<Conquista> conquistas = new HashSet<Conquista>();
		
		Conquista conquista = conquistaDAO.buscarBadge(conquistaBean.getId());
		Usuario usuario = usuarioDAO.buscarUsuarioByLogin(login);
		if (!usuarioDAO.listarBadgesUsuario(login).isEmpty()) {
			conquistas = usuarioDAO.listarBadgesUsuario(login);

		}
		if (!conquistas.contains(conquista)) {
			conquistas.add(conquista);
		}
		conquista.setUsuario(usuario);
		usuario.setBadges(conquistas);
		
		conquistaDAO.atualizarConquista(conquista);
		usuarioDAO.atualizarProgressoUsuario(usuario);	

		return null;
	}

	@RequestMapping(value = "/usuario/{login}", method = RequestMethod.POST)
	public @ResponseBody RespostaBean atualizarUsuario(
			@PathVariable String login, @RequestParam("exercicioId") long exercicioId, @RequestBody UsuarioBean pontos) {
		Usuario usuario = usuarioDAO.buscarUsuarioByLogin(login);
		usuario.setPontos(usuario.getPontos() + pontos.getPontos());
		usuarioDAO.atualizarPontosUsuario(usuario);

		Usuario usuarioAtualizado = usuarioDAO.buscarUsuarioByLogin(login);
		Exercicio exercicio = exercicioDAO.buscarExercicioById(exercicioId);
		Progresso progresso = new Progresso();
		progresso.setExercicio(exercicio);
		progresso.setUsuario(usuarioAtualizado);
		progressoDAO.gravarProgresso(progresso);
		
		List<Progresso> progressos = new LinkedList<Progresso>();
		if(!usuarioDAO.listarProgressosUsuario(login).isEmpty()){
			progressos = usuarioDAO.listarProgressosUsuario(login);
			progressos.add(progressoDAO.buscarProgressoByUsuario(usuarioAtualizado));
		}else{
			progressos.add(progressoDAO.buscarProgressoByUsuario(usuarioAtualizado));
		}
		long posicao = usuarioDAO.buscarPosicaoUsuario(usuarioAtualizado
				.getPontos());
		usuarioAtualizado.setPosicao((int) posicao);
		usuarioAtualizado.setProgressos(progressos);
		usuarioDAO.atualizarProgressoUsuario(usuarioAtualizado);

		return null;
	}
}
