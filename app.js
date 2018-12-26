const express = require('express'); //принимает имя модуля и возвращает его
const app = express(); //записываем результат вызова функции express
const bodyParser = require("body-parser").json; //body-parser извлекает всю часть тела входящего потока запросов и предоставляет его на req.body
const MongoClient = require("mongodb").MongoClient; //класс
const objectId = require("mongodb").ObjectID;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
 
app.use(bodyParser());

app.get('/users', function(req, res) {
  const collection = req.app.locals.collection;
  collection.find({}).toArray(function(err,users){
    if(err){
      console.log(err);
  }
  res.send(users);
  });
});

app.get('/users/:id', function(req, res) {
  const collection = req.app.locals.collection;
  const id = new objectId(req.params.id);

  collection.findOne({_id:id},function(err,user){
    if(err){
      console.log(err);
    }

    if (!user) {
      return res.status(404).end();
    }
    res.send(user);
    });
 });
  
  

app.delete('/users/:id',function(req,res) {

  const collection = req.app.locals.collection;
  const id = new objectId(req.params.id);
  
  collection.deleteOne({_id:id},function(err, result){

    if (result.deletedCount !== 1) {
      return res.status(400).end();
    }

    res.status(204).end();
  });
});
  

app.put('/users/:id', function(req,res){

  const user = {
    name: req.body.name,
    age: req.body.age,
  };
  const collection = req.app.locals.collection;
  const id = new objectId(req.params.id);
  collection.findOneAndUpdate(
    {_id: id}, 
    { $set: user},
    { returnOriginal: false },
    function(err, result){
      console.log(result);
      res.send(result.value);
    });
   
});

app.post('/users', function(req,res){
  if(!req.body) return res.sendStatus(400);

  let user = {
    name: req.body.name,
    age: req.body.age,
  };

  const collection = req.app.locals.collection;
  collection.insertOne(user,function(err,result){
    if(err){
      return console.log(err);
    }
    res.send(user);
  });

});

mongoClient.connect(function(err,client){  //подключаемся к бд
  if(err){
      console.log(err);
  }
  app.locals.collection = client.db("users_db").collection("users"); //получаем ссылку на коллекцию в локальную переменную
  dbClient = client; //сохраняем подключение в переменную
  app.listen(3000, function(){
      console.log("Слушаем порт 3000");
  });
});



