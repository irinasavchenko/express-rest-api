const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PENDING_FRIEND_REQUEST = 'pending';
const ACCEPTED_FRIEND_REQUEST = 'accepted';

const friendRequestScheme = new Schema({  //создаем тему запроса
  sender_id: Schema.Types.ObjectId,
  receiver_id: Schema.Types.ObjectId,
  status: {
    type: String,
    default: PENDING_FRIEND_REQUEST,
  }
},{
   versionKey: false
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestScheme); //создаем модель запроса
module.exports = FriendRequest;
