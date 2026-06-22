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
  const res = await fetch(`${BASE}?${qs}`, {
    headers: {
      'User-Agent': UA,
      // Spoof Indian geo to get full library (Nicky Jam, etc.)
      'X-Forwarded-For': '103.242.190.149',
      'X-Real-IP': '103.242.190.149',
      'CF-IPCountry': 'IN',
      'Accept-Language': 'en-IN,en;q=0.9',
    },
  });
  if (!res.ok) return null;
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
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
  // JioSaavn returns data at root for search.getResults but nested in more_info for autocomplete.get
  const mi = s.more_info || {};
  const artist = s.singers || s.primary_artists || mi.primary_artists || mi.singers || s.description || 'Unknown';
  const title = s.song || s.title || mi.song || s.name || 'Unknown';
  const album = s.album || mi.album || '';
  const year = s.year || mi.year || '';
  const rawImage = s.image || mi.image || '';
  const duration = parseInt(s.duration || mi.duration || '0', 10);
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  const language = s.language || mi.language || '';
  const label = s.label || mi.label || '';
  const url = s.perma_url || mi.perma_url || s.url || '';
  const id = s.id || mi.song_id || mi.id || '';

  return {
    id,
    title,
    artist,
    album,
    duration: `${mins}:${String(secs).padStart(2, '0')}`,
    year,
    image: rawImage.replace(/\d+x\d+\./, '500x500.'),
    stream_url: stream || '',
    language,
    label,
    url,
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

module.exports = { jioGet, parseTrack, parseAlbum, parseArtist, parsePlaylist };
