var canvas = document.getElementById("ms-canvas");
var canvasH = canvas.height;
var canvasW = canvas.width;

for (var i = 0; i < 8; i+=1) {
	for (var j = 0; j < 8; j++) {
		var myCircle = new Path.Circle(new Point((i*50+5),(j*50 + 5)), 5).fillColor = 'lime';
	}
}