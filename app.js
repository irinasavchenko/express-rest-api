const express = require("express");
const app = express(); // результат вызова функции express
const bodyParser = require("body-parser").json; //body-parser извлекает всю часть тела входящего потока запросов и предоставляет его на req.body
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PENDING_FRIEND_REQUEST = 'pending';
const ACCEPTED_FRIEND_REQUEST = 'accepted';

const userScheme = new Schema ({
  name:  String,
  age: Number,
  friends: Array
}, {
  versionKey: false
});

const User = mongoose.model("User", userScheme); //создаем модель пользователя с названием User

const friendRequestScheme = new Schema({  //создаем тему запроса
  sender_id: Schema.Types.ObjectId,
  receiver_id: Schema.Types.ObjectId,
  status: {
    type: String,
    default: PENDING_FRIEND_REQUEST,
  }
},
 {
  versionKey: false
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestScheme); //создаем модель запроса

app.use(bodyParser());

app.get('/friend-requests', function(req, res) {
  FriendRequest.find({}, function(err, requests) {
    if(err){
      console.log(err);
    }
    res.send(requests);
  });
});

app.get('/friend-requests/:id', function(req, res){
  const id = req.params.id;
  FriendRequest.find({_id: id}, function(err, requests){
    if(err) {
      console.log(err);
    }
    res.send(requests);
  })
})

app.post('/friend-requests', function(req,res){

  if(!req.body) {
    return res.sendStatus(400);
  }

  const sender_id = req.body.sender_id;
  const receiver_id = req.body.receiver_id;

  const friendRequest = new FriendRequest({
    sender_id,
    receiver_id,
  });

  friendRequest.save(function(err, result){
    if(err){
      return console.log(err);
    }
    res.send(friendRequest);
  });
});

app.put('/friend-requests/:id', function(req, res) {

  const receivedStatus = req.body.status;

  FriendRequest.findOneAndUpdate({ _id: req.params.id }, { status: receivedStatus }, { new: true }, function(err, friendRequest) {
    if (friendRequest.status === ACCEPTED_FRIEND_REQUEST ) {
      User.find({ _id:  friendRequest.sender_id }, function (err, [user]) {

        if(err) {
          console.log(err);
        }

       user.friends.push(friendRequest.receiver_id);

        user.save(function (err, result) {
          if(err) {
            console.log(err);
          }
        });
      });

      User.find({ _id:  friendRequest.receiver_id }, function (err, [user]) {

        if(err) {
          console.log(err);
        }

        user.friends.push(friendRequest.sender_id);

        user.save(function (err, result) {
          if(err) {
            console.log(err);
          }
        });

      });
      res.send(friendRequest);
    } else {
      res.status(400).send("Response was rejected");
    }
  });

  });

  app.delete('/friend-requests/:id', function(req,res){
    let id = req.params.id;
    FriendRequest.findByIdAndDelete({_id: id}, function(err, result){
      if(err){
        console.log(err);
      }
      res.sendStatus(204);
    });
  });
/**
 *
 * USERS
 *
 */

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
      return res.status(500).end();
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
  const userFriends = req.body.friends;

  const newUser = new User({name: userName, age: userAge, friends: userFriends});

  newUser.save(function(err, result){
    if(err){
      return console.log(err);
    }
    res.status(201).send(newUser);
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
