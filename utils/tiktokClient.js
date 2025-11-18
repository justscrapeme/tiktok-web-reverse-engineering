/**
 * TikTok API Client - Wrapper for making authenticated TikTok API requests
 */

const { encode } = require('../encode');

class TikTokClient {
  constructor(account) {
    this.account = account;
    this.userAgent = account.userAgent;
    this.cookies = account.cookies || {};
    this.sessionId = account.sessionId || account.cookies?.sessionid;
    this.msToken = account.msToken || account.cookies?.msToken;
    this.baseUrl = 'https://www.tiktok.com';
    this.apiUrl = 'https://www.tiktok.com/api';
  }

  /**
   * Build cookie string from account cookies
   * @returns {string}
   */
  getCookieString() {
    const cookies = [];

    if (this.sessionId) {
      cookies.push(`sessionid=${this.sessionId}`);
    }

    if (this.msToken) {
      cookies.push(`msToken=${this.msToken}`);
    }

    // Add any additional cookies from account.cookies
    for (const [key, value] of Object.entries(this.cookies)) {
      if (key !== 'sessionid' && key !== 'msToken') {
        cookies.push(`${key}=${value}`);
      }
    }

    return cookies.join('; ');
  }

  /**
   * Make an authenticated API request
   * @param {string} endpoint
   * @param {Object} params
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async makeRequest(endpoint, params = {}, options = {}) {
    const method = options.method || 'GET';
    const body = options.body || null;

    // Build headers
    const headers = {
      'User-Agent': this.userAgent,
      'Cookie': this.getCookieString(),
      'Referer': 'https://www.tiktok.com/',
      'Origin': 'https://www.tiktok.com',
      ...options.headers
    };

    // Build URL with query params
    const url = new URL(`${this.apiUrl}${endpoint}`);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    console.log(`[TikTokClient] ${method} ${url.pathname}`);

    try {
      // Note: In a real implementation, you would use fetch/axios here
      // and integrate with the X-Gnarly encoding from encode.js
      // This is a placeholder structure
      const response = {
        url: url.toString(),
        method,
        headers,
        body
      };

      return response;
    } catch (error) {
      console.error(`[TikTokClient] Request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user profile
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getUserProfile(username) {
    return this.makeRequest(`/user/detail/`, {
      uniqueId: username
    });
  }

  /**
   * Post a comment on a video
   * @param {string} videoId
   * @param {string} text
   * @returns {Promise<Object>}
   */
  async postComment(videoId, text) {
    console.log(`[TikTokClient] Posting comment on video ${videoId}: "${text}"`);

    return this.makeRequest('/comment/publish/', {
      aweme_id: videoId
    }, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        text,
        aweme_id: videoId
      }
    });
  }

  /**
   * Like a comment
   * @param {string} commentId
   * @param {number} action - 1 for like, 0 for unlike
   * @returns {Promise<Object>}
   */
  async likeComment(commentId, action = 1) {
    console.log(`[TikTokClient] ${action ? 'Liking' : 'Unliking'} comment ${commentId}`);

    return this.makeRequest('/comment/digg/', {
      comment_id: commentId,
      action
    }, {
      method: 'POST'
    });
  }

  /**
   * Like a video
   * @param {string} videoId
   * @param {number} action - 1 for like, 0 for unlike
   * @returns {Promise<Object>}
   */
  async likeVideo(videoId, action = 1) {
    console.log(`[TikTokClient] ${action ? 'Liking' : 'Unliking'} video ${videoId}`);

    return this.makeRequest('/commit/item/digg/', {
      aweme_id: videoId,
      type: action
    }, {
      method: 'POST'
    });
  }

  /**
   * Follow a user
   * @param {string} userId
   * @param {number} action - 1 for follow, 0 for unfollow
   * @returns {Promise<Object>}
   */
  async followUser(userId, action = 1) {
    console.log(`[TikTokClient] ${action ? 'Following' : 'Unfollowing'} user ${userId}`);

    return this.makeRequest('/commit/follow/user/', {
      user_id: userId,
      type: action
    }, {
      method: 'POST'
    });
  }

  /**
   * Get video comments
   * @param {string} videoId
   * @param {number} cursor
   * @returns {Promise<Object>}
   */
  async getComments(videoId, cursor = 0) {
    return this.makeRequest('/comment/list/', {
      aweme_id: videoId,
      cursor,
      count: 20
    });
  }

  /**
   * Update profile information
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  async updateProfile(profileData) {
    console.log(`[TikTokClient] Updating profile for ${this.account.username}`);

    return this.makeRequest('/user/profile/update/', {}, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: profileData
    });
  }

  /**
   * Upload avatar
   * @param {Buffer} imageData
   * @returns {Promise<Object>}
   */
  async uploadAvatar(imageData) {
    console.log(`[TikTokClient] Uploading avatar for ${this.account.username}`);

    // Note: This would need proper multipart/form-data handling
    return this.makeRequest('/user/avatar/update/', {}, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: imageData
    });
  }

  /**
   * Search for content
   * @param {string} query
   * @param {number} offset
   * @returns {Promise<Object>}
   */
  async search(query, offset = 0) {
    console.log(`[TikTokClient] Searching for: "${query}"`);

    return this.makeRequest('/search/general/full/', {
      keyword: query,
      offset,
      count: 12
    });
  }

  /**
   * Get recommended feed
   * @returns {Promise<Object>}
   */
  async getFeed() {
    console.log(`[TikTokClient] Getting recommended feed`);

    return this.makeRequest('/recommend/item_list/', {
      count: 30
    });
  }
}

module.exports = TikTokClient;
