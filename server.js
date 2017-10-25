const express = require('express');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT;
const dbURL = process.env.DBURL;
const app = express();

app.use(express.static('public/'));

// Index Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.get('/:passedURI', (req, res) => {
  let url = req.params.passedURI;
  
  // Correct url param (concat https:// or https://noodles-shortener.glitch.me)
  if (/^[0-9]/.test(url)) {
    url = 'https://noodles-shortener.glitch.me/' + url;
  } else if (!/^https*:\/\//.test(url)) {
    url = 'https://' + url;
  }
  
  // Connect to db
  MongoClient.connect(dbURL, (err, db) => {
    if (err) throw err;
    
    let collection = db.collection('urls');
    
    // Assign cursor for url query
    let cursor = collection.find({
      $or: [
        {
          originalURL: url
        }, {
          shortURL: url
        }
      ]}).limit(1).project( {originalURL: 1, shortURL: 1, _id: 0} ).toArray((err, docs) => {
      if (err) throw err;
      
      // If a doc is found return JSON or redirect
      if (docs.length > 0) {
        if (url == docs[0].originalURL) {
          db.close();
          return res.end(JSON.stringify(docs[0]));
        } else {
          db.close();
          return res.redirect(docs[0].originalURL);
        }
        
        // Else insert to DB and return JSON
      } else {
        let json = {originalURL: url};
        
        request(url, (err, result) => {
          if (err) {
            db.close();
            return res.end('[INVALID URL] ' + err);
          };
          
          collection.count((err, count) => {
            if (err) throw err;
            json.shortURL = 'https://noodles-shortener.glitch.me/' + count;
            collection.insert(json);
            db.close();
            return res.end(json.project( {originalURL: 1, shortURL: 1, _id: 0} ));
          });
        });
      }
    });
    
  });
});

app.listen(port);
  

