const express = require("express");
const app = express(); // результат вызова функции express
const bodyParser = require("body-parser").json; //body-parser извлекает всю часть тела входящего потока запросов и предоставляет его на req.body
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userScheme = new Schema ({
  name:  String,
  age: Number
}, {
  versionKey: false
});
const User = mongoose.model("User", userScheme); //создаем модель пользователя с названием User

app.use(bodyParser());

app.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if(err){
      console.log(err);
    }
    res.send(users);
  });
});

app.get('/users/:id', function(req, res) {

  const id = req.params.id;

  User.findOne({_id: id}, function(err, user){
    if(err){
      console.log(err);
    }

    if (!user) {
      return res.status(404).end();
    }

    res.send(user);
    });
 });

app.delete('/users/:id', function(req, res) {

  const id = req.params.id;

  User.findByIdAndDelete(id, function(err, result) {
    if (err) {
      return res.status(400).end();
    }

    res.status(204).end();
  });
});

app.put('/users/:id', function(req,res) {

  const userName = req.body.name;
  const userAge = req.body.age;
  const id = req.params.id;

  User.findOneAndUpdate({_id: id}, {name: userName, age: userAge}, {new: true}, function(err, user) {
    if(err) {
      return console.log(err);
    }

    res.send(user);
  });
});

app.post('/users', function(req,res){

  if(!req.body) {
    return res.sendStatus(400);
  }

  const userName = req.body.name;
  const userAge = req.body.age;
  const newUser = new User({name: userName, age: userAge});

  newUser.save(function(err, result){
    if(err){
      return console.log(err);
    }
    res.send(newUser);
  });
});

mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true }, function(err){  //подключаемся к бд
  if (err) {
      console.log(err);
  }

  app.listen(3000, function(){
      console.log("Слушаем порт 3000");
  });
});
