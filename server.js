const express = require('express');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT;
const dbURL = process.env.DBURL;

const app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/:URL", (req, res) => {
  let url = req.params.URL;
  
  if (!/^https:\/\//.test(url)) {
    url = 'https://' + url;
  }
  
  let json = {originalURL: url};
  
  MongoClient.connect(dbURL, (err, db) => {
    if (err) throw err;
    
    let coll = db.collection('urls'),
        dbObj;
    
    if (coll.find({shortURL: url}).limit(1)) {
      dbObj = coll.findOne({shortURL: url});
      res.redirect(dbObj.shortURL);
      db.close();
      
    } else if (coll.find({originalURL: url}).limit(1)){
      dbObj = coll.findOne({originalURL: url});
      res.end(dbObj);
      db.close(); 
      
    } else {
      checkURL(url, (err, host) => {
        if (err) {
          return res.send('Invalid URL. Please verify you are following the format:\nhttps://noodles-shortener.glitch.me/[https://www.example.com]');
        }
        
        coll.count((err, count) => {
          if (err) throw err;
          json.shortURL = 'https://noodles-shortener.glitch.me/' + (count + 1);
          res.end(JSON.stringify(json));
          coll.insert(json);
          db.close(); 
        });
      });
    }
  });
});

// listen for requests :)
const listener = app.listen(port, (err, con) => {
  if (err) throw err;
  console.log('Listening on port ' + port);
});

function checkURL(host, cb) {
  request(host, (err, res) => {
    if (err) {
      cb(err);
    }
    cb(null, host);
  });
}

  

