'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const path = require('path');
// Connection URL
const url2 = require('url');
const fs = require('fs');
const url = 'mongodb://localhost:27017';
const bodyParser = require('body-parser');


// Database Name
const dbName = 'pantip';
// Create a new MongoClient
const client = new MongoClient(url);

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

//Numbers
var questionlen = 1;
var all_correct = 0

// App
const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  var col = db.collection('player');
  var myobj = {_id:1, stage:1, question:[], answer:[1, 2, 3, 4],
   attempt:0, gameStart:null, gameEnd:null};

  app.get('/', function(req, res) {
    col.insertOne(myobj, function(err, res) {
    });
    console.log("1 document inserted");
    res.sendFile(path.join(__dirname+'/game.html'));

    col.update({_id:1}, {$set: {question: [], answer: [1, 2, 3, 4]}}, function(err, added){
    })

    

    all_correct = 0;
  })

  app.post('/answer', function(req, res) {
    var data = req.body.answer;
    col.update({_id:1}, {$push: {question:data}}, function(err, added){
    })
    questionlen++;
    console.log("1 letter inserted to database");
    console.log(req.body.answer);
    res.status(200);

    if(questionlen == 5){
      questionlen = 1;
      console.log("Answer is full");
    }
    else{
      app.get("/");
    };
  })

  app.get('/start', function(req, res) {
    console.log("Trying to go to start page");
    res.sendFile(path.join(__dirname+'/start.html'));

    col.update({_id:1}, {$set: {gameStart: true}}, function(err, added){
    })
  }
  )

  app.post('/start', function(req, res) {
    var i = 0
    
    var data = req.body.answer;
    console.log("Got answer ");
    console.log(data)
    col.distinct("question", {},(function(err, result){
      if (err) throw err;
      for(i = 0; i < 10; i++){
        if((result[i]) == data){
          console.log("You're Correct " + "at " + " " + (i+1) + " index")
          col.update({ answer: i+1 },{ $set : {"answer.$": data}}, function(err, added){
            if(added){
              col.distinct("answer", {},(function(err, result2){console.log(result2);}))
              
            }
          })
          // if(all_correct == 0){
          //   app.get("/gamefinish")
          //   console.log("Redirect to finish page")
          // }
        }

      }
    }
    ))
}
)

  app.get('/gamefinish', function(req, res) {
    res.sendFile(path.join(__dirname+'/gamefinish.html'));
  })
  
  app.post('/gamefinish', function(req, res) {
    col.distinct("answer", {},(function(err, result){
      console.log("This is the final answer")
      console.log(result)
      res.send(JSON.stringify(result));
    }))})
  })




app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
