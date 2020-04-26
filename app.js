//Receive data from JSON POST and insert into MongoDB

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

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

// MongoClient.connect('mongodb://localhost:27017/metrics_db', { useUnifiedTopology: true,useNewUrlParser: true  },function (err, db) {
//    // { useUnifiedTopology: true };
//    // { useNewUrlParser: true };
//    if (err) {
//        throw err
//    } else {
// 	metrics_db = db;
// 	console.log('Connected to MongoDB');
// 	//Start app only after connection is ready
//    }
//  });


app.use('/assets', express.static('assets'));


app.use(bodyParser.json());

// app.use(express.static('assets'));

app.get("/", function(req,res){
	res.sendFile(path.join(__dirname+'/start.html'));
	// load  welcome page
});


app.get('/:minesweeperMode', function(req,res){
	var msMode = req.params.minesweeperMode;
	if(msMode === "stage1") res.sendFile(path.join(__dirname+'/tangible-ms.html'));
	// else if(msMode === "stage2") res.send("Start part 2 of study");
	else res.send("Invalid location");

	// res.send("Tangible Minesweeper loaded")
})

// app.get('/', function(req,res){
// 	res.sendFile(path.join(__dirname, '/tangible-ms.html'));
// });

// app.post('/', function(req,res){
// 	metrics_db.collection('particpants').insert(req.body, function(err,res){
// 		if(err){
// 			res.send("That didn't quite work...Please review.");
// 		} else{
// 			res.send("Sucessful!");
// 		}
// 	});
// });

app.use('/', router);

app.listen(3000, function(){
		console.log("Starting localhost on PORT 3000: ");
	});