//Receive data from JSON POST and insert into MongoDB

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var metrics_db;

//Begin connecting to MongoClient
// MongoClient.connect('mongodb://localhost:27017/metrics_db',{
// 	useUnifiedTopology: true,
// 	useNewUrlParser: true,
// }).then(() => console.log("Connected to MongoDB!")).catch(err => {
// 	console.log(err.message);
// });


// MongoClient.set('useUnifiedTopology', true);
// MongoClient.set('useNewUrlParser', true);

MongoClient.connect('mongodb://localhost:27017/metrics_db', { useUnifiedTopology: true,useNewUrlParser: true  },function (err, db) {
   // { useUnifiedTopology: true };
   // { useNewUrlParser: true };
   if (err) {
       throw err
   } else {
	metrics_db = db;
	console.log('Connected to MongoDB');
	//Start app only after connection is ready
   }
 });


app.use(bodyParser.json());

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname, '/tangible-ms.html'));
});

app.post('/', function(req,res){
	metrics_db.collection('particpants').insert(req.body, function(err,res){
		if(err){
			res.send("That didn't quite work...Please review.");
		} else{
			res.send("Sucessful!");
		}
	});
});

app.listen(3000, function(){
		console.log("Starting localhost on PORT 3000: ");
	});