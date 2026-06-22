const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const BASE = 'https://www.jiosaavn.com/api.php';

async function jioGet(__call, params = {}) {
  const qs = new URLSearchParams({
    __call,
    _format: 'json',
    _marker: '0',
    cc: 'in',
    includeMetaTags: '1',
    ...params,
  });
  // Use https module to avoid Node.js fetch UA fingerprint throttling
  const https = require('https');
  const url = new URL(`${BASE}?${qs}`);

  return new Promise((resolve) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Upgrade-Insecure-Requests': '1',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      const chunks = [];
      const stream = res.headers['content-encoding'] === 'gzip' ? require('zlib').createGunzip() : res;
      stream.on('data', chunk => data += chunk);
      res.on('data', chunk => {
        if (res.headers['content-encoding'] === 'gzip' || res.headers['content-encoding'] === 'br') {
          chunks.push(chunk);
        } else {
          data += chunk;
        }
      });
      res.on('end', () => {
        try {
          if (chunks.length > 0) {
            const zlib = require('zlib');
            const buf = Buffer.concat(chunks);
            if (res.headers['content-encoding'] === 'gzip') {
              data = zlib.gunzipSync(buf).toString();
            } else if (res.headers['content-encoding'] === 'br') {
              data = zlib.brotliDecompressSync(buf).toString();
            }
          }
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function parseAutocompleteTrack(s) {
  const more = s.more_info || {};
  const img = (s.image || '').replace(/\d+x\d+\./, '500x500.');
  const artists = more.primary_artists || s.description || 'Unknown';
  const duration = parseInt(more.duration || '0', 10);
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  return {
    id: s.id,
    title: s.title || 'Unknown',
    artist: artists,
    album: s.album || more.album || '',
    duration: `${mins}:${String(secs).padStart(2, '0')}`,
    year: more.year || s.year || '',
    image: img,
    stream_url: '', // Will be filled by song.getDetails later
    language: more.language || '',
    label: more.label || '',
    url: s.url || '',
  };
}

function parseTrack(s, decryptUrl) {
  const enc = s.encrypted_media_url || '';
  let stream = decryptUrl ? decryptUrl(enc) : null;
  if (!stream && s.media_preview_url) {
    stream = s.media_preview_url
      .replace(/_96_p\.mp4/g, '_320.mp4')
      .replace(/_p\.mp4/g, '.mp4')
      .replace('preview.saavncdn.com', 'aac.saavncdn.com');
  }
  const img = (s.image || '').replace(/\d+x\d+\./, '500x500.');
  const duration = parseInt(s.duration || '0', 10);
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;

  return {
    id: s.id,
    title: s.song || s.title || 'Unknown',
    artist: s.singers || s.primary_artists || 'Unknown',
    album: s.album || '',
    duration: `${mins}:${String(secs).padStart(2, '0')}`,
    year: s.year || '',
    image: img,
    stream_url: stream || '',
    language: s.language || '',
    label: s.label || '',
    url: s.perma_url || '',
  };
}

function parseAlbum(s) {
  return {
    id: s.id,
    title: s.title || s.album || 'Unknown',
    artist: s.artist || s.singers || 'Unknown',
    year: s.year || '',
    image: (s.image || '').replace(/\d+x\d+\./, '500x500.'),
    songs: s.songs ? s.songs.length : 0,
    url: s.perma_url || '',
  };
}

function parseArtist(s) {
  return {
    id: s.id,
    title: s.title || s.name || 'Unknown',
    image: (s.image || '').replace(/\d+x\d+\./, '500x500.'),
    type: s.type || 'artist',
    url: s.perma_url || '',
  };
}

function parsePlaylist(s) {
  return {
    id: s.id,
    title: s.title || 'Unknown',
    image: (s.image || '').replace(/\d+x\d+\./, '500x500.'),
    songs: s.song_count || s.count || 0,
    url: s.perma_url || '',
  };
}

module.exports = { jioGet, parseTrack, parseAlbum, parseArtist, parsePlaylist, parseAutocompleteTrack };
