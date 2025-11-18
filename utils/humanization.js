/**
 * Humanization utilities for making bot actions appear more natural
 */

/**
 * Sleep for a random duration between min and max milliseconds
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 * @returns {Promise<void>}
 */
async function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`[Humanization] Waiting ${(delay / 1000).toFixed(2)}s...`);
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Generate a human-like typing pattern with variable delays
 * @param {string} text - Text to "type"
 * @param {number} minDelay - Minimum delay between keystrokes (ms)
 * @param {number} maxDelay - Maximum delay between keystrokes (ms)
 * @returns {Promise<void>}
 */
async function humanTyping(text, minDelay = 100, maxDelay = 300) {
  console.log(`[Humanization] Simulating typing: "${text}"`);
  for (let i = 0; i < text.length; i++) {
    await randomDelay(minDelay, maxDelay);

    // Occasionally pause longer (simulating thinking)
    if (Math.random() < 0.1) {
      await randomDelay(500, 1500);
    }
  }
}

/**
 * Generate a scroll pattern that mimics human behavior
 * @param {number} scrollCount - Number of scrolls to simulate
 * @param {number} minSpeed - Minimum time between scrolls (ms)
 * @param {number} maxSpeed - Maximum time between scrolls (ms)
 * @returns {Promise<Array>} Array of scroll actions
 */
async function generateScrollPattern(scrollCount, minSpeed = 1000, maxSpeed = 3000) {
  const pattern = [];

  for (let i = 0; i < scrollCount; i++) {
    const scrollAmount = Math.floor(Math.random() * 500) + 300; // 300-800px
    const speed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;

    pattern.push({
      action: 'scroll',
      amount: scrollAmount,
      delay: speed
    });

    // Occasionally pause to "read" content
    if (Math.random() < 0.3) {
      pattern.push({
        action: 'pause',
        delay: Math.floor(Math.random() * 4000) + 1000 // 1-5 seconds
      });
    }
  }

  return pattern;
}

/**
 * Execute a scroll pattern with delays
 * @param {Array} pattern - Scroll pattern from generateScrollPattern
 */
async function executeScrollPattern(pattern) {
  console.log(`[Humanization] Executing scroll pattern with ${pattern.length} actions`);

  for (const action of pattern) {
    if (action.action === 'scroll') {
      console.log(`[Humanization] Scrolling ${action.amount}px`);
    } else if (action.action === 'pause') {
      console.log(`[Humanization] Pausing to read content...`);
    }
    await new Promise(resolve => setTimeout(resolve, action.delay));
  }
}

/**
 * Generate random mouse movement simulation data
 * @returns {Object} Mouse movement coordinates
 */
function generateMouseMovement() {
  return {
    x: Math.floor(Math.random() * 1920),
    y: Math.floor(Math.random() * 1080),
    duration: Math.floor(Math.random() * 500) + 200
  };
}

/**
 * Randomly decide whether to perform an action based on probability
 * @param {number} probability - Probability between 0 and 1
 * @returns {boolean}
 */
function shouldPerformAction(probability) {
  return Math.random() < probability;
}

/**
 * Shuffle an array in place (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random element from an array
 * @param {Array} array
 * @returns {*}
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a human-like watch time for a video
 * @param {number} videoDuration - Video duration in seconds
 * @param {number} minWatchPercent - Minimum watch percentage (0-1)
 * @param {number} maxWatchPercent - Maximum watch percentage (0-1)
 * @returns {number} Watch time in milliseconds
 */
function generateWatchTime(videoDuration, minWatchPercent = 0.3, maxWatchPercent = 0.9) {
  const watchPercent = Math.random() * (maxWatchPercent - minWatchPercent) + minWatchPercent;
  return Math.floor(videoDuration * 1000 * watchPercent);
}

/**
 * Add random jitter to a timestamp to avoid patterns
 * @param {number} timestamp - Base timestamp
 * @param {number} jitterMax - Maximum jitter in ms
 * @returns {number}
 */
function addJitter(timestamp, jitterMax = 5000) {
  return timestamp + Math.floor(Math.random() * jitterMax * 2) - jitterMax;
}

module.exports = {
  randomDelay,
  humanTyping,
  generateScrollPattern,
  executeScrollPattern,
  generateMouseMovement,
  shouldPerformAction,
  shuffleArray,
  randomInt,
  randomChoice,
  generateWatchTime,
  addJitter
};
