var mongo = require('mongodb')
    ,BSON = mongo.BSONPure

var ObjectId = function(id) {
	return new BSON.ObjectID(id)
}

var ISODate = function(dt) {
	return new Date(dt)
}

var NumberInt = function(x) {
	return parseInt(x)
}



exports.dump = function(db, user, pass) {
/** admin_templates indexes **/
db.collection("admin_templates").ensureIndex({
  "_id": 1
},[
  
],function(){});


db.collection("admin_templates").insert({
   "name": "Index",
   "blocks": "",
   "tpl": "index.tpl",
   "controller": "",
   "indx": NumberInt(1),
   "ctime": ISODate("2015-11-02T21:48:34.47Z"),
   "mtime": ISODate("2015-11-02T21:48:34.47Z"),
   "maker": ObjectId("52474ba2ec861f270a000001"),
   "stime": 1446500914047,
   "ltime": null,
   "_id": ObjectId("5637da27f08066bb37d3f8ef") 
},function(){});




/** admin_users indexes **/
db.collection("admin_users").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** groups indexes **/
db.collection("groups").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** groups indexes **/
db.collection("groups").ensureIndex({
  "name": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "date": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "model": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "actionType": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "user": 1
},[
  
],function(){});

/** mainmenu indexes **/
db.collection("mainmenu").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "title": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "datepubl": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "dateunpubl": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "ontop": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "descript": 1
},[
  
],function(){});

/** pages indexes **/
db.collection("pages").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** admin_users records **/
db.collection("admin_users").insert({
  "_id": ObjectId("52474ba2ec861f270a000001"),
  "login": user,
  "pass": pass,
  "sets": {},
  "superuser": true
},function(){});

/** groups records **/
db.collection("groups").insert({
  "_id": ObjectId("524825d5e3f8c2c40a000001"),
  "description": "",
  "modelAccess": {},
  "mtime": ISODate("2013-09-29T13:06:41.348Z"),
  "name": "Администраторы",
  "pagesAccess": [
    
  ]
},function(){});

/** pages records **/
db.collection("pages").insert({
  "_id": ObjectId("524825755e2bda6409000001"),
  "tpl": ObjectId("5637da27f08066bb37d3f8ef"),
  "access": false,
  "alias": "",
  "blocks": [],
  "dir": "\/",
  "leaf": false,
  "map": false,
  "metadesctiption": "",
  "metakeywords": "",
  "metatitle": "",
  "mtime": ISODate("2013-10-03T12:15:24.817Z"),
  "name": "Homepage",
  "parents": null,
  "root": true,
  "tpl": ""
},function(){});

db.collection("pages").insert({
  "pid": ObjectId("524825755e2bda6409000001"),
  "parents": [
    ObjectId("524825755e2bda6409000001")
  ],
  "tpl": ObjectId("5637da27f08066bb37d3f8ef"),
  "name": "News",
  "metatitle": "",
  "metadesctiption": "",
  "metakeywords": "",
  "dir": "\/news\/",
  "alias": "news",
  "mtime": ISODate("2015-11-02T21:49:03.738Z"),
  "blocks": [
    {
      "id": "c2af8d1e-0c73-f23d-c7a2-5640c66ce222",
      "block": "1",
      "lng": null,
      "controller": "Crm.site.news.controller.News.show",
      "descript": null,
      "text": null
    }
  ],
  "access": false,
  "map": false,
  "indx": NumberInt(0),
  "og_desctiption": "",
  "og_title": "",
  "nav_top": false,
  "nav_bottom": false,
  "nav_lng": false,
  "locales": [
    
  ],
  "ctime": ISODate("2015-11-02T21:49:03.738Z"),
  "maker": ObjectId("52474ba2ec861f270a000001"),
  "stime": 1446500943738,
  "ltime": null
},function(){});

}