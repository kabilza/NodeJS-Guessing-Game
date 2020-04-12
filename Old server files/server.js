'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
var url2 = require('url');
var fs = require('fs');
const url = 'mongodb://localhost:27017';


// Database Name
const dbName = 'pantip';
// Create a new MongoClient
const client = new MongoClient(url);

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App
const app = express();

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const col = db.collection('player');

  app.get('/', function(req, res) {
    // Get first two documents that match the query
    col.find({}).limit(1).toArray(function(err, docs){
      assert.equal(null, err);
      res.send(JSON.stringify(docs));
      // res.send(JSON.stringify(docs.stage));
    });
  });
});

// app.get('/', function(req, res){
//   var q = url2.parse(req.url2, true);
//   var filename = "." + q.pathname;
//   fs.readFile(filename, function(err, data) {
//     if (err) {
//       res.writeHead(404, {'Content-Type': 'text/html'});
//       return res.end("404 Not Found");
//     } 
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(data);
//     return res.end();
//     });
//   });
// });


// app.get('/', (req, res) => {
//   res.write("Hello World");
//   });
// });
// client.close();

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
