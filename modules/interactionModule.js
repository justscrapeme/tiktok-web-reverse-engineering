/**
 * Interaction Module - Handles mass commenting and liking
 */

const { randomDelay, randomChoice, shuffleArray } = require('../utils/humanization');

class InteractionModule {
  constructor(config, tiktokClient) {
    this.config = config;
    this.client = tiktokClient;
  }

  /**
   * Extract video ID from TikTok URL
   * @param {string} url
   * @returns {string|null}
   */
  static extractVideoId(url) {
    try {
      // Format: https://www.tiktok.com/@username/video/1234567890
      const match = url.match(/\/video\/(\d+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error(`[InteractionModule] Failed to extract video ID: ${error.message}`);
      return null;
    }
  }

  /**
   * Post a comment on a video
   * @param {string} videoId
   * @param {string} commentText
   * @returns {Promise<Object>}
   */
  async postComment(videoId, commentText) {
    try {
      console.log(`[InteractionModule] Posting comment: "${commentText}"`);

      const result = await this.client.postComment(videoId, commentText);

      console.log(`[InteractionModule] ✓ Comment posted successfully`);
      return result;
    } catch (error) {
      console.error(`[InteractionModule] ✗ Failed to post comment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Like a comment
   * @param {string} commentId
   * @returns {Promise<Object>}
   */
  async likeComment(commentId) {
    try {
      console.log(`[InteractionModule] Liking comment ${commentId}`);

      const result = await this.client.likeComment(commentId, 1);

      console.log(`[InteractionModule] ✓ Comment liked successfully`);
      return result;
    } catch (error) {
      console.error(`[InteractionModule] ✗ Failed to like comment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mass comment on a video using multiple accounts
   * @param {Array} clients - Array of TikTokClient instances
   * @param {Object} config - Commenting config
   * @returns {Promise<Array>}
   */
  static async massComment(clients, config) {
    console.log(`[InteractionModule] Starting mass commenting with ${clients.length} accounts`);

    const videoId = config.videoId || InteractionModule.extractVideoId(config.videoUrl);

    if (!videoId) {
      throw new Error('No valid video ID provided');
    }

    console.log(`[InteractionModule] Target video ID: ${videoId}`);

    let comments = [...config.comments];

    // Randomize comment order if enabled
    if (config.randomizeOrder) {
      comments = shuffleArray(comments);
    }

    const results = [];

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const interactionModule = new InteractionModule(config, client);

      console.log(`\n[InteractionModule] Account ${i + 1}/${clients.length}: ${client.account.username}`);

      try {
        // Select comment (cycle through if more accounts than comments)
        const commentText = comments[i % comments.length];

        // Post comment
        const result = await interactionModule.postComment(videoId, commentText);

        results.push({
          account: client.account.username,
          success: true,
          comment: commentText,
          result
        });

        console.log(`[InteractionModule] ✓ Comment posted by ${client.account.username}`);

        // Delay between comments
        if (i < clients.length - 1) {
          await randomDelay(
            config.delayBetweenCommentsMin || 5000,
            config.delayBetweenCommentsMax || 15000
          );
        }
      } catch (error) {
        console.error(`[InteractionModule] ✗ Failed for ${client.account.username}: ${error.message}`);
        results.push({
          account: client.account.username,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`\n[InteractionModule] Mass commenting complete. Success: ${successCount}/${clients.length}`);

    return results;
  }

  /**
   * Mass like a specific comment using multiple accounts
   * @param {Array} clients - Array of TikTokClient instances
   * @param {Object} config - Comment liking config
   * @returns {Promise<Array>}
   */
  static async massLikeComment(clients, config) {
    console.log(`[InteractionModule] Starting mass comment liking with ${clients.length} accounts`);

    const commentId = config.commentId;

    if (!commentId) {
      throw new Error('No comment ID provided');
    }

    console.log(`[InteractionModule] Target comment ID: ${commentId}`);

    const results = [];

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const interactionModule = new InteractionModule(config, client);

      console.log(`\n[InteractionModule] Account ${i + 1}/${clients.length}: ${client.account.username}`);

      try {
        // Like the comment
        const result = await interactionModule.likeComment(commentId);

        results.push({
          account: client.account.username,
          success: true,
          result
        });

        console.log(`[InteractionModule] ✓ Comment liked by ${client.account.username}`);

        // Delay between likes
        if (i < clients.length - 1) {
          await randomDelay(
            config.delayBetweenLikesMin || 3000,
            config.delayBetweenLikesMax || 10000
          );
        }
      } catch (error) {
        console.error(`[InteractionModule] ✗ Failed for ${client.account.username}: ${error.message}`);
        results.push({
          account: client.account.username,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`\n[InteractionModule] Mass comment liking complete. Success: ${successCount}/${clients.length}`);

    return results;
  }
}

module.exports = InteractionModule;
