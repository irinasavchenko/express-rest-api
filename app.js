const express = require("express");
const app = express(); // результат вызова функции express
const bodyParser = require("body-parser").json; //body-parser извлекает всю часть тела входящего потока запросов и предоставляет его на req.body
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userController = require('./controllers/users.controller');
const friendRequestController = require('./controllers/friend-requests.controller');

app.use(bodyParser());

// user router
app.post('/users', userController.createUser);
app.get('/users/:id', userController.getUser);
app.get('/users', userController.getUserList);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

//friend-request router
app.post('/friend-requests',friendRequestController.createFriendRequest);
app.get('/friend-requests',friendRequestController.getFriendRequestsList);
app.get('/friend-requests/:id',friendRequestController.getFriendRequest);
app.put('/friend-requests/:id',friendRequestController.updateFriendRequestAndAddFriendsToUser);
app.delete('/friend-requests/:id',friendRequestController.deleteFriendRequests);

const PENDING_FRIEND_REQUEST = 'pending';
const ACCEPTED_FRIEND_REQUEST = 'accepted';


mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true }, function(err){  //подключаемся к бд
  if (err) {
      console.log(err);
  }

  app.listen(3000, function(){
      console.log("Слушаем порт 3000");
  });
});
