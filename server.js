const express = require('express');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT;
const dbURL = process.env.DBURL;
const app = express();

app.use(express.static('public/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/:passedURI', (req, res) => {
  let url = req.params.passedURI;
  if (!/^https*:\/\//.test(url)) {
    url = 'https://' + url;
  }
  
  MongoClient.connect(dbURL, (err, db) => {
    if (err) throw err;
    console.log('Connected to DB');
    
    let collection = db.collection('urls');
    
    let item = collection.find({
      $or: [
        {
          originalURL: url
        }, {
          shortURL: url
        }
      ]}).limit(1);
    
    console.log(item);
    db.close(); 
  });
});

app.listen(port);
  

