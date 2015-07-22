// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(854, 480, Phaser.AUTO, 'game', stateActions);
var score = 0;
var labelScore;
var player;

jQuery("#form").on("submit", function(event_details) {
    var name = jQuery("#fullName").val();
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + name + " (" +
    jQuery("#email").val() + "): " + jQuery("#score").val() + "</p>");
    event_details.preventDefault();
});

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("pizzaImg", "../assets/minion.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("backgroundImg", "../assets/bedroom.png");    // to add a background
    game.load.image("pipe","../assets/pipe.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    //game.stage.setBackgroundColor("#D6F5FF");

    game.add.image(0, 0, "backgroundImg");
    generatePipe();
    //var background = game.add.image(0, 0, "backgroundImg");   //scale an image
    //background.width = 100;
    //background.height = 50;

    game.add.text(400, 18, "Welcome to the minion's world!", {font: "28px Georgia", fill:"#F0EB49"} );    // The first: x, the second: y axis
    //game.add.sprite(10, 270, "pizzaImg");

    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown
        .add(playerJump);

    //game.input.mouse.mouseDownCallback = clickHandler;

    //game.input

    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);

    labelScore = game.add.text(20, 20, "0", {fill:"#F05549"});
    changeScore();


    //player = game.add.sprite(100, 200, "pizzaImg");
    //player.width = 110;
    //player.height = 110;
    //player.x = 0;
    //player.y = 200;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(80, 200, "pizzaImg");
    player.width = 110;
    player.height = 110;
    player.x = 0;
    player.y = 200;
    game.physics.arcade.enable(player);

    player.body.velocity.y = 0;
    //player.body.velocity.x = 100;

    /*
    for(var count=0; count<8; count+=1){
        game.add.sprite(20, 50*count, "pipe");
    }*/

}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

}

function clickHandler(event) {
    console.log(event);

    if (game.input.mouse.button === Phaser.Mouse.RIGHT_BUTTON) {
        alert("let's start eating pizza!");
        alert("The position is: " + event.x + "," + event.y);
    }
}

function playerJump(event) {
    //game.add.sprite(event.x, event.y, "pizzaImg");
   // game.sound.play("score");
    moveUp();
}

function changeScore() {
    score = score + 1;
    labelScore.setText("Score: "+score.toString());
}

function moveRight() {
    player.x = player.x + 20
}
function moveLeft() {
    player.x = player.x - 20
}
function moveUp() {
    player.y = player.y - 20
}
function moveDown() {
    player.y = player.y + 20
}

function generatePipe(){
    var gapStart = game.rnd.integerInRange(5, 8);
    var gapStart2 = game.rnd.integerInRange(5, 8);
    var gapStart3 = game.rnd.integerInRange(5, 8);
    for (var count=5; count<8; count++) {
        if(count != gapStart && count != gapStart + 1) {
            game.add.sprite(150, count * 50, "pipe");
        }
        if(count != gapStart2 && count != gapStart2 + 1) {
            game.add.sprite(300, count * 50, "pipe");
        }
        if(count != gapStart3 && count != gapStart3 + 1) {
            game.add.sprite(500, count * 50, "pipe");
        }
    }

}