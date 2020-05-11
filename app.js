//Receive data from JSON POST and insert into MongoDB

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PostMetrics = require(path.join(__dirname,'models','Metrics'));


require('dotenv/config');

var http = require('http')
var bodyParser = require('body-parser');


// MIDDLEWARE
app.use('/assets', express.static('assets'));
app.use(bodyParser.json());



//ROUTES
app.get("/", function(req,res){
	res.sendFile(path.join(__dirname,'public','start.html'));
	// load  welcome page
});


//ROUTES
app.post("/", function(req,res){
	res.redirect('/stage3');
	// load  welcome page
});


app.post("/stage3", function(req,res){
	res.redirect('/stage3/isTangible')
})


app.get("/stage3", function(req,res){
	res.sendFile(path.join(__dirname,'public','tangible-ms.html'));
	// res.send("Invalid location");
}); 

app.get("/stage3/isTangible", function(req,res){
	res.sendFile(path.join(__dirname,'public','tangible-ms-b.html'));
})


//POSTING USER METRICS
app.post('/:minesweeperMode', async function(req,res){

	const testB = req.body;
	console.log(req.body);
	const userMetrics = new PostMetrics({
		playerName: req.body.playerName,
		minesweeperVersion: req.body.minesweeperVersion,
		movesMade: req.body.movesMade,
		timeTaken: req.body.timeTaken,
		averageMoveDuration: req.body.averageMoveDuration,
		totalMines: req.body.totalMines,
		progressionPercentage: req.body.progressionPercentage,
		flags: req.body.flags,
		flagsUsed: req.body.flagsUsed,
		regionLocationsPerSecond: req.body.regionLocationsPerSecond,
	});

	try{

	const savedMetrics = await userMetrics.save();
	res.json(savedMetrics);
	}catch(err){
		res.json({message: err});
	}   
});

// app.post('/:minesweeperMode/isTangible', async function(req,res){

// 	const testB = req.body;
// 	console.log(req.body);
// 	const userMetrics = new PostMetrics({
// 		playerName: req.body.playerName,
// 		minesweeperVersion: req.body.minesweeperVersion,
// 		movesMade: req.body.movesMade,
// 		timeTaken: req.body.timeTaken,
// 		averageMoveDuration: req.body.averageMoveDuration,
// 		totalMines: req.body.totalMines,
// 		progressionPercentage: req.body.progressionPercentage,
// 		flags: req.body.flags,
// 		flagsUsed: req.body.flagsUsed,
// 		regionLocationsPerSecond: req.body.regionLocationsPerSecond,
// 	});

// 	try{

// 	const savedMetrics = await userMetrics.save();
// 	res.json(savedMetrics);
// 	}catch(err){
// 		res.json({message: err});
// 	}   
// });



//CONNECT TO CLOUD DATABASE
mongoose.connect(process.env.DB_CONNECTION,
    { useUnifiedTopology: true, useNewUrlParser: true }, () =>
	console.log("DB connected... Ready for storing..")
	);




app.listen(process.env.PORT, function(){
		console.log("Starting localhost on PORT 3000: ");
	});
