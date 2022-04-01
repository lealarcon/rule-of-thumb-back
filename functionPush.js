'use strict';
var Pusher = require('pusher');
require('dotenv').config();

function sendMessage(channel, event, data) {
  var pusher = pusherInit();
  pusher.trigger(channel, event, data);
}

function pusherInit() {
  return new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "us2",
    useTLS: true
  });
}

module.exports = { sendMessage };














