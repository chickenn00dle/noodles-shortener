const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT;

const app = express();

const dbURL = process.env.DBURL;

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/:URL", (req, res) => {
  let url = req.params.URL;
  MongoClient.connect(dbURL, (err, db) => {
    if (err) throw err;
    console.log('Connected to URL Shortener DB');
    
    let coll = db.collection('urls');
    
    if (coll.findOne({shortURL: url})) {
      console.log("Return Full");
    } else if (coll.findOne({fullURL: url})){
      console.log("Return Shortened");
    } else {
      console.log("Insert URL")
    };
    
    db.close();
    
  });
  
});

// listen for requests :)
const listener = app.listen(port, (err, con) => {
  if (err) throw err;
  console.log('Listening on port ' + port);
});
