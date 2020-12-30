module.exports = `<!doctype html>
<html>

<head>
	<title>Matrix Calendar</title>
	<style>
	body {
	padding: 0;
	margin: 0;
}
#canvas-holder{
	width:80%;
	margin: auto;
}
div.canvas-holder {
	width: 800px;
	height: 600px;
	margin: auto;
}
div.title-text{
	margin: auto;
	text-align: center;
	font-size:18px;
}
$green: #008744;
$blue: #0057e7;
$red: #d62d20;
$yellow: #ffa700;
$white: #eee;

$width: 100px;

body{
  background-color: white;
}

.loader{
  width: $width;
  height: $width;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.circular{
  animation: rotate 2s linear infinite;
  height: $width;
  position: relative;
  width: $width;
}

.path {
  stroke-dasharray: 1,200;
  stroke-dashoffset: 0;
  stroke:#B6463A;
  animation:
   dash 1.5s ease-in-out infinite,
   color 6s ease-in-out infinite
  ;
  stroke-linecap: round;
}

@keyframes rotate{
 100%{
  transform: rotate(360deg);
 }
}
@keyframes dash{
 0%{
  stroke-dasharray: 1,200;
  stroke-dashoffset: 0;
 }
 50%{
  stroke-dasharray: 89,200;
  stroke-dashoffset: -35;
 }
 100%{
  stroke-dasharray: 89,200;
  stroke-dashoffset: -124;
 }
}
@keyframes color{
  100%, 0%{
    stroke: $red;
  }
  40%{
    stroke: $blue;
  }
  66%{
    stroke: $green;
  }
  80%, 90%{
    stroke: $yellow;
  }
}
	</style>
</head>
<body>
	<div class="canvas-holder">
		<div class="title-text">
			<p style="font-family: Nunito;">Average Attendance Based on Time and Day of the Week</p>
		</div>
		<canvas id="chart-area"></canvas>
	</div>
</body>

</html>
`;