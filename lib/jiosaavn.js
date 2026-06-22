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
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) return null;
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
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
