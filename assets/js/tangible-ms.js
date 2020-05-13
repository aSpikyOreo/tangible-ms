//Setup --> Drawing the Canvas, and the board's outline
		
//Build --> Producing, loading and creating the game's core content: 
//          --> Assigning a mine by probability
//          --> Identifying the number of neighbours each space has 
//          --> Loading UI (i.e: Flag-Count, Timer)
//          --> Starting metric analyser


//Begin --> Load in-game functionality and incorporate this with PaperJS
//          animation
//		--> Begin recording game data that takes place based on the notes
//          on user metrrics


//End   --> Either when user WINs or LOSEs, terminate activity and shut down 

//Deploy and Send --> Store analytics to a database via Plotly
//                --> Prompt the user for qualitative feedback
//                --> FIN


// Comparative Study Features:
//            --> Board 1: Static boring board that plays basic MineSweeper and 				  tracks metrics

//        	  --> Board 2: Include animation and sound via PaperJS and Howler 					  in an attempt to invoke a sense of tangibility 


// The three questionnaires are an attempt to contrast between manipulating user immersion and the contrast between qualitative and quantitative features they possess. Is there enough evidence to suggest a correlation? Did this have an impact between overall engagement or are there too many factors to be considered for this to be possible?


paper.install(window);
window.onload = function(){
		paper.setup('ms-canvas');
		var canvas = document.getElementsByTagName("canvas")[0];
	 	var ROWS = 8;
	 	var COLS = 8;
	 	var user = prompt("UserName: ");
	 	// end/ROWS allows for about a space width of 44 either side
	 	var start = Math.floor(Number(Math.floor(canvas.height)) / (ROWS*2))
	 	var end = Number(Math.floor(canvas.height)) - start;
	 	var stepH = Number(Math.floor((1/(COLS)) * end));
	 	var stepW = Number(Math.floor((1/(ROWS)) * end));
	 	var circleSize = Math.floor(0.5*stepH);
	 	var spaces = new Array();
	 	console.log(start,end,stepH, stepW);
	 	var n = 0;
	 	var isGameOver = false;
	 	var positionTracker = {pos_x: 0, pos_y: 0};


	 	// only one unsuccessful move can be made so:
	 		// if player fails: (n-1) / (ROWS*COLS - mineCount) 
	 		// if player succeeds: 100% and time 


	 	var playerStats = {
	 				   playerName: user,
	 				   minesweeperVersion: 1,
	 				   movesMade: 0,
					   timeTaken: 0, 
					   averageMoveDuration: 0, 
					   totalMines: 0,
					   progressionPercentage: 0, 
					   flags: 0, 
					   flagsUsed: 0,
					   regionLocationsPerSecond: [],
					  };

	 	//Construction of Game Mechanics
		init();
		identifyNeighbours(ROWS,COLS);

		var positionTimer = setInterval(trackPositionPerSecond, 1000);


		// var timeExpired = setTimeout(function(){
		// 	isGameOver = true;
		// }, 90000);

		viewPositionMetrics();

		function getMousePosition(){
			$("canvas").mousemove(function(event){
				var canvasOffsetX = $(this).position().left;
				var canvasOffsetY = $(this).position().top;



				var posX = Math.floor(event.pageX - canvasOffsetX);
				var posY = Math.floor(event.pageY - canvasOffsetY);

				//TODO: every 0.5 - 1.0s, push this into a data structure to prep for time-series graph
				//NOTE: here would be a potentially good location to add plotly functionality 
				// console.log(posX, posY);
				positionTracker.pos_x = posX;
				positionTracker.pos_y = posY;
				// console.log(res, canvasOffsetX, canvasOffsetY);

			});
		}


		function trackPositionPerSecond(){
			if(!isGameOver){
				getMousePosition();
				// console.log(positionTracker);
				var posX = positionTracker.pos_x;
				var posY = positionTracker.pos_y;
				var idx = getSpaceIndex(posX,posY);
				var region = identifyBoardRegion(idx);
				// console.log(posX, posY, idx, region);
				var currentPositionMetrics = {region: region, positionX: posX, positionY: posY};
				playerStats.timeTaken++;
				$(".ms-timer").text(playerStats.timeTaken);
				$(".ms-flag-count").text(playerStats.flags);
				if(playerStats.timeTaken >= 1800){
					isGameOver = true;
					$(".ms-timer").css("color","red")

				}
				timeExpired();
				//console.log(playerStats.timeTaken);
				playerStats.regionLocationsPerSecond.push(currentPositionMetrics);
			}
		}

		function viewPositionMetrics(){
				$("canvas").mousedown(function(event){
					var canvasOffsetX = $(this).position().left;
					var canvasOffsetY = $(this).position().top;

					var clickedX = Math.floor(event.pageX - canvasOffsetX);
					var clickedY = Math.floor(event.pageY - canvasOffsetY);
					console.log(clickedX, clickedY);
					switch (event.which){
						case 1: 
							//co-ords from click listener are able to progress the game
							if(!isGameOver){
								startRound(clickedX, clickedY); 
							}
							break;


						case 3: 
							if(!isGameOver){
								placeFlag(clickedX, clickedY);
								
							}
							break;

						default:
							alert("error, something seems to be wrong..");
					}
				});
		}

		// recursively removes all spaces that have no mines adjacent to them
		
		// when adjacentNeighbours is 0, recursively check all neighbours' adjacentNeighbour values

		// if so, repeat again, else stop.

		function identifyBoardRegion(index){
			traversalIndex = index % COLS;

			if(index === 0){
				return("TOP-LEFT CORNER");
			}

			else if(index === (COLS-1) ){
				return("BOTTOM-LEFT CORNER");
			}

			else if(index === ((ROWS-1)*COLS) ){
				return("TOP-RIGHT CORNER");
			}

			else if(index === ((ROWS*COLS)-1)){
				return("BOTTOM-RIGHT CORNER")
			}

	 		else if(traversalIndex === 0){
	 			return("TOP ROW");
	 		}
	 		else if(traversalIndex === (COLS-1)){
	 			return("BOTTOM ROW");
	 		}

	 		else if(index < COLS){
	 			return("LEFT COLUMN");
	 		}

	 		else if(index > ((ROWS-1)*COLS )){
	 			return("RIGHT COLUMN");
	 		}
	 		else{
	 			return("INNER-SQUARE");
	 		}

		}

		function placeFlag(posX, posY){
			var idx = getSpaceIndex(posX, posY);
			identifyBoardRegion(idx);
			if(!spaces[idx].flagged){
				if(playerStats.flags > 0){
				var myCircle = drawCircle(idx,10,'pink');
				spaces[idx].flagged = true;
				playerStats.flagsUsed++;
				playerStats.flags--;
				}
			} else{
				var myCircle = drawCircle(idx,10,spaces[idx].color);
				spaces[idx].flagged = false;
				playerStats.flags++;
			}
			
		}


		function viewGameProgression(){
			var clearPercentage = Math.floor((playerStats.movesMade)/(ROWS*COLS -playerStats.totalMines) *100);
			console.log(playerStats.movesMade, clearPercentage)
			return(clearPercentage);

		}

		function startRound(posX, posY){
			// Grabs co-ordinates from canvas
			var idx = getSpaceIndex(posX, posY);
			console.log(spaces[idx]);
			determineOutcome(idx);
		}



		function assignMine(){
	 		var rand_num = Math.floor(Math.random() * 20);
	 		if(rand_num >= 17) {
	 			return true;
	 		} else{
	 			return false;
	 		}
	 	}
	 	// idx * stepH + start + circleSize = val
	 	// val - circleSize - start / stepH = idx
	 	function getSpaceIndex(posX,posY){
	 		var remX = Math.floor((posX - start)/stepW);
	 		var remY = Math.floor((posY - start)/stepH);

	 		var index = COLS*remX + remY;
	 		return index;
	 	}

	 	function randomColorGenerator(posX, posY){
	 		var variant = Math.floor(Math.random() * 256);
			var r = (posX + variant)  % 256; 
			var g = (posY + variant) % 256;
			var b = (posX + posY + variant) % 256;
			return "rgb(" + r + ", " + g + ", " + b + ")";

	 	}

	 	function buildBoard(){
	 		var mineCount = 0;
	 		for (var i = 0; i < ROWS; i+=1) {
				for (var j = 0; j < COLS; j+=1) {
					var x_shift = Math.floor(0.5*start) + i*stepW;
					var y_shift = Math.floor(0.5*start) + j*stepH;
					var circleCol = randomColorGenerator(x_shift,y_shift);
					var myCircle = new Path.Circle(new Point(x_shift+circleSize,y_shift+circleSize),circleSize).fillColor = circleCol;
					//initialise space object


					var spaceObj = {
									index: n, 
									color: circleCol,
									pos_x: 0, pos_y: 0, 
									holdsMine: 0, 
									adjacentNeighbours: 0, 
									clicked: false,
									flagged: false,
									neighbourIndexList: []
									};

					spaceObj.pos_x = x_shift+circleSize;
					spaceObj.pos_y = y_shift+circleSize;
					spaceObj.holdsMine = assignMine();

					if(spaceObj.holdsMine){
						mineCount++;
					}

					spaces.push(spaceObj);
					n++;
				}
			}

			playerStats.totalMines = mineCount;
			playerStats.flags = mineCount;
	 	}

	 	function init(){
	 		buildBoard();
		}

		function sendUserMetrics(){
			var userMetricData = JSON.stringify(playerStats);
			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", '/sendMetrics', true);
			xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
			xhttp.send(userMetricData);

		}

		function identifyNeighbours(x_max,y_max){
	 		var traversalIndex = 0;

	 		//inner square
	 		for (var i = 0; i < x_max*y_max; i++) {
	 			traversalIndex = (i % y_max);

	 		if((traversalIndex != 0) && (traversalIndex != (y_max-1)) 
	 		&& (i <= ((y_max)*(x_max-1)-1)) && (i >= y_max+1) ){
	 			spaces[i].adjacentNeighbours = spaces[(i-1)].holdsMine
	 									   + spaces[i+1].holdsMine
	 									   + spaces[i+y_max].holdsMine
	 									   + spaces[i-y_max].holdsMine
	 									   + spaces[(i-1)+y_max].holdsMine
	 									   + spaces[(i-1)-y_max].holdsMine
	 									   + spaces[(i+1)+y_max].holdsMine
	 									   + spaces[(i+1)-y_max].holdsMine;
	 			spaces[i].neighbourIndexList.push( (i+1),(i-1),(i+y_max),(i-y_max),
	 												(i-1+y_max),(i-1-y_max),
	 												(i+1+y_max),(i+1-y_max));
				}
			// console.log(isNaN(spaces[i].holdsMine))
			}

			//four courners
			spaces[0].adjacentNeighbours = spaces[y_max].holdsMine
									   + spaces[y_max+1].holdsMine
									   + spaces[1].holdsMine;

			spaces[0].neighbourIndexList.push(y_max,(y_max+1),1);

			spaces[y_max-1].adjacentNeighbours = spaces[(y_max-1) - 1].holdsMine
											 + spaces[(y_max-1) + y_max].holdsMine
											 + spaces[(y_max-1) + y_max-1].holdsMine;

			spaces[(y_max-1)].neighbourIndexList.push((y_max-1-1), (y_max-1+y_max), (y_max-1+y_max-1));


			spaces[y_max*x_max-1].adjacentNeighbours = spaces[(y_max*x_max-1)-1].holdsMine
												   + spaces[(y_max*x_max-1)-y_max].holdsMine
												   + spaces[(y_max*x_max-1)-(y_max-1)].holdsMine;

			spaces[y_max*x_max-1].neighbourIndexList.push((y_max*x_max-1)-1, (y_max*x_max-1)-y_max, (y_max*x_max-1)-(y_max-1));


			spaces[(x_max *(y_max-1))].adjacentNeighbours = spaces[(x_max *(y_max-1))+ 1].holdsMine
                                                     + spaces[(x_max *(y_max-1))-y_max].holdsMine
                                                     + spaces[(x_max *(y_max-1))-(y_max)+1].holdsMine; 

            spaces[(x_max *(y_max-1))].neighbourIndexList.push((x_max *(y_max-1))+ 1, (x_max *(y_max-1))-y_max,(x_max *(y_max-1))-(y_max)+1);


            for(var k = 1; k < y_max-1; k++){

		 		//left column
		 		spaces[k].adjacentNeighbours = spaces[k-1].holdsMine
		 								   + spaces[k+1].holdsMine
		 								   + spaces[k+y_max].holdsMine
		 								   + spaces[k+y_max - 1].holdsMine
		 								   + spaces[k+y_max + 1].holdsMine;

		 		spaces[k].neighbourIndexList.push(k-1,k+1,k+y_max,k+y_max-1,k-y_max+1);


		 		//right column
		 		spaces[x_max *(y_max-1) + k].adjacentNeighbours = spaces[ (x_max *(y_max-1) + k) + 1].holdsMine
		 								+ spaces[x_max *(y_max-1) + k - 1].holdsMine
									   + spaces[x_max *(y_max-1) + k - y_max].holdsMine
									   + spaces[x_max *(y_max-1) + k - y_max + 1].holdsMine
									   + spaces[x_max *(y_max-1) + k - y_max - 1].holdsMine;

				spaces[x_max *(y_max-1) + k].neighbourIndexList.push((x_max *(y_max-1) + k) + 1,
																	  x_max *(y_max-1) + k - 1,
																	  x_max *(y_max-1) + k - y_max,
																	  x_max *(y_max-1) + k - y_max + 1,
																	  x_max *(y_max-1) + k - y_max - 1);
		 		
		 		//top row
		 		spaces[k*y_max].adjacentNeighbours = spaces[k*y_max + 1].holdsMine
		 									     + spaces[(k+1)*y_max].holdsMine
		 									     + spaces[(k-1)*y_max].holdsMine
		 									     + spaces[(k+1)*y_max + 1].holdsMine
		 									     + spaces[(k-1)*y_max + 1].holdsMine;

		 		spaces[k*y_max].neighbourIndexList.push(k*y_max + 1,
		 												(k+1)*y_max,
		 												(k-1)*y_max,
		 												(k+1)*y_max + 1,
		 												(k-1)*y_max + 1);

		 		//bottom row
		 		spaces[(k+1)*(y_max)-1].adjacentNeighbours = spaces[(k+1)*(y_max)-1 - 1].holdsMine
		 											+ spaces[(k+1)*(y_max)-1 - y_max].holdsMine
		 										    + spaces[(k+1)*(y_max)-1 + y_max].holdsMine
		 											+ spaces[(k+1)*(y_max)-1 - y_max-1].holdsMine
		 										    + spaces[(k+1)*(y_max)-1 +y_max-1].holdsMine;


				spaces[(k+1)*(y_max)-1].neighbourIndexList.push((k+1)*(y_max)-1 - 1,
												 			    (k+1)*(y_max)-1 - y_max,
												                (k+1)*(y_max)-1 + y_max,
												                (k+1)*(y_max)-1 - y_max-1,
												                (k+1)*(y_max)-1 + y_max-1);
	 		}
	 	}

	 	function determineOutcome(index){
	 		if(!spaces[index].clicked){
	 			spaces[index].clicked = true;
				playerStats.movesMade++;
				var completed = viewGameProgression();
				playerStats.progressionPercentage = completed;
				if(spaces[index].holdsMine){
					alert("Game Over");
					for (var i = 0; i < spaces.length; i++) {
						if(spaces[i].holdsMine){
							var mineCircle = drawCircle(i,circleSize,'red');
						}
						else{
							var myCircle = drawCircle(i,circleSize,'orange');

						}
						// var myCircle = drawCircle(i,circleSize,'orange');

					}
					isGameOver = true;
					playerStats.averageMoveDuration = (playerStats.timeTaken/playerStats.movesMade);
					sendUserMetrics();
				} 

				else if(completed === 100){
					alert("You Win!");
					for (var i = 0; i < spaces.length; i++) {
						var myCircle = drawCircle(i,circleSize,'green');
					}
					isGameOver = true;
					playerStats.averageMoveDuration = (playerStats.timeTaken/playerStats.movesMade);
					sendUserMetrics();
				}

				else{
					var myCircle = drawCircle(index,circleSize,'grey');
					var text = new PointText(new Point(spaces[index].pos_x,(spaces[index].pos_y)));
					text.justification = 'center';
					text.fillColor = 'black';
					text.content = spaces[index].adjacentNeighbours;

				}
			}
	 	}


	 	function timeExpired(){
	 		if(isGameOver){
				alert("Time expired!");
				for (var i = 0; i < spaces.length; i++) {
					if(spaces[i].holdsMine){
							var mineCircle = drawCircle(i,circleSize,'red');
						}
						else{
							var myCircle = drawCircle(i,circleSize,'orange');

						}
				}
				playerStats.averageMoveDuration = (playerStats.timeTaken/playerStats.movesMade);
				sendUserMetrics();

			}
	 	}

	 	function drawCircle(idx, size, col){
			var c = new Path.Circle(new Point(spaces[idx].pos_x,(spaces[idx].pos_y)),size).fillColor = col;
			return c;
		}
	}