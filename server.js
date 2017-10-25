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
  
  console.log('\n' + url);
  
  MongoClient.connect(dbURL, (err, db) => {
    if (err) throw err;
    console.log('Connected to DB');
    
    let collection = db.collection('urls');
    
    var cursor = collection.find({
      $or: [
        {
          originalURL: url
        }, {
          shortURL: url
        }
      ]}).limit(1);
    
    if (cursor.hasNext()) {
        cursor.next((doc) => {
          console.log(doc);
        });
      } else {
        request(url, (err, success) => {
          if (err) {
            res.end('[ERROR] Invalid URL: ' + err);
          }
          
          let json = {originalURL: url};
          collection.find().count((total) => {
            json['shortURL'] = 'https://noodles-shortener/' + total;
            console.log(json);
            console.log('\n');
            db.close(); 
            res.end(JSON.stringify(json));
          });   
        });
      }
    
    db.close(); 
  });
});

app.listen(port);
  

