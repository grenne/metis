package com.TKiDe.services;

import org.codehaus.jackson.annotate.JsonCreator;


public class Usuario {

	public Usu usu;

	public Usuario() {

	}

	public Usuario(Usu usu) {
		this.usu = usu;
	}

	public void setUsu( Usu usu) {
		this.usu = usu;
	}

	public Usu getUsu() {
		return this.usu;
	}

	@Override
	public String toString() {
		return new StringBuffer(" Usu : ").append(this.usu).toString();
	}

	public static final class Usu {

		public String id;
		public String usuario;
		public String nome;
		public String senha;
		public String administrador;
		public String distribuidor;
		
		public Documento documento;


		public Usu() {

		}

		@JsonCreator
		public Usu(String id, String usuario, String nome, String senha, String administrador, String distribuidor, Documento documento) {
			this.id = id;
			this.usuario = usuario;
			this.nome = nome;
			this.senha = senha;
			this.administrador = administrador;
			this.distribuidor = distribuidor;
			this.documento = documento;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getId() {
			return this.id;
		}

		@Override
		public String toString() {
			return new StringBuffer(" Id : ").append(this.id).append(" tipo : ").append(this.usuario).toString();
		}



		public static final class Documento {
			public String numero;
			public String valor;
			public Tipo[] tipo;

			public Documento() {

			}

			@JsonCreator
			public Documento(Tipo[] tipo) {
				this.tipo = tipo;
			}

			public static final class Tipo {
				public String label;
                public String mascara;
       

                public Tipo() {

    			}

                @JsonCreator
                public Tipo(String label, String mascara){
                    this.label = label;
                    this.mascara = mascara;
                }
            }

		}
	}
}
