const User = require('../schemes/user.scheme');

const handleError = err => console.log(err);

/*const getUserList = function(req, res) {
  User.find({}, function(err, users) {
    if(err){
      console.log(err);
    }
    res.send(users);
  });
};*/

const getUserList = function(req, res) {
  return User.find({})
    .then(result => res.send(result))
    .catch(handleError)
}

const getUser = function(req, res) {
  const id = req.params.id;

  return User.findOne({_id: id})
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }

      return res.send(user)
    })
    .catch(handleError)
 };


const deleteUser =  function(req, res) {
  const id = req.params.id;

  return User.findByIdAndDelete(id)
    .then(result => res.status(204).end())
    .catch(handleError)
};


const updateUser = function(req,res) {
  const userName = req.body.name;
  const userAge = req.body.age;
  const id = req.params.id;

  return User.findOneAndUpdate({_id: id}, {name: userName, age: userAge}, {new: true})
    .then(result => res.send(result))
    .catch(handleError)
};

const createUser = function(req,res){
  if(!req.body) {
    return res.sendStatus(400);
  }

  const userName = req.body.name;
  const userAge = req.body.age;
  const userFriends = req.body.friends;
  const newUser = new User({name: userName, age: userAge, friends: userFriends});

  return newUser.save()
    .then(result => res.status(201).send(newUser))
    .catch(handleError)
};

module.exports = {
  getUserList,
  getUser,
  deleteUser,
  updateUser,
  createUser
};

