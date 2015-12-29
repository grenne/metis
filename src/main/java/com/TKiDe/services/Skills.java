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
@Path("/skill")
public class Skills {

	@Path("/obter")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject ObterDiagrama(@QueryParam("usuario") String usuario)  {
		Mongo mongo;
		try {
			mongo = new Mongo();
			DB db = (DB) mongo.getDB("documento");
			DBCollection collection = db.getCollection("skills");
			BasicDBObject searchQuery = new BasicDBObject("skill.usuario",usuario);
			DBObject cursor = collection.findOne(searchQuery);
			JSONObject documento = new JSONObject();
			try {
				BasicDBObject obj = (BasicDBObject) cursor.get("skill");
				documento.put("skill", obj);
				mongo.close();
				return documento;
			} catch (MongoException e) {
				// TODO Auto-generated catch block
				System.out.println("MongoException");
			}
			return documento;
		} catch (UnknownHostException e1) {
			// TODO Auto-generated catch block
			System.out.println("UnknownHostException");
		} catch (MongoException e1) {
			// TODO Auto-generated catch block
			System.out.println("MongoException");
		};
		JSONObject documento = new JSONObject();
		return documento;
	};
	@Path("/incluir")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String IncluirUsuario(AssociaSkill doc)  {
		Mongo mongo;
		try {
			mongo = new Mongo();
			DB db = (DB) mongo.getDB("documento");
			DBCollection collection = db.getCollection("skills");
			Gson gson = new Gson();
			String jsonDocumento = gson.toJson(doc);
			Map<String,String> mapJson = new HashMap<String,String>();
			ObjectMapper mapper = new ObjectMapper();
			mapJson = mapper.readValue(jsonDocumento, HashMap.class);
			JSONObject documento = new JSONObject();
			documento.putAll(mapJson);
			DBObject insert = new BasicDBObject(documento);
			collection.insert(insert);
			//
			// 			atualiza o id interno até eu descobrir como não precisar dele
			//
			doc.skill.id = insert.get("_id").toString();
			ObjectId _id = new ObjectId(insert.get("_id").toString());
			jsonDocumento = gson.toJson(doc);
			mapJson = mapper.readValue(jsonDocumento, HashMap.class);
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
			return insert.get("_id").toString();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			System.out.println("UnknownHostException");
			e.printStackTrace();
		} catch (MongoException e) {
			// TODO Auto-generated catch block
			System.out.println("MongoException");
			e.printStackTrace();
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			System.out.println("JsonParseException");
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			System.out.println("JsonMappingException");
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("IOException");
			e.printStackTrace();
		}
		return "fail";
		
	};

	@Path("/atualizar")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response AtualizarDocumento(AssociaSkill doc) throws MongoException, JsonParseException, JsonMappingException, IOException {
		ObjectId _id = new ObjectId(doc.skill.id.toString());
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("skills");
		Gson gson = new Gson();
		String jsonDocumento = gson.toJson(doc);
		System.out.println("Atualizar - " + jsonDocumento);
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
	
};
