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
      ]}).limit(1).toArray((err, docs) => {
      if (err) throw err;
      
      if (docs.length > 0) {
        db.close();
        console.log('DB Connection Closed');
        return res.redirect(docs[0].originalURL);
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
            console.log('DB Connection Closed');
            return res.end(JSON.stringify(json));
          });
        });
      }
    });
    
  });
});

app.listen(port);
  

