const pushMessage = require('./../functionPush')
const express = require('express');
const recordRoutes = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectID;

recordRoutes.route('/api/votes').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('votes')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});


// This section will help you update a record by id.
recordRoutes.route('/api/votes/:id').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  let dataUpdate = {};
  if (req.params.id != req.body.voteId)
    return res.status(400).send(`Error sending Post, try again!`);
  if (req.body.typeVote == "positive")
    dataUpdate = { $inc: { "votes.positive": 1 } }
  if (req.body.typeVote == "negative")
    dataUpdate = { $inc: { "votes.negative": 1 } }

  dbConnect
    .collection('votes')
    .updateOne(query, dataUpdate, function (err, _result) {
      if (err) {
        return res
          .status(400)
          .send(`Error updating vote id ${query.id}!`);
      } else {
        pushMessage.sendMessage(`vote-${req.params.id}`,'new-vote',{"data":req.body.typeVote})
        return res.send({ message: "Vote Added" })
      }
    });
});


module.exports = recordRoutes;
