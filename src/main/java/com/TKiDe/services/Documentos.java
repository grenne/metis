package com.TKiDe.services;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.bson.types.ObjectId;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;

@Singleton
// @Lock(LockType.READ)
@Path("/documento")
public class Documentos {

	@Path("/login")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject login(@QueryParam("usuario") String usuario, @QueryParam("senha") String senha) throws UnknownHostException, MongoException {
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("usuarios");
		BasicDBObject setUsu = new BasicDBObject();
		setUsu.put("usu.usuario",usuario);
		setUsu.put("usu.senha",senha);
		DBObject cursor = collection.findOne(setUsu);
		JSONObject documento = new JSONObject();
		BasicDBObject obj = (BasicDBObject) cursor.get("usu");
		documento.put("usu", obj);
		mongo.close();
		return documento;
	};

	@Path("/lista")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray ObterLista(@QueryParam("usuario") String usuario, @QueryParam("queryUsuario") String queryUsuario, @QueryParam("situacao") String situacao ) throws UnknownHostException, MongoException, ParseException {

		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");

		BasicDBObject setQuery = new BasicDBObject();
		setQuery.put("documento.tipo", "dados");
		setQuery.append("documento.situacao", situacao);
		String teste = "documento.usuarios.codigo";
		setQuery.append(queryUsuario, usuario);
		DBCollection collection = db.getCollection("documentos");
		DBCursor cursor = collection.find(setQuery);
		cursor.sort(new BasicDBObject("documento.header[0].valor", 1));
		JSONArray documentos = new JSONArray();
		
		while (((Iterator<DBObject>) cursor).hasNext()) {
			JSONObject jsonObject; 
			JSONParser parser = new JSONParser(); 
			BasicDBObject obj = (BasicDBObject) ((Iterator<DBObject>) cursor).next();
			String _id = obj.getString("_id");
			String documento = obj.getString("documento");
			jsonObject = (JSONObject) parser.parse(documento);
			JSONArray header = (JSONArray) jsonObject.get("header");
			JSONObject jsonDocumento = new JSONObject();
			jsonDocumento.put("_id", _id);
			jsonDocumento.put("header", header);
			documentos.add(jsonDocumento);
		};
		mongo.close();
		return documentos;
	};
	
	@Path("/modelos")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray ObterModelos(@QueryParam("tipoLista") String tipo) throws UnknownHostException, MongoException, ParseException {

		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");

		BasicDBObject setQuery = new BasicDBObject();
		setQuery.put("documento.tipo", "modelo");
		if(tipo.equals("validos")){
			setQuery.put("documento.situacao", "valido");	
		};
		DBCollection collection = db.getCollection("documentos");
		DBCursor cursor = collection.find(setQuery);
		JSONArray documentos = new JSONArray();
		
		while (((Iterator<DBObject>) cursor).hasNext()) {
			JSONObject jsonObject; 
			JSONParser parser = new JSONParser(); 
			BasicDBObject obj = (BasicDBObject) ((Iterator<DBObject>) cursor).next();
			String documento = obj.getString("documento");
			jsonObject = (JSONObject) parser.parse(documento);
			JSONObject jsonDocumento = new JSONObject();
			jsonDocumento.put("_id", obj.getString("_id"));
			jsonDocumento.put("modelo", jsonObject.get("modelo"));
			jsonDocumento.put("situacao", jsonObject.get("situacao"));
			documentos.add(jsonDocumento);
		};
		mongo.close();
		return documentos;
	};

	@Path("/obter")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject ObterDocumento(@QueryParam("id") String id) throws UnknownHostException, MongoException {
		ObjectId _id = new ObjectId(id);
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
		BasicDBObject searchQuery = new BasicDBObject("_id",_id);
		DBObject cursor = collection.findOne(searchQuery);
		JSONObject documento = new JSONObject();
		BasicDBObject obj = (BasicDBObject) cursor.get("documento");
		documento.put("documento", obj);
		mongo.close();
		return documento;
	};
	
	@Path("/atualizar")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response AtualizarDocumento(Document doc) throws MongoException, JsonParseException, JsonMappingException, IOException {
		ObjectId _id = new ObjectId(doc.documento.id.toString());
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
		Gson gson = new Gson();
		String jsonDocumento = gson.toJson(doc);
		Map<String,String> mapJson = new HashMap<String,String>();
		ObjectMapper mapper = new ObjectMapper();
		mapJson = mapper.readValue(jsonDocumento, HashMap.class);
		JSONObject documento = new JSONObject();
		documento.putAll(mapJson);
		BasicDBObject update = new BasicDBObject("$set", new BasicDBObject(documento));
		BasicDBObject searchQuery = new BasicDBObject("_id",_id);
		DBObject cursor = collection.findAndModify(searchQuery,
                null,
                null,
                false,
                update,
                true,
                false);
		mongo.close();
		return Response.status(200).entity(doc).build();
	};

	
	@Path("/incluir")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response IncluirDocumento(Document doc) throws MongoException, JsonParseException, JsonMappingException, IOException {
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
		Gson gson = new Gson();
		String jsonDocumento = gson.toJson(doc);
		Map<String,String> mapJson = new HashMap<String,String>();
		ObjectMapper mapper = new ObjectMapper();
		mapJson = mapper.readValue(jsonDocumento, HashMap.class);
		JSONObject documento = new JSONObject();
		documento.putAll(mapJson);
		DBObject insert = new BasicDBObject(documento);
		collection.insert(insert);
		mongo.close();
		return Response.status(200).entity(doc).build();
	};
	
	@Path("/excluir")	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response ExcluirDocumento(@QueryParam("id") String id) throws UnknownHostException, MongoException {
		ObjectId _id = new ObjectId(id);
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
		BasicDBObject searchQuery = new BasicDBObject("_id",_id);
		collection.remove(searchQuery);
		mongo.close();
		return Response.status(200).entity(id).build();
	};
};
