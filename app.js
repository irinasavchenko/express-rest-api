const express = require('express'); //принимает имя пакета и возвращает его(т.е. модуль express)
const app = express(); //записываем его в переменную
const bodyParser = require("body-parser").json; //body-parser извлекает всю часть тела входящего потока запросов и предоставляет его на req.body

/*let users = [
  { "id": 1, "name": "firstTestUser" },
  { "id": 2, "name": "firstTestUser2"}
];*/
let users = [];
app.use(bodyParser());

// returns a list of users
app.get('/users', function(req, res) {
  res.send(users);
});

app.get('/users/:id', function(req, res) {
  const id = req.params.id;
  const user = users.find(function(el){
    return el.id == id; 
  });
  
  if (!user) {
    return res.status(404).end();
  }

  res.send(user);
});

app.delete('/users/:id',function(req,res) {
  const id = req.params.id;
  users = users.filter(function(el) {
    return el.id != id;
  });          // если есть, то удаляет
  return res.status(204).end();
});

app.put('/users/:id', function(req,res){
  const id = req.params.id;
  const user = users.find(function(el){
      return el.id == id;
  });

  if(!user) {
    return res.status(400).end();
  }

  user.name = req.body.name;

  res.send(user);
});

app.post('/users', function(req,res){
    
  if(!req.body) {
    return res.sendStatus(400);
  }

  let arrLength = users.length;
  let idUser = arrLength + 1;
 /* let userName = {
    name: req.body.name
  };*/

  let user = {
    id: idUser,
    name: req.body.name
  };
//  user.name = nameUser; 
  users.push(user);

   res.send(user)
});






app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


