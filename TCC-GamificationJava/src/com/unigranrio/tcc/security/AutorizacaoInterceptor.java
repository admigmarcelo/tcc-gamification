package com.unigranrio.tcc.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class AutorizacaoInterceptor extends HandlerInterceptorAdapter {

//	@Override
//	public boolean preHandle(HttpServletRequest request,
//			HttpServletResponse response, Object controller) throws Exception {
//
//		String uri = request.getRequestURI();
//		System.out.println(uri);
//		if (uri.contains("resources/js/") || uri.contains("resources/css/")) {
//			return true;
//		}
//
//		if (request.getSession().getAttribute("usuarioLogado") != null) {
//			return true;
//		}
//
//		response.sendRedirect("/TCC-GamificationJava/resources/html/");
//		return false;
//	}
}