// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 7;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 10;
const TWEET_WIDTH = 300;
const TWEET_HEIGHT = 100;
const TWEET_MIN_SPEED = 1;
const TWEET_MAX_SPEED = 4;
const TWEET_SPAWN_RATE = 1500; // milliseconds
const REAL_TWEET_PROBABILITY = 0.6; // 60% chance of real tweet

// Game variables
let canvas;
let ctx;
let player;
let bullets;
let tweets;
let explosions;
let score;
let lives;
let level;
let gameActive;
let gameLoop;
let lastTweetSpawn;
let spawnRate;

// DOM elements
let scoreDisplay;
let livesDisplay;
let levelDisplay;
let startScreen;
let gameOverScreen;
let finalScoreDisplay;
let startButton;
let restartButton;

// Sound manager
let soundManager;

// Sample tweet content
const realTweets = [
    { username: "@nature_lover", text: "Just saw the most beautiful sunset at the beach today! 🌅" },
    { username: "@coffee_addict", text: "Nothing beats a fresh cup of coffee on a Monday morning ☕" },
    { username: "@book_worm", text: "Just finished reading that new novel everyone's talking about. Highly recommend!" },
    { username: "@food_explorer", text: "Made homemade pasta for the first time today. It was actually easier than I thought!" },
    { username: "@tech_enthusiast", text: "The new software update fixed all the bugs I was experiencing. So much smoother now!" },
    { username: "@movie_buff", text: "Just watched that new superhero movie. The special effects were amazing!" },
    { username: "@fitness_junkie", text: "Completed my first 10k run today! Feeling proud and exhausted." },
    { username: "@pet_parent", text: "My cat just knocked over my plant for the third time this week. Still love her though!" },
    { username: "@music_fan", text: "That new album just dropped and I can't stop listening to it on repeat!" },
    { username: "@travel_bug", text: "Planning my next vacation to Japan. Any recommendations for Tokyo?" }
];

const spamTweets = [
    { username: "@get_rich_quick99", text: "MAKE $5000 DAILY with this ONE SIMPLE TRICK!!! Click here NOW!!! 💰💰💰" },
    { username: "@not_a_scam_bot", text: "CONGRATULATIONS! You've been selected to receive a FREE iPhone 15! Claim NOW before offer expires!!!" },
    { username: "@crypto_millionaire", text: "I made $1M in 24 HOURS using this secret crypto strategy!!! DM me to learn how!!! 🚀🚀🚀" },
    { username: "@miracle_cure", text: "Doctors HATE this! Local mom discovers miracle cure for ALL diseases! Click to learn more!!!" },
    { username: "@prize_winner_alert", text: "URGENT: You've WON our $10,000 giveaway! Send your bank details to claim your prize NOW!!!" },
    { username: "@account_security", text: "⚠️ SECURITY ALERT: Your account has been compromised! Click here to verify your identity IMMEDIATELY!" },
    { username: "@celebrity_secrets", text: "SHOCKING: You won't BELIEVE what this celebrity did! Click to see the EXCLUSIVE photos!!!" },
    { username: "@weight_loss_miracle", text: "LOSE 50 POUNDS in just 2 WEEKS with this revolutionary pill! No diet or exercise needed!!!" },
    { username: "@investment_guru", text: "INSIDER INFO: This penny stock is about to EXPLODE!!! Invest NOW before it's too late!!! 📈📈📈" },
    { username: "@lottery_winner", text: "I've discovered the SECRET FORMULA to winning the lottery EVERY TIME!!! DM me for details!!!" }
];

// Player object
class Player {
    constructor() {
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.x = (CANVAS_WIDTH - this.width) / 2;
        this.y = CANVAS_HEIGHT - this.height - 20;
        this.speed = PLAYER_SPEED;
        this.movingLeft = false;
        this.movingRight = false;
        this.shooting = false;
        this.lastShot = 0;
        this.shootDelay = 300; // milliseconds between shots
    }

    update() {
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x < CANVAS_WIDTH - this.width) {
            this.x += this.speed;
        }
    }

    draw() {
        // Draw player ship
        ctx.fillStyle = '#1da1f2';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Draw cockpit
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shootDelay) {
            bullets.push(new Bullet(this.x + this.width / 2 - BULLET_WIDTH / 2, this.y));
            this.lastShot = now;
            playSound('shoot');
        }
    }
}

// Bullet object
class Bullet {
    constructor(x, y) {
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        this.x = x;
        this.y = y;
        this.speed = BULLET_SPEED;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.y + this.height < 0;
    }
}

// Tweet object
class Tweet {
    constructor(isReal) {
        this.width = TWEET_WIDTH;
        this.height = TWEET_HEIGHT;
        this.x = Math.random() * (CANVAS_WIDTH - this.width);
        this.y = -1 * this.height;
        this.speed = TWEET_MIN_SPEED + Math.random() * (TWEET_MAX_SPEED - TWEET_MIN_SPEED);
        this.isReal = isReal;
        
        // Select tweet content
        const tweetSource = isReal ? realTweets : spamTweets;
        const tweetData = tweetSource[Math.floor(Math.random() * tweetSource.length)];
        this.username = tweetData.username;
        this.text = tweetData.text;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        // Draw tweet background
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1da1f2'; // All tweets have the same border color now
        ctx.lineWidth = 3;
        roundRect(ctx, this.x, this.y, this.width, this.height, 10, true, true);

        // Draw profile image
        ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16); // Random color for all profiles
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 30, 20, 0, Math.PI * 2);
        ctx.fill();

        // Draw username and text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial'; // Increased font size for username
        ctx.fillText(this.username, this.x + 60, this.y + 30);
        
        ctx.font = '14px Arial'; // Increased font size for tweet text
        wrapText(ctx, this.text, this.x + 60, this.y + 50, this.width - 70, 18);
    }

    isOffScreen() {
        return this.y > CANVAS_HEIGHT;
    }
}

// Explosion effect
class Explosion {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = 40;
        this.expandSpeed = 2;
        this.color = color || '#ff0000';
        this.alpha = 1;
    }

    update() {
        this.radius += this.expandSpeed;
        this.alpha -= 0.05;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    isFinished() {
        const finished = this.alpha <= 0;
        return finished;
    }
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

// Helper function to wrap text
function wrapText(ctx, text, xPos, yPos, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineCount = 0;
    
    // Use local variables instead of modifying parameters
    const currentX = xPos;
    let currentY = yPos;

    for (let n = 0; n < words.length; n++) {
        testLine = `${line}${words[n]} `;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, currentX, currentY);
            const nextWord = `${words[n]} `;
            line = nextWord;
            currentY += lineHeight;
            lineCount++;
            if (lineCount >= 3) return; // Limit to 3 lines
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, currentX, currentY);
}

// Sound effects are handled by the soundManager variable declared above

function initSounds() {
    // Load sounds.js directly in index.html instead of dynamically
    // This ensures it's loaded before game.js
    
    // Initialize sound effects
    if (window.soundManager) {
        soundManager = window.soundManager;
        
        // Load sound effects using the audio files
        soundManager.load('shoot', 'audio/explosion-312361.mp3');
        soundManager.load('goodHit', 'audio/explosion-312361.mp3');
        soundManager.load('badHit', 'audio/explosion-312361.mp3');
        soundManager.load('gameOver', 'audio/explosion-312361.mp3');
        
        // Load theme music
        soundManager.loadTheme('audio/X Blaster Theme Song.mp3');
        
        console.log('Sound manager initialized successfully');
    } else {
        console.error('Sound manager not found');
    }
    
    // Add mute button to UI
    const gameUI = document.getElementById('game-ui');
    const muteButton = document.createElement('div');
    muteButton.id = 'mute-button';
    muteButton.textContent = '🔊';
    muteButton.style.cursor = 'pointer';
    muteButton.addEventListener('click', () => {
        if (soundManager) {
            const muted = soundManager.toggleMute();
            muteButton.textContent = muted ? '🔇' : '🔊';
        }
    });
    gameUI.appendChild(muteButton);
}

function playSound(name) {
    if (soundManager) {
        soundManager.play(name);
    }
}

// Game initialization
function init() {
    // Get canvas and context
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Get DOM elements
    scoreDisplay = document.getElementById('score');
    livesDisplay = document.getElementById('lives');
    levelDisplay = document.getElementById('level');
    startScreen = document.getElementById('start-screen');
    gameOverScreen = document.getElementById('game-over-screen');
    finalScoreDisplay = document.getElementById('final-score');
    startButton = document.getElementById('start-button');
    restartButton = document.getElementById('restart-button');

    // Add event listeners with audio initialization
    startButton.addEventListener('click', () => {
        // Try to play audio on user interaction
        if (soundManager) {
            // Create a silent audio context to unlock audio
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const unlockSource = audioContext.createBufferSource();
            unlockSource.buffer = audioContext.createBuffer(1, 1, 22050);
            unlockSource.connect(audioContext.destination);
            unlockSource.start(0);
            
            // Now try to play the theme
            soundManager.playTheme();
        }
        startGame();
    });
    restartButton.addEventListener('click', () => {
        if (soundManager) {
            soundManager.playTheme();
        }
        startGame();
    });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Initialize sounds
    initSounds();
}

// Start game
function startGame() {
    // Reset game state
    player = new Player();
    bullets = [];
    tweets = [];
    explosions = [];
    score = 0;
    lives = 3;
    level = 1;
    spawnRate = TWEET_SPAWN_RATE;
    lastTweetSpawn = Date.now();
    gameActive = true;

    // Update UI
    updateUI();

    // Hide screens
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Play theme music when game starts
    if (soundManager) {
        // Try to play theme music with a user gesture
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Create and play a short silent sound to unlock audio
        const unlockSound = audioContext.createBufferSource();
        unlockSound.buffer = audioContext.createBuffer(1, 1, 22050);
        unlockSound.connect(audioContext.destination);
        unlockSound.start(0);
        
        // Now try to play the theme music
        setTimeout(() => {
            soundManager.playTheme();
            console.log('Attempting to play theme music');
        }, 100);
    }

    // Start game loop
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(update);
}

// Game over
function gameOver() {
    gameActive = false;
    finalScoreDisplay.textContent = score;
    gameOverScreen.classList.remove('hidden');
    
    // Play game over sound and pause theme music
    playSound('gameOver');
    if (soundManager) {
        soundManager.pauseTheme();
    }
}

// Update UI
function updateUI() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    levelDisplay.textContent = level;
}

// Handle keyboard input
function handleKeyDown(e) {
    if (!gameActive) return;

    switch (e.key) {
        case 'ArrowLeft':
            player.movingLeft = true;
            break;
        case 'ArrowRight':
            player.movingRight = true;
            break;
        case ' ':
            player.shooting = true;
            break;
    }
}

function handleKeyUp(e) {
    switch (e.key) {
        case 'ArrowLeft':
            player.movingLeft = false;
            break;
        case 'ArrowRight':
            player.movingRight = false;
            break;
        case ' ':
            player.shooting = false;
            break;
    }
}

// Spawn tweets
function spawnTweet() {
    const now = Date.now();
    if (now - lastTweetSpawn > spawnRate) {
        const isReal = Math.random() < REAL_TWEET_PROBABILITY;
        tweets.push(new Tweet(isReal));
        lastTweetSpawn = now;

        // Increase difficulty with level
        spawnRate = TWEET_SPAWN_RATE - (level - 1) * 100;
        spawnRate = Math.max(spawnRate, 500); // Minimum spawn rate
    }
}

// Check collisions
function checkCollisions() {
    // Check bullet-tweet collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = tweets.length - 1; j >= 0; j--) {
            if (collision(bullets[i], tweets[j])) {
                // Remove bullet
                bullets.splice(i, 1);

                // Handle tweet hit
                const tweet = tweets[j];
                if (tweet.isReal) {
                    // Hit a real tweet (bad)
                    score -= 150;
                    explosions.push(new Explosion(tweet.x + (tweet.width / 2), tweet.y + (tweet.height / 2), '#ff0000'));
                    playSound('badHit');
                } else {
                    // Hit a spam tweet (good)
                    score += 100;
                    explosions.push(new Explosion(tweet.x + (tweet.width / 2), tweet.y + (tweet.height / 2), '#00ff00'));
                    playSound('goodHit');
                }

                // Remove tweet
                tweets.splice(j, 1);
                
                // Update level based on score
                const newLevel = Math.floor(score / 1000) + 1;
                level = Math.max(newLevel, 1);
                
                // Update UI
                updateUI();
                
                break; // Break since bullet is gone
            }
        }
    }

    // Check tweets reaching bottom
    for (let i = tweets.length - 1; i >= 0; i--) {
        if (tweets[i].isOffScreen()) {
            const tweet = tweets[i];
            if (tweet.isReal) {
                // Real tweet passed safely (good)
                score += 25;
            } else {
                // Spam tweet reached bottom (bad)
                score -= 50;
                lives--;
                if (lives <= 0) {
                    gameOver();
                }
            }
            tweets.splice(i, 1);
            updateUI();
        }
    }
}

// Check collision between two objects
function collision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Main game update loop
function update() {
    if (!gameActive) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update player
    player.update();
    if (player.shooting) {
        player.shoot();
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        if (bullets[i].isOffScreen()) {
            bullets.splice(i, 1);
        }
    }

    // Spawn and update tweets
    spawnTweet();
    for (let i = 0; i < tweets.length; i++) {
        tweets[i].update();
    }

    // Update explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].update();
        if (explosions[i].isFinished()) {
            explosions.splice(i, 1);
        }
    }

    // Check collisions
    checkCollisions();

    // Draw everything
    for (let i = 0; i < tweets.length; i++) {
        tweets[i].draw();
    }
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw();
    }
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].draw();
    }
    player.draw();

    // Continue game loop
    gameLoop = requestAnimationFrame(update);
}

// Initialize game when page loads
window.addEventListener('load', init);
