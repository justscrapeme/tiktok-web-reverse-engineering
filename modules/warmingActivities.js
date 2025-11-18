/**
 * Warming Activities - Humanized account warming behaviors
 */

const {
  randomDelay,
  generateScrollPattern,
  executeScrollPattern,
  randomInt,
  randomChoice,
  generateWatchTime,
  shouldPerformAction
} = require('../utils/humanization');

class WarmingActivities {
  constructor(config, tiktokClient) {
    this.config = config;
    this.client = tiktokClient;
    this.activities = config.activities || {};
    this.humanization = config.humanization || {};
  }

  /**
   * Simulate scrolling behavior
   * @returns {Promise<void>}
   */
  async performScrolling() {
    if (!this.activities.scroll?.enabled) {
      return;
    }

    console.log('[WarmingActivities] Starting scroll activity');

    const scrollCount = randomInt(
      this.activities.scroll.minScrolls || 5,
      this.activities.scroll.maxScrolls || 15
    );

    const pattern = await generateScrollPattern(
      scrollCount,
      this.activities.scroll.scrollSpeedMin || 1000,
      this.activities.scroll.scrollSpeedMax || 3000
    );

    await executeScrollPattern(pattern);

    console.log('[WarmingActivities] ✓ Scroll activity completed');
  }

  /**
   * Simulate watching videos
   * @returns {Promise<void>}
   */
  async performVideoWatching() {
    if (!this.activities.videoWatch?.enabled) {
      return;
    }

    console.log('[WarmingActivities] Starting video watch activity');

    const videoCount = randomInt(
      this.activities.videoWatch.minVideos || 3,
      this.activities.videoWatch.maxVideos || 10
    );

    // Get feed
    try {
      await this.client.getFeed();
    } catch (error) {
      console.warn(`[WarmingActivities] Failed to get feed: ${error.message}`);
    }

    for (let i = 0; i < videoCount; i++) {
      const watchTime = randomInt(
        this.activities.videoWatch.minWatchTime || 3000,
        this.activities.videoWatch.maxWatchTime || 30000
      );

      console.log(`[WarmingActivities] Watching video ${i + 1}/${videoCount} for ${(watchTime / 1000).toFixed(1)}s`);

      await randomDelay(watchTime, watchTime + 1000);

      // Randomly scroll to next video
      if (shouldPerformAction(0.7)) {
        console.log('[WarmingActivities] Scrolling to next video');
        await randomDelay(500, 1500);
      }

      // Randomly like video
      if (shouldPerformAction(0.2)) {
        console.log('[WarmingActivities] Liking video');
        await randomDelay(300, 800);
      }

      // Random pause between videos
      if (shouldPerformAction(this.humanization.pauseProbability || 0.3)) {
        const pauseDuration = randomInt(
          this.humanization.pauseDurationMin || 1000,
          this.humanization.pauseDurationMax || 5000
        );
        console.log(`[WarmingActivities] Pausing for ${(pauseDuration / 1000).toFixed(1)}s`);
        await randomDelay(pauseDuration, pauseDuration + 500);
      }
    }

    console.log('[WarmingActivities] ✓ Video watch activity completed');
  }

  /**
   * Simulate search behavior
   * @returns {Promise<void>}
   */
  async performSearch() {
    if (!this.activities.search?.enabled) {
      return;
    }

    console.log('[WarmingActivities] Starting search activity');

    const queries = this.activities.search.queries || ['trending', 'funny', 'music'];
    const searchCount = randomInt(
      this.activities.search.minSearches || 1,
      this.activities.search.maxSearches || 3
    );

    for (let i = 0; i < searchCount; i++) {
      const query = randomChoice(queries);

      console.log(`[WarmingActivities] Searching for: "${query}"`);

      try {
        await this.client.search(query);
      } catch (error) {
        console.warn(`[WarmingActivities] Search failed: ${error.message}`);
      }

      // Simulate typing delay
      await randomDelay(
        this.humanization.typingSpeedMin || 100,
        this.humanization.typingSpeedMax || 300
      );

      // Browse search results
      const browseTime = randomInt(5000, 15000);
      console.log(`[WarmingActivities] Browsing results for ${(browseTime / 1000).toFixed(1)}s`);
      await randomDelay(browseTime, browseTime + 1000);

      // Random pause between searches
      if (i < searchCount - 1) {
        await randomDelay(
          this.humanization.randomDelayMin || 2000,
          this.humanization.randomDelayMax || 8000
        );
      }
    }

    console.log('[WarmingActivities] ✓ Search activity completed');
  }

  /**
   * Perform a random activity
   * @returns {Promise<void>}
   */
  async performRandomActivity() {
    const availableActivities = [];

    if (this.activities.scroll?.enabled) {
      availableActivities.push('scroll');
    }
    if (this.activities.videoWatch?.enabled) {
      availableActivities.push('videoWatch');
    }
    if (this.activities.search?.enabled) {
      availableActivities.push('search');
    }

    if (availableActivities.length === 0) {
      console.warn('[WarmingActivities] No activities enabled');
      return;
    }

    const activity = randomChoice(availableActivities);

    switch (activity) {
      case 'scroll':
        await this.performScrolling();
        break;
      case 'videoWatch':
        await this.performVideoWatching();
        break;
      case 'search':
        await this.performSearch();
        break;
    }
  }

  /**
   * Perform a complete warming session
   * @returns {Promise<void>}
   */
  async performWarmingSession() {
    console.log('\n[WarmingActivities] Starting warming session');

    try {
      // Initial delay
      await randomDelay(
        this.humanization.randomDelayMin || 2000,
        this.humanization.randomDelayMax || 8000
      );

      // Perform scroll activity
      await this.performScrolling();

      // Delay between activities
      await randomDelay(3000, 8000);

      // Perform video watching
      await this.performVideoWatching();

      // Delay between activities
      await randomDelay(3000, 8000);

      // Perform search activity
      await this.performSearch();

      console.log('[WarmingActivities] ✓ Warming session completed successfully');
    } catch (error) {
      console.error(`[WarmingActivities] ✗ Warming session failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run warming activities for multiple accounts
   * @param {Array} clients - Array of TikTokClient instances
   * @param {Object} config - Warming config
   * @returns {Promise<Array>}
   */
  static async massWarmAccounts(clients, config) {
    console.log(`\n[WarmingActivities] Starting mass warming for ${clients.length} accounts`);

    const results = [];

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const warmer = new WarmingActivities(config, client);

      console.log(`\n${'='.repeat(60)}`);
      console.log(`[WarmingActivities] Account ${i + 1}/${clients.length}: ${client.account.username}`);
      console.log('='.repeat(60));

      try {
        await warmer.performWarmingSession();

        results.push({
          account: client.account.username,
          success: true
        });

        console.log(`[WarmingActivities] ✓ Warming completed for ${client.account.username}`);

        // Delay between accounts
        if (i < clients.length - 1) {
          const delay = randomInt(10000, 30000);
          console.log(`\n[WarmingActivities] Waiting ${(delay / 1000).toFixed(1)}s before next account...`);
          await randomDelay(delay, delay + 1000);
        }
      } catch (error) {
        console.error(`[WarmingActivities] ✗ Failed for ${client.account.username}: ${error.message}`);
        results.push({
          account: client.account.username,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`\n${'='.repeat(60)}`);
    console.log(`[WarmingActivities] Mass warming complete`);
    console.log(`[WarmingActivities] Success: ${successCount}/${clients.length}`);
    console.log('='.repeat(60));

    return results;
  }
}

module.exports = WarmingActivities;
