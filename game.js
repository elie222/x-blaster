// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 700; // Increased height for more reading time
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 7;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 10;
const TWEET_WIDTH = 300;
const TWEET_HEIGHT = 100;
const TWEET_MIN_SPEED = 0.8; // Slightly slower minimum speed
const TWEET_MAX_SPEED = 2.5; // Much slower maximum speed for better readability
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
    { username: "@sandislonjsak", text: "You killed it, anyone who claims otherwise is lying" },
    { username: "@IronBrands16", text: "fack me thats insane haha" },
    { username: "@Dannybooboo0", text: "to be fair my tweets are 💥 for years and i still get zero likes and 25 views on X while other platforms sometimes millions" },
    { username: "@jeppig", text: "And inbetween all the tweeting you did actual cool stuff worth posting about..." },
    { username: "@AdamSinger", text: "vm" },
    { username: "@vapormensch", text: "Haters always gonna hate." },
    { username: "@p_d_y", text: "Crazy how much this platform has changed over that time!" },
    { username: "@MESTIZAFAN", text: "How many tweets do you think you had made before you \"took off\"?" },
    { username: "@Sundar_Das_", text: "exactly" },
    { username: "@ivanzugec", text: "That is impressive. Do you just have X open and then post whatever comes into your mind? My issue is I overthink whenever I want to post something. #justPost" },
    { username: "@0xFinish", text: "never stop tweeting" },
    { username: "@mrioszbo", text: "Damn I have to level up my posting game" },
    { username: "@G1Erik", text: "Thats insane!" },
    { username: "@0xNiks", text: "🤘" },
    { username: "@GarryXbot", text: "Exactly! Building a successful product isn't just about the idea or the execution — it's also about distribution." },
    { username: "@timpastoor", text: "Crazy how many people think success arrives overnight. And then when you tell them that they too can put in the work and achieve things, they get mad." },
    { username: "@BartStrapped", text: "now THAT puts things into perspective!" },
    { username: "@BusterScher", text: "Deserved" },
    { username: "@munro_research", text: "I actually don't understand how you find the time for the 37 tweets as well as the rest of the building/marketing/planning/selling etc" },
    { username: "@LilGbtc", text: "OG" },
    { username: "@natiakourdadze", text: "afaik, the algo divides impressions if you share tweets with minimal delay. Have you noticed any spike based on when you post?" },
    { username: "@takes12no1", text: "Tweets are quick if you tweet your authentic self and don't care too much about mistakes or what other people are thinking of you." },
    { username: "@mehabots", text: "this tweet took me 5 seconds" },
    { username: "@mehabots", text: "jamie dimon says that he only has 3 speeds: fast (normal things), very fast (for unimportant things) and very slow (complex important stuff)" },
    { username: "@ibocodes", text: "but what about when you write detailed tweets about development or marketing for example" },
    { username: "@raduUrsu", text: "like 1s, writing 5s - nice!" },
    { username: "@davetist", text: "they still don't get that tweeting is also building/marketing/planning/selling" },
    { username: "@KaelCc", text: "at the same pace" }
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
    { username: "@lottery_winner", text: "I've discovered the SECRET FORMULA to winning the lottery EVERY TIME!!! DM me for details!!!" },
    { username: "@ai_guru_2025", text: "I'm using AI to generate PASSIVE INCOME of $10K/day!!! Join my exclusive program NOW!!! 🤖💸💸" },
    { username: "@health_revolution", text: "This BANNED superfood reverses aging by 20 YEARS!!! Scientists don't want you to know!!! 🍎⚠️🔥" },
    { username: "@secret_billionaire", text: "I'm giving away $5,000 to the first 100 people who retweet and follow!!! HURRY!!! 💰💰💰" },
    { username: "@viral_sensation", text: "This video will BLOW YOUR MIND!!! It's being DELETED from the internet!!! Watch before it's gone!!! 😲😲😲" },
    { username: "@brain_enhancer", text: "This pill increases your IQ by 50 POINTS OVERNIGHT!!! Used by TOP CEOs!!! LIMITED SUPPLY!!! 🧠💊💡" },
    { username: "@tax_free_income", text: "The IRS DOESN'T WANT YOU to know this ONE WEIRD TRICK to pay ZERO taxes LEGALLY!!! 💸💸💸" },
    { username: "@future_predictor", text: "I've been right about the market 98.7% of the time!!! Join my signals group NOW!!! 📈📉📊" },
    { username: "@hacked_account", text: "I can't believe this worked!!! I gained 10,000 followers in ONE DAY using this FREE tool!!! 😱😱😱" },
    { username: "@energy_revolution", text: "This device cuts your electricity bill by 90%!!! Power companies are FURIOUS!!! Order NOW!!! ⚡💸🔥" },
    { username: "@secret_society", text: "EXPOSED: The elite's SECRET plan for 2025!!! This will change EVERYTHING!!! Must see!!! 🔎🌐🔥" },
    { username: "@BlindinonX", text: "Distribution is key, but without a solid product, those followers won't mean much. It's about building something great first and then getting it in front of people." },
    { username: "@gaming_nostalgia", text: "Totally feel this! Remember when games were about pure enjoyment and not just graphic flexing? Indie developers are keeping the real spirit of gaming alive - focusing on gameplay, creativity, and actual fun instead of just rendering every blade of grass in 4K. 🎮✨" },
    { username: "@retro_gamer42", text: "Hard agree. The AAA industry has turned games into interactive movies with more loading than playing. Smaller studios and indie devs are the real MVPs right now, creating experiences that actually respect players' time and love of gaming. Quality over hyper-realistic graphics! 🕹️💯" },
    { username: "@gameplay_first", text: "It's like game devs forgot the most important thing: PLAYING should be fun! All these massive updates, 50GB downloads, and cinematic scenes that you can't even skip... Gamers just want to jump in and enjoy themselves, not wait around for perfect tech. Give me gameplay over graphics any day! 🎲" },
    { username: "@indie_advocate", text: "The obsession with photorealism and technical specs has completely overshadowed game design. Most AAA titles feel more like tech demos than actual games. Meanwhile, games like Hades and Stardew Valley prove that art style, mechanics, and pure fun matter way more than polygon count. 🌟" },
    { username: "@old_school_gamer", text: "Tech isn't everything. Some of the most memorable gaming experiences came from simpler times - Mario, Sonic, early RPGs. Now it's all about how many ray-traced reflections you can cram into a cutscene. Bring back games that are actually FUN to PLAY, not just to watch! 🕹️🔥" },
    { username: "@health_conscious", text: "Just switched to a plant-based diet and I'm never looking back. More energy, better sleep, and my skin is glowing! It's amazing how quickly your body responds when you give it what it actually needs instead of processed junk. Nature knows best! 🌱💪" },
    { username: "@mindful_investor", text: "The best investment advice I ever received: invest in what you understand, be patient, and ignore the daily noise. The market rewards those who think in decades, not days. Compound interest is truly the 8th wonder of the world. 📈🕒" },
    { username: "@productivity_coach", text: "Stop multitasking! It's killing your productivity and creativity. Our brains aren't designed to juggle multiple complex tasks. Instead, try time blocking - dedicate focused chunks of time to single tasks and watch your efficiency soar. Game changer! 📋⏰" },
    { username: "@travel_enthusiast", text: "The best travel experiences happen when you go off the beaten path. Skip the tourist traps and talk to locals about their favorite spots. That tiny restaurant down the alley with no English menu? That's where the real magic happens. 🌍📍" },
    { username: "@tech_philosopher", text: "We've created a world where we're always connected but rarely present. Next time you're with friends or family, try putting phones away. Real human connection is becoming our most precious and scarce resource in the digital age. 📱❌👤" },
    { username: "@climate_realist", text: "Small daily choices add up. Bring reusable bags, choose products with less packaging, eat less meat, walk when possible. We don't need a handful of people doing zero waste perfectly - we need millions doing it imperfectly. Every action matters. 🌎💚" },
    { username: "@career_mentor", text: "The skills that got you your first job won't get you promoted. Technical skills matter early on, but as you advance, emotional intelligence becomes the differentiator. Learn to navigate office politics, build relationships, and manage up effectively. 💼🔗" },
    { username: "@mental_wellness", text: "Normalize taking mental health days. Your brain needs rest just like your body does. We wouldn't expect someone to run on a broken leg, so why do we expect ourselves to perform with a struggling mind? Self-care isn't selfish, it's necessary. 🧠❤️" },
    { username: "@home_chef", text: "The secret to becoming a better cook isn't following more recipes - it's understanding the 'why' behind cooking techniques. Learn about acid, salt, fat, heat and you'll start to cook intuitively rather than just following instructions. Game changer! 🍳🔬" }
];

// Player object
class Player {
    constructor() {
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.x = (CANVAS_WIDTH - this.width) / 2;
        this.y = CANVAS_HEIGHT - this.height - 30; // Position player a bit higher
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
        this.trail = []; // Store previous positions for trail effect
        this.maxTrailLength = 5; // Maximum number of trail segments
    }

    update() {
        // Store current position for trail effect
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift(); // Remove oldest position if we exceed max length
        }
        
        // Move bullet
        this.y -= this.speed;
    }

    draw() {
        // Draw trail with gradient opacity
        for (let i = 0; i < this.trail.length; i++) {
            const pos = this.trail[i];
            const alpha = i / this.trail.length; // Fade out older trail segments
            ctx.fillStyle = `rgba(100, 200, 255, ${alpha * 0.7})`; // Blue trail with alpha
            ctx.fillRect(pos.x, pos.y, this.width, this.height * 0.8);
        }
        
        // Draw main bullet with glow effect
        ctx.fillStyle = '#00aaff'; // Bright blue for the bullet
        ctx.shadowColor = '#00aaff';
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0; // Reset shadow
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
        this.y = -1.5 * this.height; // Start tweets higher above the screen
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
        ctx.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color for all profiles
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
    constructor(x, y, color, maxRadius) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        // Use default parameter value instead of reassigning
        this.maxRadius = maxRadius ?? 40;
        this.expandSpeed = 2.5;
        this.color = color ?? '#ff0000';
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
    // Use a local variable instead of reassigning the parameter
    const cornerRadius = radius || 5;
    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + width - cornerRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
    ctx.lineTo(x + width, y + height - cornerRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
    ctx.lineTo(x + cornerRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
    ctx.lineTo(x, y + cornerRadius);
    ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
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
                    // Create multiple red explosions for wrong hit
                    explosions.push(new Explosion(tweet.x + (tweet.width / 2), tweet.y + (tweet.height / 2), '#ff0000', 60)); // Larger explosion
                    // Add some smaller explosions around it
                    for (let k = 0; k < 3; k++) {
                        const offsetX = (Math.random() - 0.5) * 40;
                        const offsetY = (Math.random() - 0.5) * 40;
                        explosions.push(new Explosion(
                            tweet.x + (tweet.width / 2) + offsetX,
                            tweet.y + (tweet.height / 2) + offsetY,
                            '#ff3333', // Slightly different red
                            30 // Smaller radius
                        ));
                    }
                    playSound('badHit');
                } else {
                    // Hit a spam tweet (good)
                    score += 100;
                    // Create multiple green explosions for correct hit
                    explosions.push(new Explosion(tweet.x + (tweet.width / 2), tweet.y + (tweet.height / 2), '#00ff00', 50)); // Main explosion
                    // Add some smaller explosions around it
                    for (let k = 0; k < 3; k++) {
                        const offsetX = (Math.random() - 0.5) * 40;
                        const offsetY = (Math.random() - 0.5) * 40;
                        explosions.push(new Explosion(
                            tweet.x + (tweet.width / 2) + offsetX,
                            tweet.y + (tweet.height / 2) + offsetY,
                            '#33ff33', // Slightly different green
                            25 // Smaller radius
                        ));
                    }
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
