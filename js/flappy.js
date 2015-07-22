var actions = { preload: preload, create: create, update: update };

var width = 700;
var height = 400;
var game = new Phaser.Game(width, height, Phaser.AUTO, "game", actions);
var score = 0;
var labelScore;
var player;
var pipes = [];
var jumpPower = 170;
var gameSpeed = 200;
var gameGravity = 200;
var pipeInterval = 1.75;
var balloons = [];
var weights = [];


/*
$.get("/score", function(data){
    var scores = JSON.parse(data);
    for (var i = 0; i < scores.length; i++) {
        $("#first").append("<h3>" + scores[i].name + ": " +
        scores[i].score + "</h3>");
    }
});*/


/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("playerImg", "../assets/minion.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("backgroundImg", "../assets/bedroom.png");    // to add a background
    game.load.image("pipe","../assets/pipe.png");
    game.load.image("balloons","../assets/balloons.png");
    game.load.image("weight","../assets/weight.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.add.image(0, 0, "backgroundImg");
    //game.add.text(400, 18, "Welcome to the minion's world!", {font: "28px Georgia", fill:"#F0EB49"} );    // The first: x, the second: y axis
    labelScore = game.add.text(20, 20, "0", {fill:"#F05549"});
    player = game.add.sprite(80, 200, "playerImg");
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.gravity.y = gameGravity;

    /*
    Leap.loop({enableGestures: true}, function(frame) {
        console.log(frame); 1
        if(frame.valid && frame.gestures.length > 0) { 2
            frame.gestures.forEach(function(gesture) { 3
                console.log(gesture); 1
                if(gesture.type == "keyTap"){ 4
                    playerJump();
                }
            });
        }
    });*/


    game
        .input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    game
        .time
        .events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);



    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    game.physics.arcade .overlap(player, pipes, gameOver);
    if(player.body.y < 0 || player.body.y > 400){
        gameOver();
    }
    checkBonus(balloons, -50);
    checkBonus(weights, 50);
}


function addPipeBlock(x, y) {
    var pipe = game.add.sprite(x,y,"pipe");
    pipes.push(pipe);
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = -jumpPower;
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(1, 4);
    for (var count = 2; count < 8; count++) {
        if(count != gapStart && count != gapStart+1){
            addPipeBlock(750, count * 50);
        }
    }
    changeScore();
}

function playerJump() {
    player.body.velocity.y = -gameSpeed;
}

function changeScore() {
    score++;
    labelScore.setText(score.toString());
}

function gameOver() {
    $("#score").val(score);
    game.paused=true;

    game.input
        .keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(startGame);
}

function startGame(){
    game.paused=false;
    game.state.restart();
}

function checkBonus(bonusArray, bonusEffect) {
    // Step backwards in the array to avoid index errors from splice
    for(var i=bonusArray.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,bonusArray[i], function(){
            // destroy sprite
            bonusArray[i].destroy();
            // remove element from array
            bonusArray.splice(i,1);
            // apply the bonus effect
            changeGravity(bonusEffect);
        });
    }
}

function generate(){
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1){
        generateBalloons();
    } else if(diceRoll==2){
        generateWeight();
    } else {
        generatePipe();
    }
}

function generateBalloons(){
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -gameSpeed;
    bonus.body.velocity.y = -game.rnd.integerInRange(60,100);
}

function generateWeight(){
    var bonus = game.add.sprite(width, 0, "weight");
    weights.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -gameSpeed;
    bonus.body.velocity.y = game.rnd.integerInRange(60,100);
}

function changeGravity(g){
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}