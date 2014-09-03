package com.unigranrio.tcc.model.entity;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.unigranrio.tcc.model.AssuntoBean;
import com.unigranrio.tcc.model.ConquistaBean;
import com.unigranrio.tcc.model.ExercicioBean;

@Entity
public class Assunto {

	@Id
	@GeneratedValue
	private Long id;
	private String nome;

	@ManyToOne
	private Modulo modulo;

	@OneToMany
	private List<Exercicio> exercicios;

	@OneToMany
	private List<Conquista> conquistas;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Modulo getModulo() {
		return modulo;
	}

	public void setModulo(Modulo modulo) {
		this.modulo = modulo;
	}

	public List<Exercicio> getExercicios() {
		return exercicios;
	}

	public void setExercicios(List<Exercicio> exercicios) {
		this.exercicios = exercicios;
	}

	public List<Conquista> getConquistas() {
		return conquistas;
	}

	public void setConquistas(List<Conquista> conquistas) {
		this.conquistas = conquistas;
	}

	public List<ConquistaBean> getConquistasBean() {
		List<ConquistaBean> conquistasBean = new ArrayList<ConquistaBean>();
		for (Conquista conquista : conquistas) {
			ConquistaBean conquistaBean = new ConquistaBean();
			conquistaBean.setId(conquista.getId());
			conquistaBean.setAssunto(conquista.getAssunto().getAssuntoBean());
			conquistaBean.setBadge(conquista.getBadge().getBadgeBean());

			conquistasBean.add(conquistaBean);
		}

		return conquistasBean;
	}
	
	public List<ExercicioBean> getExercicioBean(){
		List<ExercicioBean> exerciciosBean = new LinkedList<ExercicioBean>();
		for(Exercicio exercicio : exercicios){
			ExercicioBean exercicioBean = exercicio.getExercicioBean();
			
			exerciciosBean.add(exercicioBean);
		}
		
		return exerciciosBean;
	}

	public AssuntoBean getAssuntoBean() {
		AssuntoBean assuntoBean = new AssuntoBean();
		assuntoBean.setId(id);
		assuntoBean.setNome(nome);
		assuntoBean.setModulo(modulo.getModuloBean());
		
		return assuntoBean;
	}

}