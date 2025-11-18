# TikTok Web Reverse Engineering

This project aims to open-source the latest TikTok Web security query param implementation called `X-Gnarly`.

⭐ If you want to have:

- `X-Bogus` implementation in Python (encryption & decryption)
- `X-Gnarly` implementation in Python (encryption & decryption)
  - Version 5.1.3 (03.11.2025)
  - Version 5.1.2 (07.09.2025)
  - Version 5.1.1 (28.06.2025)
  - Version 5.1.0 (10.05.2025)
- `strData` implementation in Python (encryption & decryption)
- `x-mssdk-info` header implementation in Python (encryption & decryption)
- `_signature` implementation in Python (encryption)
- `edata` implementation in Python (encryption & decryption)
- `tt-ticket-guard-client-data` & `tt-ticket-guard-public-key` implementation in Python
- Access to the managed version of the TikTok Web API
- ⭐ [TikTok Captcha Solver](https://github.com/justscrapeme/tiktok-captcha-solver)
- ⭐ Mass registration software
- Mass actions scripts (comments, likes, followers)
- Exclusive offers

Reach out to [t.me/justscrape](https://t.me/justscrape) to discuss a solution tailored to your needs.

## Features

### 🤖 Mass Account Warmer

A comprehensive account warming and automation system with:

- **Humanized Activity Simulation**: Natural scrolling, video watching, and search behaviors
- **Mass Profile Updates**: Bulk avatar and bio uploads for multiple accounts
- **Mass Commenting**: Post comments on specific TikTok videos from multiple accounts
- **Mass Comment Liking**: Boost specific comments with multiple accounts
- **Fully Configurable**: All features controlled via `config.json`

See [Account Warmer Usage](#account-warmer-usage) section below for detailed instructions.

## Usage

### Encoding

Encoding implementation aims to convert the user request data to the `X-Gnarly` value. It lives under [encode.js](./encode.js).

Usage example:

```js
let xGnarly = encode(
  {
    queryString: "WebIdLastTime=1746886547&aid=1988&app_language=en-GB&app_name=tiktok_web&browser_language=en-GB&browser_name=Mozilla&browser_online=true&browser_platform=MacIntel&channel=tiktok_web&cookie_enabled=true&data_collection_enabled=false&device_platform=web_pc&focus_state=true&from_page=&history_len=2&is_fullscreen=false&is_page_visible=true&odinId=7502820379158911111&permissionList=001004%2C001005&priority_region=&referer=&screen_height=956&screen_width=1470&user_is_login=false&webcast_language=en-GB&msToken=",
    body: "",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 1_1_1) AppleWebKit/111.11 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/111.11"
  }
)
console.log(xGnarly)
```

Output:

```js
MktqXnEPLoZz6RyaxPytL6qu7/A1LU7LB4zGZOtQuq8szdGvK-mDaVbI8QiUYeDaPnAdwy6id5uQ5gT8s67MpQjR7OxrJVCQffmhoz-x-tQtI0iYmDlEcvHk6DxtFxKMq/4Y0kJHG6WxF0KVeIdapKtTlfvIaCzu3RsV/fHDQBELkIoX3x/cJP73pT6zy0F6gM-Et5rhfJXEl2KLwp93yF7Ki5XTmNMyw9NrRu8zqALAoiQNZEa-MF6nrJJXIeNUfVSiZGV9NUbRj
```

### Decoding

Decoding implementation aims to decipher `X-Gnarly` and convert it back to the input object. It lives under [decode.js](./decode.js).

Usage example:

```js
const encoded = 'MktqXnEPLoZz6RyaxPytL6qu7/A1LU7LB4zGZOtQuq8szdGvK-mDaVbI8QiUYeDaPnAdwy6id5uQ5gT8s67MpQjR7OxrJVCQffmhoz-x-tQtI0iYmDlEcvHk6DxtFxKMq/4Y0kJHG6WxF0KVeIdapKtTlfvIaCzu3RsV/fHDQBELkIoX3x/cJP73pT6zy0F6gM-Et5rhfJXEl2KLwp93yF7Ki5XTmNMyw9NrRu8zqALAoiQNZEa-MF6nrJJXIeNUfVSiZGV9NUbRj';
console.log(decode(encoded))
```

Output:

```js
{
  '0': 1747774361,
  '1': 1,
  '2': 14,
  '3': 'bfcd22d7d1ba47225dad53efa7d69271',
  '4': 'd41d8cd98f00b204e9800998ecf8427e',
  '5': '40b54b1d67cb8370879a3b534bfc9208',
  '6': 1746916919,
  '7': 1245783967,
  '8': 1248991792,
  '9': '5.1.0'
}
```

## About `X-Gnarly`

`X-Gnarly` is just an object underneath. Here is its structure with few comments for context:

```js
{
  "0":2024114372, // $6 XOR $7 XOR $8 XOR $1 XOR $2
  "1":1, // constant
  /*
  ubcode - either 0,8,12,14.
  didn't manage to infer the actual condition on which either one is chosen
  but it seems the value is endpoint-dependant. 0 is the value for most
  regular read/write endpoints.
  */
  "2":0,
  "3":"0170be42af9a30f1cb0158c024a36b3d", // md5 of query string
  "4":"d41d8cd98f00b204e9800998ecf8427e", // md5 of body ("" for GET requests)
  "5":"b977e10d1cb26107909e97d51a688323", // md5 of user-agent
  "6":1746388945, // unix ts
  "7":1245783967, // static as of now, subject to change. canvas operation that can be generated in the browser using canvas.js.
  "8":1525901451, // unix ts in microseconds % 2147483648
  "9":"5.1.0" // sdk version
}
```

After this object is crafted, it's encoded using some cryptography.

## Account Warmer Usage

### Setup

1. Copy the example configuration:
```bash
cp config.example.json config.json
```

2. Edit `config.json` and add your TikTok accounts with session cookies

3. (Optional) Add avatar images to `./avatars/` folder

4. (Optional) Create or edit `bios.txt` with bio options (one per line)

### Running the Warmer

Run all enabled features:
```bash
node accountWarmer.js
```

Or specify a custom config file:
```bash
node accountWarmer.js ./my-config.json
```

### Configuration

The `config.json` file controls all features:

#### Account Warming
Enable natural activity simulation:
```json
{
  "warming": {
    "enabled": true,
    "activities": {
      "scroll": { "enabled": true, "minScrolls": 5, "maxScrolls": 15 },
      "videoWatch": { "enabled": true, "minVideos": 3, "maxVideos": 10 },
      "search": { "enabled": true, "queries": ["trending", "funny"] }
    },
    "humanization": {
      "randomDelayMin": 2000,
      "randomDelayMax": 8000,
      "pauseProbability": 0.3
    }
  }
}
```

#### Mass Profile Updates
Update avatars and bios:
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

#### Mass Commenting
Comment on a specific video:
```json
{
  "massActions": {
    "commenting": {
      "enabled": true,
      "videoUrl": "https://www.tiktok.com/@username/video/1234567890",
      "comments": [
        "Amazing content! 🔥",
        "Love this! ❤️"
      ],
      "delayBetweenCommentsMin": 5000,
      "delayBetweenCommentsMax": 15000
    }
  }
}
```

#### Mass Comment Liking
Like a specific comment:
```json
{
  "massActions": {
    "commentLiking": {
      "enabled": true,
      "videoUrl": "https://www.tiktok.com/@username/video/1234567890",
      "commentId": "7234567890123456789",
      "delayBetweenLikesMin": 3000,
      "delayBetweenLikesMax": 10000
    }
  }
}
```

### Features

- **Humanization**: Random delays, typing simulation, scroll patterns, and pause behaviors
- **Safety**: Built-in delays and randomization to avoid detection
- **Flexibility**: Enable/disable any feature independently
- **Scalability**: Support for unlimited accounts
- **Logging**: Detailed console output for monitoring

### Project Structure

```
tiktok-web-reverse-engineering/
├── accountWarmer.js           # Main entry point
├── config.example.json        # Example configuration
├── bios.example.txt          # Example bio lines
├── utils/
│   ├── accountManager.js     # Account loading and management
│   ├── humanization.js       # Humanization utilities
│   └── tiktokClient.js       # TikTok API client wrapper
└── modules/
    ├── warmingActivities.js  # Activity simulation
    ├── profileManager.js     # Avatar/bio management
    └── interactionModule.js  # Commenting and liking
```

## License

This repository is licensed under the [MIT License](./LICENSE).
