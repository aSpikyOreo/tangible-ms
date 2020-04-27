// name: "",
// movesMade: 0,
// timeTaken: 0, 
// currentMoveDuration: 0, 
// mines: 0, 
// flags: 0, 
// flagsUsed: 0,

const mongoose = require('mongoose');

const MetricSchema = mongoose.Schema({
	playerName: {
		type: String,
		required: true
	},
	minesweeperVersion: {
		type: String, 
		required: true
	},
	movesMade: {
		type: Number, 
		required: true
	},
	timeTaken: {
		type: Number, 
		required: true
	},
	averageMoveDuration: {
		type: Number, 
		required: true
	},
	progressionPercentage: {
		type: Number, 
		required: true
	},
	flagsUsed: {
		type: Number, 
		required: true
	},

});



module.exports = mongoose.model('UserMetrics', MetricSchema);
