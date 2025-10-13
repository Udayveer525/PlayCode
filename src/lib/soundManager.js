import bgMusicFile from "../assets/music/background.mp3";
import collectStarFile from "../assets/music/starCollect.mp3";
import winFile from "../assets/music/success.wav";
import failFile from "../assets/music/fail.wav";

class SoundManager {
  constructor() {
    this.sounds = {};
    this.bgMusic = null;
    this.isMuted = false;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.isInitialized = false;
    this.musicPlayPromise = null;
  }

  // Preload all sounds
  preloadSounds() {
    if (this.isInitialized) return;

    try {
      // SFX sounds
      this.sounds = {
        collectStar: new Audio(collectStarFile),
        win: new Audio(winFile),
        fail: new Audio(failFile),
      };

      // Set volumes for SFX
      Object.values(this.sounds).forEach((sound) => {
        sound.volume = this.sfxVolume;
        sound.preload = "auto"; // Preload the audio
      });

      // Background music setup
      this.bgMusic = new Audio(bgMusicFile);
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.musicVolume;
      this.bgMusic.preload = "auto";

      // Handle load errors gracefully
      this.bgMusic.addEventListener("error", (e) => {
        console.warn("Background music failed to load:", e);
      });

      Object.entries(this.sounds).forEach(([name, sound]) => {
        sound.addEventListener("error", (e) => {
          console.warn(`Sound "${name}" failed to load:`, e);
        });
      });

      this.isInitialized = true;
      console.log("✅ Sound Manager initialized");
    } catch (error) {
      console.error("Error initializing sounds:", error);
    }
  }

  // Play sound effect
  playSFX(soundName) {
    if (this.isMuted || !this.sounds[soundName]) return;

    try {
      const sound = this.sounds[soundName];

      // Reset to start
      sound.currentTime = 0;

      // Use promise to handle play
      const playPromise = sound.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Sound playing successfully
          })
          .catch((err) => {
            console.log(`SFX "${soundName}" play blocked:`, err.name);
          });
      }
    } catch (error) {
      console.log(`Error playing SFX "${soundName}":`, error);
    }
  }

  // Start background music
  playMusic() {
    if (this.isMuted || !this.bgMusic) return;

    try {
      // Wait for previous play promise to resolve before playing again
      if (this.musicPlayPromise !== null) {
        this.musicPlayPromise
          .then(() => this.startMusic())
          .catch(() => this.startMusic());
      } else {
        this.startMusic();
      }
    } catch (error) {
      console.log("Error starting music:", error);
    }
  }

  // Internal method to actually start music
  startMusic() {
    if (!this.bgMusic) return;

    this.musicPlayPromise = this.bgMusic.play();

    if (this.musicPlayPromise !== undefined) {
      this.musicPlayPromise
        .then(() => {
          console.log("🎵 Background music playing");
          this.musicPlayPromise = null;
        })
        .catch((err) => {
          console.log("Music play blocked:", err.name);
          this.musicPlayPromise = null;
        });
    }
  }

  // Stop background music
  stopMusic() {
    if (!this.bgMusic) return;

    // Wait for play promise to resolve before pausing
    if (this.musicPlayPromise !== null) {
      this.musicPlayPromise
        .then(() => {
          this.bgMusic.pause();
          this.bgMusic.currentTime = 0;
        })
        .catch(() => {
          // Already stopped/failed
        });
    } else {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }

    this.musicPlayPromise = null;
  }

  // Pause background music
  pauseMusic() {
    if (!this.bgMusic) return;

    if (this.musicPlayPromise !== null) {
      this.musicPlayPromise
        .then(() => {
          this.bgMusic.pause();
        })
        .catch(() => {
          // Already paused/failed
        });
    } else {
      this.bgMusic.pause();
    }
  }

  // Resume background music
  resumeMusic() {
    if (!this.bgMusic || this.isMuted) return;
    this.playMusic();
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.pauseMusic();
    } else {
      this.resumeMusic();
    }

    return this.isMuted;
  }

  // Set volumes
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.musicVolume;
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = this.sfxVolume;
    });
  }

  // Check if sounds are loaded
  areSoundsLoaded() {
    if (!this.bgMusic) return false;
    return this.bgMusic.readyState >= 2; // HAVE_CURRENT_DATA or better
  }
}

// Create singleton instance
export const soundManager = new SoundManager();
