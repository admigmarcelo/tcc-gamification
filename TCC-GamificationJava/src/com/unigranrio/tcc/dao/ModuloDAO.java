package com.unigranrio.tcc.dao;

import java.util.List;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.unigranrio.tcc.model.entity.Modulo;

public class ModuloDAO {

	public void gravarModulo(Modulo modulo) {

		Connection.openConnection();
		Connection.getConnection().getTransaction().begin();
		Connection.getConnection().persist(modulo);
		Connection.getConnection().getTransaction().commit();

		Connection.closeConnection();
	}

	public void alterarModulo(Modulo modulo) {

		Connection.openConnection();
		Connection.getConnection().getTransaction().begin();
		Connection.getConnection().merge(modulo);
		Connection.getConnection().getTransaction().commit();

		Connection.closeConnection();
	}

	public Modulo buscarModuloByNome(String nome) {

		Connection.openConnection();
		CriteriaBuilder cb = Connection.getConnection().getCriteriaBuilder();
		CriteriaQuery<Modulo> c = cb.createQuery(Modulo.class);
		Root<Modulo> root = c.from(Modulo.class);
		root.fetch("assuntos", JoinType.LEFT);
		c.select(root).distinct(true);

		Predicate predicate = cb.equal(root.get("nome"), nome);
		c.where(predicate);

		TypedQuery<Modulo> query = Connection.getConnection().createQuery(c);
		Modulo modulo = query.getSingleResult();

		Connection.closeConnection();
		return modulo;
	}
	
	public List<Modulo> listarModulos() {

		Connection.openConnection();
		CriteriaBuilder cb = Connection.getConnection().getCriteriaBuilder();
		CriteriaQuery<Modulo> c = cb.createQuery(Modulo.class);
		Root<Modulo> root = c.from(Modulo.class);
		root.fetch("assuntos", JoinType.LEFT);
		c.select(root).distinct(true);

		TypedQuery<Modulo> query = Connection.getConnection().createQuery(c);
		List<Modulo> modulos = query.getResultList();
		Connection.closeConnection();
		return modulos;
	}
}