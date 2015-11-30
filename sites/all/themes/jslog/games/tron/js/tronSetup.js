var canvas,
	ctx,
	keystate,

	hasLoopStarted = false,

	scoreRecord,

	environment,
	players;

function main() {

	loadGameOptions();

	createCanvas();

	registerKeystateListener();
}

function init() {

	loadGameOptions();

	createCanvas();

	registerKeystateListener();

	var activePlayers = players.filter( function (player) {
		return player.playerActive;
	});

	jslogTRONapplication.initialise(environment, activePlayers);
	createScoreBoard(jslogTRONapplication.getScores());
	updateScoreBoard(jslogTRONapplication.getScores());

	if (!hasLoopStarted) {
		hasLoopStarted = true;
		var loop = function () {
			update();
			draw();

			window.requestAnimationFrame(loop, canvas);
		};
		window.requestAnimationFrame(loop, canvas);
	}
}

function update() {
	jslogTRONapplication.update();
	updateScoreBoard(jslogTRONapplication.getScores());
}

function draw() {
	jslogTRONapplication.draw();
}

function createScoreBoard(scores) {
	jQuery(".scoreboard ol").empty();
	scores.forEach(function (item, index) {
		jQuery(".scoreboard ol").append('<li class="player' + index + '">' + item["score"] + '</li>');
		jQuery(".player" + index).css("color", item["colour"]);
	});
}

function updateScoreBoard(scores) {
	if (scoreRecord !== JSON.stringify(scores)) {
		scoreRecord = JSON.stringify(scores);
		scores.forEach(function (item, index) {
			jQuery(".player" + index).text(item["score"]);
		});
	}
}

function loadGameOptions() {

	var playerForms 	= jQuery("form.player-options").get(),
		environmentForm = jQuery("form.game-options").get(),
		o;

	environment = serialiseFormDataComplete(environmentForm);

	players = playerForms.map(function (form, index) {
		o = serialiseFormDataComplete(form);
		o.playerNumber = index;
		return o;
	});
}

function createCanvas() {

	canvas = document.createElement("canvas");
	canvas.width = environment.fieldWidth;
	canvas.height = environment.fieldHeight;
	ctx = canvas.getContext("2d");
	jQuery(".canvasBlock").empty();
	jQuery(".canvasBlock").append(canvas);

	environment.ctx = ctx;
}

function registerKeystateListener() {
	
	keystate = {};
	document.addEventListener("keydown", function (evt) {
		keystate[evt.keyCode] = 1;
	});
	document.addEventListener("keyup", function (evt) {
		delete keystate[evt.keyCode];
	});

	environment.keystate = keystate;
}

var storeKeycode = (function storeKeycode () {

	var keycodeLookup = getKeycodeLookup();

	var lookup = function lookup(evt) {
		var textBox = evt.target,
			charCode = (evt.which) ? evt.which : event.keyCode,
			lblCharCode = jQuery(textBox).siblings("span")[0],
			hiddeninput = jQuery(textBox).siblings("input")[0];

		textBox.value = keycodeLookup[charCode];
		lblCharCode.innerHTML = 'KeyCode:  ' + charCode;
		hiddeninput.value = charCode;
	};

	return lookup;
}());

main();