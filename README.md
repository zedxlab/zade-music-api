<div align="center">

# 🎵 Zade Music API

### Free Music Streaming API — Search, Stream 320kbps, Lyrics, Albums, Artists, Playlists, Trending

[Live Demo](https://zade-music-api-dun.vercel.app) · [API Docs](#-api-documentation) · [Report Bug](https://github.com/zedxlab/zade-music-api/issues) · [Request Feature](https://github.com/zedxlab/zade-music-api/issues)

</div>

---

<div align="center">

### 🌐 Live API

**Base URL:** `https://zade-music-api-dun.vercel.app`

### Try it now 👇

```bash
curl "https://zade-music-api-dun.vercel.app/api/search?q=kesariya&limit=1"
```

</div>

---

## 📊 Project Stats

<div align="center">

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-live-success?style=for-the-badge)
![API](https://img.shields.io/badge/API-13%20endpoints-orange?style=for-the-badge)
![Quality](https://img.shields.io/badge/quality-320kbps-red?style=for-the-badge)

</div>

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/zedxlab/zade-music-api?style=social)
![GitHub forks](https://img.shields.io/github/forks/zedxlab/zade-music-api?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/zedxlab/zade-music-api?style=social)
![GitHub issues](https://img.shields.io/github/issues/zedxlab/zade-music-api)
![GitHub pull requests](https://img.shields.io/github/issues-pr/zedxlab/zade-music-api)
![GitHub last commit](https://img.shields.io/github/last-commit/zedxlab/zade-music-api)

</div>

---

## ✨ Features

- 🎵 **Search** — Songs, Albums, Artists, Playlists
- 🚀 **Stream URLs** — Direct 320kbps MP4 links (DES-ECB decrypted)
- 📝 **Lyrics** — Full song lyrics
- 🎤 **Artists** — Top songs, albums, bio
- 📀 **Albums** — Full tracklist with stream URLs
- 📋 **Playlists** — Complete playlist details
- 🔥 **Trending** — What's hot right now
- 🏠 **Browse** — Home modules
- 🌍 **CORS Enabled** — Use from any frontend
- ⚡ **Fast** — Vercel serverless, ~400ms response
- 💯 **Free** — No API key, no rate limits
- 🎨 **Branded Responses** — All responses include owner + powered_by

---

## 🚀 Quick Start

### JavaScript (Browser/Node.js)

```javascript
const BASE = "https://zade-music-api-dun.vercel.app";

// Search for a song
async function searchSong(query) {
  const res = await fetch(`${BASE}/api/search?q=${query}&limit=5`);
  const data = await res.json();
  return data.data;
}

// Get song details + stream URL
async function getSong(id) {
  const res = await fetch(`${BASE}/api/song?id=${id}`);
  const data = await res.json();
  return data.data;
}

// Play song
async function playSong(id) {
  const song = await getSong(id);
  const audio = new Audio(song.stream_url);
  audio.play();
  return song;
}

// Get lyrics
async function getLyrics(id) {
  const res = await fetch(`${BASE}/api/lyrics?id=${id}`);
  const data = await res.json();
  return data.data.lyrics;
}

// Get trending
async function getTrending() {
  const res = await fetch(`${BASE}/api/trending`);
  const data = await res.json();
  return data.data;
}
```

### Python

```python
import requests

BASE = "https://zade-music-api-dun.vercel.app"

def search_song(query, limit=10):
    r = requests.get(f"{BASE}/api/search", params={"q": query, "limit": limit})
    return r.json()["data"]

def get_song(song_id):
    r = requests.get(f"{BASE}/api/song", params={"id": song_id})
    return r.json()["data"]

def get_lyrics(song_id):
    r = requests.get(f"{BASE}/api/lyrics", params={"id": song_id})
    return r.json()["data"]["lyrics"]

# Example
songs = search_song("tum hi ho")
for song in songs[:3]:
    print(f"{song['title']} - {song['artist']}")
    print(f"  Stream: {song['stream_url']}")
```

### cURL

```bash
# Search
curl "https://zade-music-api-dun.vercel.app/api/search?q=kesariya&limit=1"

# Get song
curl "https://zade-music-api-dun.vercel.app/api/song?id=rjkrTnma"

# Get lyrics
curl "https://zade-music-api-dun.vercel.app/api/lyrics?id=rjkrTnma"

# Get trending
curl "https://zade-music-api-dun.vercel.app/api/trending"
```

### PHP

```php
$base = "https://zade-music-api-dun.vercel.app";

// Search
$response = file_get_contents("$base/api/search?q=kesariya&limit=1");
$data = json_decode($response, true);

foreach ($data['data'] as $song) {
    echo "{$song['title']} - {$song['artist']}\n";
    echo "Stream: {$song['stream_url']}\n";
}
```

---

## 📚 API Documentation

### 🔍 Search

<details>
<summary><b>GET /api/search</b> — Search for songs</summary>

**Query Parameters:**
- `q` (string, **required**) — Search query
- `limit` (int, default 10, max 50) — Number of results

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/search?q=kesariya&limit=2"
```

**Response:**
```json
{
  "success": true,
  "owner": "@zade4everbot",
  "powered_by": "Zora AI by Zade",
  "time_elapsed": "393ms",
  "data": [
    {
      "id": "rjkrTnma",
      "title": "Kesariya",
      "artist": "Pritam, Arijit Singh, Amitabh Bhattacharya",
      "album": "Brahmastra",
      "duration": "4:28",
      "year": "2022",
      "image": "https://c.saavncdn.com/871/...500x500.jpg",
      "stream_url": "https://aac.saavncdn.com/871/..._320.mp4",
      "language": "hindi",
      "label": "Sony Music Entertainment India Pvt. Ltd.",
      "url": "https://www.jiosaavn.com/song/kesariya/..."
    }
  ]
}
```

</details>

<details>
<summary><b>GET /api/song</b> — Get song details + 320kbps stream URL</summary>

**Query Parameters:**
- `id` (string, **required**) — Song ID

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/song?id=rjkrTnma"
```

**Response:**
```json
{
  "success": true,
  "owner": "@zade4everbot",
  "powered_by": "Zora AI by Zade",
  "data": {
    "id": "rjkrTnma",
    "title": "Kesariya",
    "artist": "Pritam, Arijit Singh, Amitabh Bhattacharya",
    "album": "Brahmastra",
    "duration": "4:28",
    "year": "2022",
    "image": "https://c.saavncdn.com/871/...500x500.jpg",
    "stream_url": "https://aac.saavncdn.com/871/..._320.mp4"
  }
}
```

</details>

<details>
<summary><b>GET /api/lyrics</b> — Get song lyrics</summary>

**Query Parameters:**
- `id` (string, **required**) — Song ID

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/lyrics?id=rjkrTnma"
```

**Response:**
```json
{
  "success": true,
  "owner": "@zade4everbot",
  "powered_by": "Zora AI by Zade",
  "data": {
    "id": "rjkrTnma",
    "lyrics": "Tera Ishq Hai Piya..."
  }
}
```

</details>

---

### 💿 Albums

<details>
<summary><b>GET /api/album</b> — Get album details with all songs</summary>

**Query Parameters:**
- `id` (string, **required**) — Album ID

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/album?id=1045274"
```

**Response:**
```json
{
  "success": true,
  "owner": "@zade4everbot",
  "powered_by": "Zora AI by Zade",
  "data": {
    "id": "1045274",
    "title": "Rockstar",
    "artist": "A.R. Rahman",
    "year": "2011",
    "image": "https://c.saavncdn.com/...500x500.jpg",
    "songs": [
      {
        "id": "cymtugLP",
        "title": "Phir Se Ud Chala",
        "artist": "Mohit Chauhan",
        "duration": "4:31",
        "stream_url": "https://aac.saavncdn.com/..._320.mp4"
      }
    ]
  }
}
```

</details>

<details>
<summary><b>GET /api/albums</b> — Search for albums</summary>

**Query Parameters:**
- `q` (string, **required**) — Search query
- `limit` (int, default 10, max 50)

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/albums?q=rockstar&limit=5"
```

</details>

---

### 🎤 Artists

<details>
<summary><b>GET /api/artist</b> — Get artist details + top songs</summary>

**Query Parameters:**
- `id` (string, **required**) — Artist ID

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/artist?id=459320"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "459320",
    "title": "Arijit Singh",
    "image": "https://c.saavncdn.com/...500x500.jpg",
    "songs_count": 1500,
    "albums_count": 50,
    "top_songs": [ ... ],
    "top_albums": [ ... ]
  }
}
```

</details>

<details>
<summary><b>GET /api/artists</b> — Search for artists</summary>

**Query Parameters:**
- `q` (string, **required**) — Search query
- `limit` (int, default 10, max 50)

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/artists?q=arijit&limit=5"
```

</details>

<details>
<summary><b>GET /api/artist/songs</b> — Get artist's songs (paginated)</summary>

**Query Parameters:**
- `id` (string, **required**) — Artist ID
- `page` (int, default 0) — Page number

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/artist/songs?id=459320&page=0"
```

</details>

<details>
<summary><b>GET /api/artist/albums</b> — Get artist's albums (paginated)</summary>

**Query Parameters:**
- `id` (string, **required**) — Artist ID
- `page` (int, default 0) — Page number

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/artist/albums?id=459320&page=0"
```

</details>

---

### 📋 Playlists

<details>
<summary><b>GET /api/playlist</b> — Get playlist details</summary>

**Query Parameters:**
- `id` (string, **required**) — Playlist ID

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/playlist?id=1234567"
```

</details>

<details>
<summary><b>GET /api/playlists</b> — Search for playlists</summary>

**Query Parameters:**
- `q` (string, **required**) — Search query
- `limit` (int, default 10, max 50)

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/playlists?q=bollywood&limit=5"
```

</details>

---

### 🔥 Trending & Browse

<details>
<summary><b>GET /api/trending</b> — Get trending songs</summary>

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/trending"
```

**Response:**
```json
{
  "success": true,
  "owner": "@zade4everbot",
  "powered_by": "Zora AI by Zade",
  "data": [
    {
      "id": "abc123",
      "title": "Trending Song",
      "artist": "Popular Artist",
      "stream_url": "https://aac.saavncdn.com/..._320.mp4"
    }
  ]
}
```

</details>

<details>
<summary><b>GET /api/browse</b> — Get browse/home modules</summary>

**Example:**
```bash
curl "https://zade-music-api-dun.vercel.app/api/browse"
```

</details>

---

## 🎨 Response Format

All responses follow a consistent format:

### Success Response:
```json
{
  "success": true,
  "owner": "@zade4everbot",
  "powered_by": "Zora AI by Zade",
  "time_elapsed": "245ms",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "owner": "@zade4everbot",
  "powered_by": "Zora AI by Zade",
  "time_elapsed": "10ms",
  "error": "Missing required parameter: q"
}
```

---

## 💡 Use Cases

- 🎵 **Music streaming apps** — Build your own Spotify/JioSaavn clone
- 🤖 **Telegram bots** — Search and play music
- 🌐 **Web players** — Browser-based music players
- 📱 **Mobile apps** — React Native, Flutter
- 🎮 **Discord bots** — Music playback in voice channels
- 📊 **Music analytics** — Track trending songs
- 🎤 **Karaoke apps** — Get lyrics + backing tracks

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 18+ |
| **Platform** | Vercel Serverless |
| **Language** | JavaScript (ES Modules) |
| **HTTP** | Built-in `fetch` |
| **Crypto** | Node.js `crypto` (DES-ECB) |
| **Source** | JioSaavn Internal API |

</div>

---

## 🚀 Deployment

This API is deployed on Vercel. To deploy your own:

```bash
# Clone
git clone https://github.com/zedxlab/zade-music-api.git
cd zade-music-api

# Install
npm install

# Local dev
npx vercel dev

# Deploy
npx vercel --prod
```

---

## 👨‍💻 Author

<div align="center">

### **@zade4everbot**

[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/zade4everbot)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zedxlab)

</div>

---

## 🤖 Powered By

<div align="center">

**🤖 Zora AI by Zade**

*The AI assistant behind this project*

</div>

---

## 📜 License

```
MIT License

Copyright (c) 2026 @zade4everbot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ⚠️ Disclaimer

This API is for **educational purposes only**. Music streaming rights belong to the original copyright holders. Please support artists by using official platforms.

---

<div align="center">

### ⭐ Star this repo if you found it useful!

[⬆ Back to Top](#-zade-music-api)

Made with ❤️ by **@zade4everbot** · Powered by **Zora AI by Zade**

</div>
