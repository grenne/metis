package com.TKiDe.services;

import org.codehaus.jackson.annotate.JsonCreator;

public class AssociaSkill {

	public Skill skill;

	public AssociaSkill() {

	}

	public AssociaSkill(Skill skill) {
		this.skill = skill;
	}

	public void setSkill( Skill skill) {
		this.skill = skill;
	}

	public Skill getSkill() {
		return this.skill;
	}

	@Override
	public String toString() {
		return new StringBuffer(" Skill : ").append(this.skill).toString();
	}

	public static final class Skill {

		public String id;
		public String usuario;
		public Skills[] skills;


		public Skill() {

		}

		@JsonCreator
		public Skill(String id, String usuario, Skills[] diagrama) {
			this.id = id;
			this.usuario = usuario;
			this.skills = skills;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getId() {
			return this.id;
		}

		public void setUsuario(String usuario) {
			this.usuario = usuario;
		}

		public String getUsuario() {
			return this.usuario;
		}

		@Override
		public String toString() {
			return new StringBuffer(" Id : ").append(this.id).append(" Diagrama : ").append(this.skills).toString();
		}



		public static final class Skills {
			public String tipo;
            public String label;
            public String id;

			public Skills() {

			}

			@JsonCreator
			public Skills(String tipo, String label, String id) {
                this.tipo = tipo;
                this.label = label;
                this.id = id;
			}
		}
	}
}