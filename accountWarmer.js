/**
 * TikTok Account Warmer - Mass Account Warming & Automation
 *
 * Features:
 * - Humanized scrolling and activity simulation
 * - Mass avatar and bio uploads
 * - Mass commenting on specific videos
 * - Mass comment liking
 * - Fully configurable via config.json
 */

const AccountManager = require('./utils/accountManager');
const TikTokClient = require('./utils/tiktokClient');
const WarmingActivities = require('./modules/warmingActivities');
const ProfileManager = require('./modules/profileManager');
const InteractionModule = require('./modules/interactionModule');
const { randomDelay } = require('./utils/humanization');

class AccountWarmer {
  constructor(configPath = './config.json') {
    this.configPath = configPath;
    this.accountManager = new AccountManager(configPath);
    this.clients = [];
  }

  /**
   * Initialize the account warmer
   * @returns {Promise<void>}
   */
  async initialize() {
    console.log('\n' + '='.repeat(60));
    console.log('TikTok Mass Account Warmer');
    console.log('='.repeat(60) + '\n');

    // Load configuration
    console.log('[AccountWarmer] Loading configuration...');
    await this.accountManager.loadConfig();

    // Validate accounts
    const validAccounts = this.accountManager.getValidAccounts();
    console.log(`[AccountWarmer] Loaded ${validAccounts.length} valid accounts`);

    if (validAccounts.length === 0) {
      throw new Error('No valid accounts found. Please check your config.json');
    }

    // Create TikTok clients for each account
    this.clients = validAccounts.map(account => new TikTokClient(account));

    console.log('[AccountWarmer] ✓ Initialization complete\n');
  }

  /**
   * Run account warming activities
   * @returns {Promise<void>}
   */
  async runWarming() {
    const warmingConfig = this.accountManager.getConfigSection('warming');

    if (!warmingConfig?.enabled) {
      console.log('[AccountWarmer] Warming is disabled in config');
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log('WARMING ACCOUNTS');
    console.log('='.repeat(60));

    const results = await WarmingActivities.massWarmAccounts(
      this.clients,
      warmingConfig
    );

    return results;
  }

  /**
   * Run mass profile updates
   * @returns {Promise<void>}
   */
  async runProfileUpdates() {
    const profileConfig = this.accountManager.getConfigSection('profile');

    if (!profileConfig?.enabled) {
      console.log('[AccountWarmer] Profile updates are disabled in config');
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log('UPDATING PROFILES');
    console.log('='.repeat(60));

    const results = await ProfileManager.massUpdateProfiles(
      this.clients,
      profileConfig
    );

    return results;
  }

  /**
   * Run mass commenting
   * @returns {Promise<void>}
   */
  async runMassCommenting() {
    const commentingConfig = this.accountManager.getConfigSection('massActions')?.commenting;

    if (!commentingConfig?.enabled) {
      console.log('[AccountWarmer] Mass commenting is disabled in config');
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log('MASS COMMENTING');
    console.log('='.repeat(60));

    const results = await InteractionModule.massComment(
      this.clients,
      commentingConfig
    );

    return results;
  }

  /**
   * Run mass comment liking
   * @returns {Promise<void>}
   */
  async runMassCommentLiking() {
    const likingConfig = this.accountManager.getConfigSection('massActions')?.commentLiking;

    if (!likingConfig?.enabled) {
      console.log('[AccountWarmer] Mass comment liking is disabled in config');
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log('MASS COMMENT LIKING');
    console.log('='.repeat(60));

    const results = await InteractionModule.massLikeComment(
      this.clients,
      likingConfig
    );

    return results;
  }

  /**
   * Run all enabled features
   * @returns {Promise<Object>}
   */
  async runAll() {
    const results = {
      warming: null,
      profileUpdates: null,
      massCommenting: null,
      massCommentLiking: null
    };

    try {
      // Run warming
      if (this.accountManager.isFeatureEnabled('warming')) {
        results.warming = await this.runWarming();
      }

      // Run profile updates
      if (this.accountManager.isFeatureEnabled('profile')) {
        await randomDelay(5000, 10000);
        results.profileUpdates = await this.runProfileUpdates();
      }

      // Run mass commenting
      if (this.accountManager.isFeatureEnabled('massActions', 'commenting')) {
        await randomDelay(5000, 10000);
        results.massCommenting = await this.runMassCommenting();
      }

      // Run mass comment liking
      if (this.accountManager.isFeatureEnabled('massActions', 'commentLiking')) {
        await randomDelay(5000, 10000);
        results.massCommentLiking = await this.runMassCommentLiking();
      }

      return results;
    } catch (error) {
      console.error(`\n[AccountWarmer] Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Display summary statistics
   * @param {Object} results
   */
  displaySummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    if (results.warming) {
      const warmingSuccess = results.warming.filter(r => r.success).length;
      console.log(`Warming: ${warmingSuccess}/${results.warming.length} accounts`);
    }

    if (results.profileUpdates) {
      const profileSuccess = results.profileUpdates.filter(r => r.success).length;
      console.log(`Profile Updates: ${profileSuccess}/${results.profileUpdates.length} accounts`);
    }

    if (results.massCommenting) {
      const commentSuccess = results.massCommenting.filter(r => r.success).length;
      console.log(`Mass Commenting: ${commentSuccess}/${results.massCommenting.length} comments`);
    }

    if (results.massCommentLiking) {
      const likeSuccess = results.massCommentLiking.filter(r => r.success).length;
      console.log(`Mass Comment Liking: ${likeSuccess}/${results.massCommentLiking.length} likes`);
    }

    console.log('='.repeat(60) + '\n');
  }
}

// CLI entry point
if (require.main === module) {
  (async () => {
    const configPath = process.argv[2] || './config.json';
    const warmer = new AccountWarmer(configPath);

    try {
      await warmer.initialize();

      const results = await warmer.runAll();

      warmer.displaySummary(results);

      console.log('[AccountWarmer] ✓ All tasks completed successfully');
      process.exit(0);
    } catch (error) {
      console.error(`\n[AccountWarmer] ✗ Fatal error: ${error.message}`);
      console.error(error.stack);
      process.exit(1);
    }
  })();
}

module.exports = AccountWarmer;
