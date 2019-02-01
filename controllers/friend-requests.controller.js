const User = require('../schemes/user.scheme');
const FriendRequest = require('../schemes/friend-request.scheme');

const PENDING_FRIEND_REQUEST = 'pending';
const ACCEPTED_FRIEND_REQUEST = 'accepted';
const handleErr = err => console.log(err);

const getFriendRequestsList = function(req, res) {
  return FriendRequest.find({})
    .then(result => res.send(result))
    .catch(err => handleErr)
};

const getFriendRequest = function(req, res){
  const id = req.params.id;
  return FriendRequest.find({_id: id})
    .then(result => {
      if(!result){
        return send.status(404).end();
      }
      return res.send(result)
    })
    .catch(err => handleErr)
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

  return friendRequest.save()
    .then(friendRequest => res.send(friendRequest))
    .catch(err => handleErr)
};

  const updateFriendRequestAndAddFriendsToUser = function(req, res) {

    const receivedStatus = req.body.status;

    return FriendRequest.findOneAndUpdate({ _id: req.params.id }, { status: receivedStatus }, { new: true })
      .then(friendRequest => {
        if (friendRequest.status !== ACCEPTED_FRIEND_REQUEST ) {
          return res.send(friendRequest);
        }

        return User.find({ "_id":  { $in: [friendRequest.sender_id, friendRequest.receiver_id]} } )
          .then(function([user1, user2]) {
            user1.friends.push(user2._id);
            user2.friends.push(user1._id);

            return Promise.all([
              user1.save(),
              user2.save(),
            ]);
          })
          .then(() => res.send(friendRequest));

      })
      .catch(err => handleErr)
  }

  const deleteFriendRequests = function(req,res){
    let id = req.params.id;
    return FriendRequest.findByIdAndDelete({_id: id})
      .then(result => res.sendStatus(204))
      .catch(err => handleErr)
  };

  module.exports = {
    getFriendRequestsList,
    getFriendRequest,
    updateFriendRequestAndAddFriendsToUser,
    deleteFriendRequests,
    createFriendRequest
  };