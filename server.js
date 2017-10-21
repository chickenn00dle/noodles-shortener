const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT;

const app = express();

const dbURL = process.env.DBURL;

MongoClient.connect(dbURL, (err, db) => {
  if (err) throw err;
  console.log('Connection Established');
});

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/:URL", (req, res) => {
  let url = URL;
});

// listen for requests :)
const listener = app.listen(port, (err, con) => {
  if (err) throw err;
  console.log('Listening on port ' + port);
});
