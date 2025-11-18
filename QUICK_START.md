# Quick Start Guide - TikTok Account Warmer

## 🚀 Getting Started in 5 Minutes

### Step 1: Setup Configuration

```bash
# Copy the example config
cp config.example.json config.json
```

### Step 2: Add Your Accounts

Edit `config.json` and add your TikTok accounts:

```json
{
  "accounts": [
    {
      "username": "your_username",
      "sessionId": "your_sessionid_cookie",
      "msToken": "your_mstoken_cookie",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "cookies": {
        "sessionid": "your_session_id",
        "msToken": "your_ms_token"
      }
    }
  ]
}
```

**How to get cookies:**
1. Login to TikTok in your browser
2. Open Developer Tools (F12)
3. Go to Application/Storage → Cookies
4. Copy `sessionid` and `msToken` values

### Step 3: Configure Features

Enable the features you want in `config.json`:

```json
{
  "warming": {
    "enabled": true  // ✅ Enable account warming
  },
  "profile": {
    "enabled": false // ❌ Disable profile updates for now
  },
  "massActions": {
    "commenting": {
      "enabled": false // ❌ Disable for now
    },
    "commentLiking": {
      "enabled": false // ❌ Disable for now
    }
  }
}
```

### Step 4: Run the Warmer

```bash
node accountWarmer.js
```

Or use npm script:

```bash
npm run warm
```

## 🎯 Common Use Cases

### Use Case 1: Warm New Accounts

Keep default warming settings to simulate natural user behavior:

```json
{
  "warming": {
    "enabled": true,
    "activities": {
      "scroll": { "enabled": true },
      "videoWatch": { "enabled": true },
      "search": { "enabled": true }
    }
  }
}
```

### Use Case 2: Mass Comment on a Video

```json
{
  "massActions": {
    "commenting": {
      "enabled": true,
      "videoUrl": "https://www.tiktok.com/@username/video/1234567890",
      "comments": [
        "Great content! 🔥",
        "Love it! ❤️",
        "Amazing! 👏"
      ]
    }
  }
}
```

### Use Case 3: Boost a Comment

```json
{
  "massActions": {
    "commentLiking": {
      "enabled": true,
      "videoUrl": "https://www.tiktok.com/@username/video/1234567890",
      "commentId": "7234567890123456789"
    }
  }
}
```

**How to get comment ID:**
1. Open the video with the comment
2. Right-click on the comment → Inspect
3. Find the `data-comment-id` or `comment-id` attribute

### Use Case 4: Update All Profiles

```bash
# 1. Create avatars folder and add images
mkdir avatars
# Add your .jpg/.png files to avatars/

# 2. Create bios.txt or copy example
cp bios.example.txt bios.txt

# 3. Enable in config
```

```json
{
  "profile": {
    "enabled": true,
    "avatarFolder": "./avatars",
    "bioFile": "./bios.txt",
    "updateAvatar": true,
    "updateBio": true
  }
}
```

## ⚙️ Configuration Tips

### Humanization Settings

Make actions more natural:

```json
{
  "humanization": {
    "randomDelayMin": 2000,      // 2 seconds minimum
    "randomDelayMax": 8000,      // 8 seconds maximum
    "pauseProbability": 0.3,     // 30% chance to pause
    "pauseDurationMin": 1000,    // 1 second pause
    "pauseDurationMax": 5000     // 5 second pause
  }
}
```

### Safe Delays

Avoid detection with proper delays:

```json
{
  "massActions": {
    "commenting": {
      "delayBetweenCommentsMin": 10000,  // 10 seconds
      "delayBetweenCommentsMax": 30000   // 30 seconds
    }
  }
}
```

## 📊 Output

The warmer will display progress:

```
============================================================
TikTok Mass Account Warmer
============================================================

[AccountWarmer] Loading configuration...
[AccountWarmer] Loaded 5 valid accounts

============================================================
WARMING ACCOUNTS
============================================================

[WarmingActivities] Account 1/5: account1
[WarmingActivities] Starting scroll activity
[Humanization] Waiting 2.5s...
[WarmingActivities] ✓ Scroll activity completed

[WarmingActivities] Starting video watch activity
[WarmingActivities] Watching video 1/7 for 12.3s
...

============================================================
SUMMARY
============================================================
Warming: 5/5 accounts
Mass Commenting: 5/5 comments
============================================================
```

## 🔧 Troubleshooting

### "No valid accounts found"
- Check your `config.json` format
- Ensure all required fields are present: `username`, `sessionId`, `userAgent`

### "Failed to load config"
- Verify `config.json` is valid JSON
- Use a JSON validator online

### Activities not running
- Check that features are `"enabled": true`
- Check that activity sections are enabled

## 🎓 Next Steps

1. ✅ Test with 1-2 accounts first
2. ✅ Monitor the console output
3. ✅ Adjust delays based on your needs
4. ✅ Scale up to more accounts
5. ✅ Schedule with cron/task scheduler for automation

## ⚠️ Best Practices

- **Start slow**: Test with 1 account first
- **Use realistic delays**: Don't set delays too low
- **Rotate accounts**: Don't use same accounts constantly
- **Monitor**: Watch for any errors or blocks
- **Cookies**: Keep session cookies up to date

## 📚 More Information

See [README.md](./README.md) for full documentation.
