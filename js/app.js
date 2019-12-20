
// Disable browser scrolling
window.addEventListener('keydown', function (x) {
    if (x.keyCode === 38 || e.keyCode === 40) {
        x.preventDefault();
    }
});

// Game object
class Game {
    constructor() {
        this.playerImage = 'images/char-boy.png';
    }

    // Acknowledge current slected character
    setPlayerImage(playerImage) {
        this.playerImage = playerImage;
        this.updatePlayerImage();
    }

    updatePlayerImage() {
        player.sprite = this.playerImage;
    }
}

// Modal object
class Modal {
    constructor(overlay) {
        this.overlay = overlay;
        const closeButton = overlay.querySelector('.close-button')
        closeButton.addEventListener('click', this.close.bind(this));
    }
    open() {
        this.overlay.classList.remove('hide');
    }

    close() {
        this.overlay.classList.add('hide');
    }
}

// Welcome the player and ask for name
const welcomePopUp = document.getElementById("welcome-popup");
const closing = document.getElementById("close-x");
const starting = document.getElementById("start");
const person = prompt("Please enter your name:", "Harry Potter");
if (person !== null) {
    welcomePopUp.style.display = "block";
    document.getElementById("welcome-message").innerHTML =
        "Hello " +
        person +
        "!<br /><br />Thank you for taking the time to try my game!<br /><br />Let's see if you can reach the water without getting hit by the bugs!";
}

window.onclick = function(event) {
    if (event.target == welcomePopUp) {
        welcomePopUp.style.display = "none";
    }
};
closing.onclick = function(event) {
    if (event.target == closing) {
        welcomePopUp.style.display = "none";
    }
};
starting.onclick = function(event) {
    if (event.target == starting) {
        welcomePopUp.style.display = "none";
    }
};

function closeWelcome() {
    startButton.addEventListener("click", function() {
        welcomePopUp.style.display = "none";
    });
    window.addEventListener("click", windowCloseWelcome);
    playAgain();
}

function windowCloseWelcome(e) {
    if (e.target == welcomePopUp) {
        welcomePopUp.style.display = "none";
    }
}

// Modal selector object
const modal = new Modal(document.querySelector('.modal-overlay'));


// The game object
let game = new Game();

//  playerImmages container selector
const charContainer = document.querySelector('.playerImages');

// Image Updater 3000
charContainer.addEventListener('click', function(event) {
    let element = event.target;
    if (element.hasAttribute('src')) {
        const playerImage = element.getAttribute('src');
        game.setPlayerImage(playerImage);

        // Append "clicked" class to selected character and remove it if another one is choosen 
        const chars = charContainer.children;
        for (playerDivChild of chars) {
            playerDivChild.classList.remove('clicked');
            element.classList.add('clicked');
        }
    }
});

// Enemies our player must avoid
// Bugs Spawner 4000
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    // Loop bugs when they go off canvas
    if (this.x > 550) {
        this.x = -100;
        this.speed = 100 + Math.floor(Math.random() * 512);
    }

    // Player collision sensor
    if (player.x < this.x + 60 &&
        player.x + 3 > this.x &&
        player.y < this.y + 25 &&
        30 + player.y > this.y) {
            alert('You lost! You collided with an enemy.');
            player.x = 200;
            player.y = 480;
        }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player object
const Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = game.playerImage;
};

// Player Spawner 6000
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player controller 9000
Player.prototype.handleInput = function(keyPress) {
    if (keyPress === 'left') {
        this.x -= this.speed + 50;
    } else if (keyPress === 'right') {
        this.x += this.speed + 50;
    } else if (keyPress === 'up') {
        this.y -= this.speed + 30;
    } else if (keyPress === 'down') {
        this.y += this.speed + 30;
    }
};

Player.prototype.update = function() {
    // Prevent player from moving off the canvas
    if (this.y > 380) {
        this.y = 380;
    }

    if (this.x > 400) {
        this.x = 400;
    }

    if (this.x < 0) {
        this.x = 0;
    }

    // Check if character has reached the water and won then rest game
    if (this.y < 0) {
        modal.open();
        // Note: ask if player wants to play again
        this.x = 200;
        this.y = 380;
    }
};

// Place all bugs objects in an array called allBugs
// Place the player object in a variable called player
const allBugs = [];
const bugsPosition = [60, 140, 220];
const player = new Player(200, 380, 50);
let bug;
bugsPosition.forEach(function(posY) {
    bug = new Enemy(0, posY, 100 + Math.floor(Math.random() * 512));
    allBugs.push(bug);
});

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
