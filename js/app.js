'use strict';

/*
This is over simplified a better solution might be to build a 2d array and maintain the location of each element there
when user or bug attempts to enter the same square we have a collision.  The below functions and is confidently correct.
 */
function inside(player, enemy) {
  return (player.x <= enemy.x + enemy.width && player.x + player.width >= enemy.x)
    && (player.y <= enemy.y + enemy.height && player.height + player.y >= enemy.y);
}

/*** Enemy Class ***/
var Enemy = function (x, y, speed) {
  this.y = y;
  this.x = x;
  this.speed = speed;
  this.height = 48; // Height and width set for collision detection.
  this.width = 55;
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  if (this.x < 550) {
    this.x += dt * this.speed;
  } else {
    // Reset enemy position and generate a new speed.
    this.x = -150;
    this.randomSpeed();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Generate random speed for each enemy.
Enemy.prototype.randomSpeed = function () {
  this.speed = 100 * (Math.random() * 10);
};

// This class requires an update(), render() and a handleInput() method.
var Player = function () {
  this.reset();
  this.sprite = 'images/char-boy.png';
  this.height = 50; // Height and width for collision detection.
  this.width = 40;
};

Player.prototype.handleInput = function (keyCode) {
  // Switch statement to handle keyboard inputs and keep the player within game bounds.
  var xShift = 101;
  var yShift = 83;
  switch (keyCode) {
    case 'left' :
      if (this.x > 0) {
        this.x -= xShift; // engine.js.
      }
      break;
    case 'right':
      if (this.x < 400) {
        this.x += xShift;
      }
      break;
    case 'up':
      if (this.y > 0) {
        this.y -= yShift; // engine.js
      }
      break;
    case 'down':
      if (this.y < 380) {
        this.y += yShift;
      }
      break;
  }
};

Player.prototype.update = function () {
  if (this.y <= 10) {
    this.reset(202, 380);
  }
  this.checkCollisions();
};

// Render the player character on the screen.
Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player position reset.
Player.prototype.reset = function () {
  this.x = 202;
  this.y = 380;
};

// Collision detection for enemy and player.
Player.prototype.checkCollisions = function () {
  allEnemies.forEach(function (enemy) {
    if (inside(this, enemy)) {
      this.reset();
    }
  }.bind(this));
};

// Place the player object in a variable called player
var player = new Player();

var allEnemies = [];

var enemyStartingPositions = [50, 140, 220]; // All possible Y locations for enemies.

// Create enemies and push them into allEnemies array.
enemyStartingPositions.forEach(function (y) {
  allEnemies.push(new Enemy(-1, y));
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});