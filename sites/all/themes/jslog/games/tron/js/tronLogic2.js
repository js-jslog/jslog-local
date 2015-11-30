// critisisms
// 1. Not a consistent approach between the delegate prototypes and the mixin functions. There are a lot of exposed keys in the delegates which would ideally be hidden like they are in the mixin functions
//     could turn all delegates into interfaces with nothing implemented and create a as..Delegate to include this behaviour
// 2. Having the buildPaths & testPlayers defined inside the fieldDelegates object exposes the implementation and means that this array will be rebuilt each time the update method is called. This is expensive but can be afforded at the moment. I do not want this variable defined outside this functions scope confusing the implementation. More evidence that we should somehow encapsulate this functionality away by turning the delegate into an interface and adding closure implementations
// 3. Having a getX and getY mean that we can round to whole pixels for display purposes but does make the exposure of x & y unnecessary. More evidence for hidden implementation

// complements
// 1. Using the bind function in asDigiMover to avoid having to set originalInit as another 'this'.
// making a copy of the pathsRecords array inside fieldDelegate.buildPaths so that we don't corrupt the players path record when we reverse it
// 



// Game options
// Number of players
// Colour of players
// Whether players own line can kill you or not
// Teams
// Whether players line is filled or stroked
// Have a little animation to show who has died and then if anyone else crashes in the mean time they lose points too

var jslogTRONapplication = {};

(function (exports) {

	(function (exports) {

		// application vars
		var WIDTH, HEIGHT, ctx, keystate, deathLimit, restartDelay,

			pi = Math.PI,
			radianLookup = {E : pi*0,	SE : pi*0.25,
							S : pi*0.5,	SW : pi*0.75,
							W : pi*1,	NW : pi*1.25,
							N : pi*1.5,	NE : pi*1.75
						},
			field,
			playerOptions,
			players,
			scores;

		// public API
		var publicAPI = {
			initialise : function initialise (envOptions, playerOpts) {
				WIDTH 		= envOptions.fieldWidth;
				HEIGHT 		= envOptions.fieldHeight;
				ctx 		= envOptions.ctx;
				keystate 	= envOptions.keystate;
				deathLimit	= envOptions.deathLimit;
				restartDelay= envOptions.restartDelay * 1000;

				playerOptions = playerOpts;

				scores = [];
				playerOptions.forEach(function (player) {
					scores.push({score : 0, colour : player.colour});
				});

				field 	= Object.create(fieldDelegate);
				field.initialise();
			},
			update : function update () {
				field.update();
				players.forEach(function (player) {
					player.update();
				});
			},
			draw : function draw () {
				field.draw();

				ctx.save();
				ctx.fillStyle = "#ff0000";
				ctx.strokeStyle = "#ff0000";

				players.forEach(function (player) {
					player.draw();
				});
				ctx.restore();
			},
			getScores : function getScores () {
				return scores;
			}
		};

		// create field prototype to delegate functionality to
		var fieldDelegate = {
			initialise : function initialise () {
				var player;
				this.roundOverFlag = false;
				this.paths = [];
				players = [];
				playerOptions.forEach(function (options) {
					player = Object.create(playerDelegate);
					asDigiMover.call(player);
					player.initialise(options);
					players.push(player);
				});
			},
			update : function update () {
				this.testPlayers();
				this.buildPaths();
			},
			draw : function draw () {
				ctx.fillRect(0, 0, WIDTH, HEIGHT);

				ctx.save();

				this.paths.forEach(function (path, index) {
					ctx.fillStyle = players[index].colour;
					ctx.strokeStyle = players[index].colour;

					ctx.fill(path);
					//ctx.stroke(path);
				});

				ctx.restore();
			},
			testPlayers : function testPlayers () {
				var that = this;
				var isOutOfBounds = function isOutOfBounds (player) {
					return (player.getPos()[0] <= 0 || player.getPos()[0] >= WIDTH || player.getPos()[1] <= 0 || player.getPos()[1] >= HEIGHT);
				};
				var isOnPath = function isOnPath (player) {
					var result = that.paths.some(function (path) {
						return ctx.isPointInPath(path, player.x, player.y);
						//return ctx.isPointInStroke(path, player.x, player.y);
					});
					return result;
				};
				var newRound = players.filter(function (player, index, array) {
					if (player.alive){
						if (isOutOfBounds(player) || isOnPath(player)) {
							scores[index].score = scores[index].score +1;
							player.die();
							return true;
						}
					}
				});

				if (newRound.length > 0 && this.roundOverFlag !== true) {
					this.roundOverFlag = true;
					setTimeout(function () {that.initialise();}, restartDelay);
				}
			},
			buildPaths : function buildPaths () {
				var that = this;
				
				that.paths = [];
				players.forEach(function (player) {
					var path = new Path2D(),
						pathRecord = [].slice.call(player.getPath(), 0).reverse();

					path.moveTo(pathRecord[0][0], pathRecord[0][1]);
					pathRecord.forEach(function (coord) {
						path.lineTo(coord[0], coord[1]);
					});

					that.paths.push(path);
				});
			}
		};

		// create player prototype to delegate functionality to
		var playerDelegate = {
			initialise : function intialise (options) {
				this.alive 	= true;
				this.plNo	= options.playerNumber;
				this.x 		= options.x 		|| WIDTH/2;
				this.y 		= options.y 		|| HEIGHT/2;
				this.v 		= options.speed 	|| 1;
				this.d 		= radianLookup[options.direction] || radianLookup.E;
				this.size 	= options.size 		|| 6;
				if (this.size%2 === 0) {
        			this.size += 1;
      			}
      			this.offset  = Math.floor(this. size/2);
				this.colour  = options.colour;
				this.leftKey = options.leftKey;
				this.rightKey= options.rightKey;
				this.turnCirc= options.turningCircle;
				if (scores[this.plNo].score == deathLimit) {
					this.die();
				}
			},
			update : function update () {
				if (this.alive) {
					this.keyResponse();
					this.move();
					this.logPath();
				}
			},
			renderShape : function renderShape () {
				ctx.fillRect(this.getPos()[0]-this.offset, this.getPos()[1]-this.offset, this.size, this.size);
			},
			renderDead : function renderDead () {
				ctx.strokeRect(this.getPos()[0]-this.offset, this.getPos()[1]-this.offset, this.size, this.size);
			},
			draw : function draw () {
				ctx.save();
				ctx.fillStyle = this.colour;
				ctx.strokeStyle = this.colour;
				this.renderShape();
				ctx.restore();

			},
			getPos : function getPos () {
				return [Math.round(this.x), Math.round(this.y)];
			},
			die : function die () {
				this.alive = false;
				this.renderShape = this.renderDead;
			},
			move : function move () {
				throw "player delegate requires implementing mixin of move method";
			},
			logPath : function logPath () {
				throw "player delegate requires implementing mixin of logPath method";
			},
			keyResponse : function keyResponse () {
				throw "player delegate requires implementing mixin of keyResponse method";
			},
			getPath	: function getPath() {
				throw "player delegate requires implementing mixin of getPath method";
			},
			turnLeft	: function turnLeft() {
				throw "player delegate requires implementing mixin of turnLeft method";
			},
			turnRight	: function turnRight() {
				throw "player delegate requires implementing mixin of turnRight method";
			}
		};

		var asDigiMover = function asDigiMover () {
			var pathCommands,
				changeDirFlag,
				originalInit = this.initialise.bind(this);

			this.initialise = function initialise (options) {
				originalInit(options);
				changeDirFlag = true;
				pathCommands = [[this.x, this.y]];
			};
			this.move = function move () {
				this.x += this.v * Math.cos(this.d);
				this.y += this.v * Math.sin(this.d);
			};
			this.logPath = function logPath () {
				if (changeDirFlag === true) {
					pathCommands.unshift([this.x, this.y]);
					changeDirFlag = false;
				} else {
					pathCommands[0] = [this.x, this.y];
				}
			};
			this.keyResponse = function keyResponse () {
				if (keystate[this.leftKey] === 1) {
					this.turnLeft();
				} else if (keystate[this.rightKey] === 1) {
					this.turnRight();
				}
			};
			this.getPath = function getPath () {
				return pathCommands;
			};
			this.turnLeft = function turnLeft () {
				changeDirFlag = true;
				this.d -= (pi*this.turnCirc);
				keystate[this.leftKey] = 0;
			};
			this.turnRight = function turnLeft () {
				changeDirFlag = true;
				this.d += (pi*this.turnCirc);
				keystate[this.rightKey] = 0;
			};
		};




		jQuery.extend(exports, publicAPI);
	}((typeof exports === 'undefined') ? window : exports));

}(jslogTRONapplication));

// field needs to :
// 1. expose an initialise, update and draw functions
// 2. maintain a path object which can 