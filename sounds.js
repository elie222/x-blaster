// Sound manager for the game
class SoundManager {
    constructor() {
        this.sounds = {};
        this.muted = false;
        this.themeMusic = null;
        this.themePlaying = false;
    }

    // Load a sound file
    load(name, url) {
        const sound = new Audio(url);
        this.sounds[name] = sound;
        return sound;
    }

    // Load theme music
    loadTheme(url) {
        this.themeMusic = new Audio(url);
        this.themeMusic.loop = true; // Loop the theme music
        this.themeMusic.volume = 0.3; // Lower volume for background music
        return this.themeMusic;
    }

    // Play a sound effect
    play(name) {
        if (this.muted || !this.sounds[name]) return;
        
        // Clone the audio to allow multiple instances to play simultaneously
        const soundClone = this.sounds[name].cloneNode();
        soundClone.volume = 0.5; // Set volume to 50%
        soundClone.play();
    }

    // Play theme music
    playTheme() {
        if (this.muted || !this.themeMusic || this.themePlaying) return;
        
        // Create a user interaction promise
        const playPromise = this.themeMusic.play();
        
        // Handle the promise
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Theme music started successfully');
                    this.themePlaying = true;
                })
                .catch(error => {
                    console.error('Error playing theme music:', error);
                    // We'll try again later when there's user interaction
                });
        } else {
            // Older browsers might not return a promise
            this.themePlaying = true;
        }
    }

    // Pause theme music
    pauseTheme() {
        if (!this.themeMusic || !this.themePlaying) return;
        
        this.themeMusic.pause();
        this.themePlaying = false;
    }

    // Toggle mute state
    toggleMute() {
        this.muted = !this.muted;
        
        // Mute/unmute all sounds including theme
        if (this.themeMusic) {
            if (this.muted) {
                this.themeMusic.pause();
                this.themePlaying = false;
            } else if (this.themePlaying) {
                this.themeMusic.play();
            }
        }
        
        return this.muted;
    }
}

// Create the sound manager and make it globally available
window.soundManager = new SoundManager();

// Log that the sound manager is ready
console.log('Sound manager created and ready to use');
