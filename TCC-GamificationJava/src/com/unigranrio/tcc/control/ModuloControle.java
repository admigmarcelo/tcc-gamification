package com.unigranrio.tcc.control;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.unigranrio.tcc.dao.ModuloDAO;
import com.unigranrio.tcc.model.AssuntoBean;
import com.unigranrio.tcc.model.ModuloBean;
import com.unigranrio.tcc.model.entity.Assunto;
import com.unigranrio.tcc.model.entity.Modulo;

@Controller
public class ModuloControle {

	private ModuloDAO moduloDAO = new ModuloDAO();

	@RequestMapping(value = "/modulos/get", method = RequestMethod.GET)
	public @ResponseBody
	ArrayList<ModuloBean> listarModulos() {
		ArrayList<ModuloBean> modulosBean = new ArrayList<ModuloBean>();
		
		for (Modulo modulo : moduloDAO.listarModulos()) {
			ModuloBean moduloBean = new ModuloBean();
			List<AssuntoBean> assuntosBean = new ArrayList<AssuntoBean>();
			AssuntoBean assuntoBean = new AssuntoBean();

			moduloBean.setId(modulo.getId());
			moduloBean.setNome(modulo.getNome());
			for (Assunto assunto : modulo.getAssuntos()) {
				assuntoBean.setId(assunto.getId());
				assuntoBean.setNome(modulo.getNome());
				assuntosBean.add(assuntoBean);
			}
			moduloBean.setAssuntos(assuntosBean);
			modulosBean.add(moduloBean);
		}
		return modulosBean;
	}

}