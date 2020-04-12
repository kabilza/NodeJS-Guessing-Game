'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var url = require('url');
var fs = require('fs');
var http = require('http');
const express = require('express');

// Database Name
const dbName = 'pantip';
// Create a new MongoClient
const client = new MongoClient('mongodb://localhost:27017');

// Constants
const PORT = 80;
const HOST = '0.0.0.0';
const app = express();

client.connect(function(err) {
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
    const col = db.collection('player');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;

    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      res.writeHead(200, {'Content-Type': 'text/html'});

      app.get(filename, function(req, res) {
        // Get first two documents that match the query
        col.find({}).limit(1).toArray(function(err, docs){
          assert.equal(null, err);
          res.send(JSON.stringify(docs));
          console.log("1 document inserted");
        });
      });

      res.write(data);
        return res.end();
    });
}).listen(PORT, HOST);
});

console.log(`Running on http://${HOST}:${PORT}`);
