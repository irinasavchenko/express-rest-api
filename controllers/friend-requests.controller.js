const User = require('../schemes/user.scheme');
const FriendRequest = require('../schemes/friend-request.scheme');

const PENDING_FRIEND_REQUEST = 'pending';
const ACCEPTED_FRIEND_REQUEST = 'accepted';

const getFriendRequestsList = function(req, res) {
  FriendRequest.find({}, function(err, requests) {
    if(err){
      console.log(err);
    }
    res.send(requests);
  });
};

const getFriendRequest = function(req, res){
  const id = req.params.id;
  FriendRequest.find({_id: id}, function(err, requests){
    if(err) {
      console.log(err);
    }
    res.send(requests);
  })
};

const createFriendRequest = function(req,res){

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
};

const updateFriendRequestAndAddFriendsToUser = function(req, res) {

  const receivedStatus = req.body.status;

  FriendRequest.findOneAndUpdate({ _id: req.params.id }, { status: receivedStatus }, { new: true }, function(err, friendRequest) {
    if (friendRequest.status === ACCEPTED_FRIEND_REQUEST ) {
      User.find({ _id:  friendRequest.sender_id }, function (err, [user]) {

        if(err) {
          console.log(err);
        }
       console.log("1");
       user.friends.push(friendRequest.receiver_id);

        user.save(function (err, result) {
          if(err) {
            console.log(err);
          }
          console.log("2");
        });
      });

      User.find({ _id:  friendRequest.receiver_id }, function (err, [user]) {

        if(err) {
          console.log(err);
        }
        console.log("3");
        user.friends.push(friendRequest.sender_id);

        user.save(function (err, result) {
          if(err) {
            console.log(err);
          }
          console.log("4");
        });

      });
      res.send(friendRequest);
      console.log("5");
    } else {
      res.status(400).send("Response was rejected");
    }
  });

  };

  const deleteFriendRequests = function(req,res){
    let id = req.params.id;
    FriendRequest.findByIdAndDelete({_id: id}, function(err, result){
      if(err){
        console.log(err);
      }
      res.sendStatus(204);
    });
  };

  module.exports = {
    getFriendRequestsList,
    getFriendRequest,
    updateFriendRequestAndAddFriendsToUser,
    deleteFriendRequests,
    createFriendRequest
  };