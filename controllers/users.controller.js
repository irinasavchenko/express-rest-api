const User = require('../schemes/user.scheme');

const getUserList = function(req, res) {
  User.find({}, function(err, users) {
    if(err){
      console.log(err);
    }
    res.send(users);
  });
};

const getUser = function(req, res) {
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
 };


const deleteUser =  function(req, res) {
  const id = req.params.id;

  User.findByIdAndDelete(id, function(err, result) {

    if (err) {
      return res.status(500).end();
    }

    res.status(204).end();
  });
};


const updateUser = function(req,res) {
  const userName = req.body.name;
  const userAge = req.body.age;
  const id = req.params.id;

  /*User.findOneAndUpdate({_id: id}, {name: userName, age: userAge}, {new: true})
    .then(result => res.send(result))
    .catch(err => console.log(err));*/

   User.findOneAndUpdate({_id: id}, {name: userName, age: userAge}, {new: true}, function(err, user) {
     if(err) {
       return console.log(err);
     }

     res.send(user);
   });
};

const createUser = function(req,res){
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
};

module.exports = {
  getUserList,
  getUser,
  deleteUser,
  updateUser,
  createUser
};

