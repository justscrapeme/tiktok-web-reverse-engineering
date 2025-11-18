/**
 * Account Manager - Handles loading and managing multiple TikTok accounts
 */

const fs = require('fs').promises;
const path = require('path');

class AccountManager {
  constructor(configPath = './config.json') {
    this.configPath = configPath;
    this.accounts = [];
    this.config = null;
  }

  /**
   * Load configuration from file
   * @returns {Promise<Object>}
   */
  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      this.accounts = this.config.accounts || [];
      console.log(`[AccountManager] Loaded ${this.accounts.length} accounts from config`);
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load config from ${this.configPath}: ${error.message}`);
    }
  }

  /**
   * Get all accounts
   * @returns {Array}
   */
  getAccounts() {
    return this.accounts;
  }

  /**
   * Get a specific account by username
   * @param {string} username
   * @returns {Object|null}
   */
  getAccount(username) {
    return this.accounts.find(acc => acc.username === username) || null;
  }

  /**
   * Get account count
   * @returns {number}
   */
  getAccountCount() {
    return this.accounts.length;
  }

  /**
   * Validate account has required fields
   * @param {Object} account
   * @returns {boolean}
   */
  validateAccount(account) {
    const requiredFields = ['username', 'sessionId', 'userAgent'];

    for (const field of requiredFields) {
      if (!account[field]) {
        console.warn(`[AccountManager] Account ${account.username || 'unknown'} missing field: ${field}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get valid accounts only
   * @returns {Array}
   */
  getValidAccounts() {
    return this.accounts.filter(acc => this.validateAccount(acc));
  }

  /**
   * Load accounts from a separate JSON file
   * @param {string} accountsFile
   * @returns {Promise<Array>}
   */
  async loadAccountsFromFile(accountsFile) {
    try {
      const data = await fs.readFile(accountsFile, 'utf8');
      const accountsData = JSON.parse(data);
      this.accounts = accountsData.accounts || accountsData;
      console.log(`[AccountManager] Loaded ${this.accounts.length} accounts from ${accountsFile}`);
      return this.accounts;
    } catch (error) {
      throw new Error(`Failed to load accounts from ${accountsFile}: ${error.message}`);
    }
  }

  /**
   * Save current config to file
   * @returns {Promise<void>}
   */
  async saveConfig() {
    try {
      await fs.writeFile(
        this.configPath,
        JSON.stringify(this.config, null, 2),
        'utf8'
      );
      console.log(`[AccountManager] Config saved to ${this.configPath}`);
    } catch (error) {
      throw new Error(`Failed to save config: ${error.message}`);
    }
  }

  /**
   * Update account data
   * @param {string} username
   * @param {Object} updates
   * @returns {boolean}
   */
  updateAccount(username, updates) {
    const accountIndex = this.accounts.findIndex(acc => acc.username === username);

    if (accountIndex === -1) {
      console.warn(`[AccountManager] Account ${username} not found`);
      return false;
    }

    this.accounts[accountIndex] = {
      ...this.accounts[accountIndex],
      ...updates
    };

    console.log(`[AccountManager] Updated account ${username}`);
    return true;
  }

  /**
   * Get configuration section
   * @param {string} section - Config section name
   * @returns {Object|null}
   */
  getConfigSection(section) {
    return this.config?.[section] || null;
  }

  /**
   * Check if a feature is enabled in config
   * @param {string} section
   * @param {string} feature
   * @returns {boolean}
   */
  isFeatureEnabled(section, feature = null) {
    const configSection = this.getConfigSection(section);

    if (!configSection) {
      return false;
    }

    if (feature) {
      return configSection[feature]?.enabled || false;
    }

    return configSection.enabled || false;
  }
}

module.exports = AccountManager;
