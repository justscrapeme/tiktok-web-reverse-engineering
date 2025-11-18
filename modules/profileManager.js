/**
 * Profile Manager - Handles mass avatar and bio uploads
 */

const fs = require('fs').promises;
const path = require('path');
const { randomDelay, randomChoice } = require('../utils/humanization');

class ProfileManager {
  constructor(config, tiktokClient) {
    this.config = config;
    this.client = tiktokClient;
    this.avatarFolder = config.avatarFolder || './avatars';
    this.bioFile = config.bioFile || './bios.txt';
    this.bioLines = config.bioLines || [];
  }

  /**
   * Load avatar files from folder
   * @returns {Promise<Array>}
   */
  async loadAvatars() {
    try {
      const files = await fs.readdir(this.avatarFolder);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
      });

      console.log(`[ProfileManager] Found ${imageFiles.length} avatar images`);
      return imageFiles.map(file => path.join(this.avatarFolder, file));
    } catch (error) {
      console.error(`[ProfileManager] Failed to load avatars: ${error.message}`);
      return [];
    }
  }

  /**
   * Load bio lines from file
   * @returns {Promise<Array>}
   */
  async loadBios() {
    try {
      // First try to load from file if it exists
      try {
        const content = await fs.readFile(this.bioFile, 'utf8');
        const lines = content.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        if (lines.length > 0) {
          console.log(`[ProfileManager] Loaded ${lines.length} bio lines from file`);
          return lines;
        }
      } catch (fileError) {
        // File doesn't exist, fall back to config
      }

      // Fall back to config bioLines
      if (this.bioLines.length > 0) {
        console.log(`[ProfileManager] Using ${this.bioLines.length} bio lines from config`);
        return this.bioLines;
      }

      console.warn('[ProfileManager] No bio lines available');
      return [];
    } catch (error) {
      console.error(`[ProfileManager] Failed to load bios: ${error.message}`);
      return [];
    }
  }

  /**
   * Update avatar for an account
   * @param {string} avatarPath
   * @returns {Promise<Object>}
   */
  async updateAvatar(avatarPath) {
    try {
      console.log(`[ProfileManager] Updating avatar: ${path.basename(avatarPath)}`);

      // Read image file
      const imageData = await fs.readFile(avatarPath);

      // Upload avatar via API
      const result = await this.client.uploadAvatar(imageData);

      console.log(`[ProfileManager] Avatar updated successfully`);
      return result;
    } catch (error) {
      console.error(`[ProfileManager] Failed to update avatar: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update bio for an account
   * @param {string} bioText
   * @returns {Promise<Object>}
   */
  async updateBio(bioText) {
    try {
      console.log(`[ProfileManager] Updating bio: "${bioText}"`);

      const result = await this.client.updateProfile({
        bio: bioText
      });

      console.log(`[ProfileManager] Bio updated successfully`);
      return result;
    } catch (error) {
      console.error(`[ProfileManager] Failed to update bio: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform profile update for one account
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async updateProfile(options = {}) {
    const results = {
      avatar: null,
      bio: null
    };

    try {
      // Update avatar if enabled
      if (this.config.updateAvatar && options.avatarPath) {
        await randomDelay(2000, 5000);
        results.avatar = await this.updateAvatar(options.avatarPath);
      }

      // Update bio if enabled
      if (this.config.updateBio && options.bioText) {
        await randomDelay(2000, 5000);
        results.bio = await this.updateBio(options.bioText);
      }

      return results;
    } catch (error) {
      console.error(`[ProfileManager] Profile update failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mass update profiles for multiple accounts
   * @param {Array} clients - Array of TikTokClient instances
   * @param {Object} config - Profile config
   * @returns {Promise<Array>}
   */
  static async massUpdateProfiles(clients, config) {
    console.log(`[ProfileManager] Starting mass profile update for ${clients.length} accounts`);

    const avatars = [];
    const bios = [];

    // Load resources once
    if (config.updateAvatar) {
      const pm = new ProfileManager(config, clients[0]);
      avatars.push(...await pm.loadAvatars());
    }

    if (config.updateBio) {
      const pm = new ProfileManager(config, clients[0]);
      bios.push(...await pm.loadBios());
    }

    const results = [];

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const profileManager = new ProfileManager(config, client);

      console.log(`\n[ProfileManager] Updating profile ${i + 1}/${clients.length}`);

      try {
        // Select random avatar and bio
        const avatarPath = avatars.length > 0 ? randomChoice(avatars) : null;
        const bioText = bios.length > 0 ? randomChoice(bios) : null;

        // Update profile
        const result = await profileManager.updateProfile({
          avatarPath,
          bioText
        });

        results.push({
          account: client.account.username,
          success: true,
          result
        });

        console.log(`[ProfileManager] ✓ Profile updated for ${client.account.username}`);

        // Delay between accounts
        if (i < clients.length - 1) {
          await randomDelay(
            config.delayBetweenAccountsMin || 5000,
            config.delayBetweenAccountsMax || 15000
          );
        }
      } catch (error) {
        console.error(`[ProfileManager] ✗ Failed for ${client.account.username}: ${error.message}`);
        results.push({
          account: client.account.username,
          success: false,
          error: error.message
        });
      }
    }

    console.log(`\n[ProfileManager] Mass update complete. Success: ${results.filter(r => r.success).length}/${clients.length}`);

    return results;
  }
}

module.exports = ProfileManager;
