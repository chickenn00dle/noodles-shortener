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
  
  console.log(url);
  
  let json = {originalURL: url};
  
  MongoClient.connect(dbURL, (err, db) => {
    if (err) throw err;
    
    let coll = db.collection('urls');
    
    let item = coll.findOne( 
      { 
        $or: [
           {
             originalURL: url
           }, {
             shortURL: url
           }
        ] 
      }, (item) => {
        console.log(item);
      });
    
    
//       }, (obj) => {
//         if (obj.shortURL != null) {   
//           res.redirect(obj.originalURL);
//           db.close(); 
//         } else if (obj.originalURL != null){
//           res.end(obj);
//           db.close(); 
//         } else {
//           checkURL(url, (err, host) => {
//             if (err) {
//               return res.send('Invalid URL. Please verify you are following the format:\nhttps://noodles-shortener.glitch.me/[https://www.example.com]');
//             }
        
//             coll.count((err, count) => {
//               if (err) throw err;
//               json.shortURL = 'https://noodles-shortener.glitch.me/' + (count + 1);
//               coll.insert(json);
//               res.end(JSON.stringify(json));
//               db.close();   
//             });
//           });
//         }  
      // });
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

  

