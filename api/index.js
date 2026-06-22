const { jioGet, parseTrack, parseAlbum, parseArtist, parsePlaylist } = require('../lib/jiosaavn');
const { decryptUrl } = require('../lib/decrypt');
const { success, error } = require('../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname;
  const q = url.searchParams;
  const limit = Math.min(parseInt(q.get('limit') || '10', 10), 50);

  try {
    // ── Root ──
    if (path === '/' || path === '') {
      return success(res, {
        name: 'Zade JioSaavn API',
        version: '1.0.0',
        description: 'JioSaavn Music API — Search, Stream 320kbps, Lyrics, Albums, Artists, Playlists, Trending',
        endpoints: {
          search: '/api/search?q=kesariya&limit=10',
          song: '/api/song?id=rjkrTnma',
          lyrics: '/api/lyrics?id=rjkrTnma',
          album: '/api/album?id=1045274',
          albums: '/api/albums?q=rockstar&limit=10',
          artist: '/api/artist?id=459320',
          artists: '/api/artists?q=arijit&limit=10',
          artistSongs: '/api/artist/songs?id=459320&page=0',
          artistAlbums: '/api/artist/albums?id=459320&page=0',
          playlist: '/api/playlist?id=<id>',
          playlists: '/api/playlists?q=bollywood&limit=10',
          trending: '/api/trending',
          browse: '/api/browse',
        },
      });
    }

    // ── /api/search ──
    if (path === '/api/search') {
      const query = q.get('q');
      if (!query) return error(res, 'Missing required parameter: q');
      const data = await jioGet('search.getResults', { q: query, n: limit });
      if (!data || !data.results) return error(res, 'No results found', 404);
      return success(res, data.results.slice(0, limit).map(s => parseTrack(s, decryptUrl)));
    }

    // ── /api/song ──
    if (path === '/api/song') {
      const id = q.get('id');
      if (!id) return error(res, 'Missing required parameter: id');
      const data = await jioGet('song.getDetails', { pids: id });
      if (!data) return error(res, 'Song not found', 404);
      const song = data[id] || (data.songs && data.songs[0]);
      if (!song) return error(res, 'Song not found', 404);
      return success(res, parseTrack(song, decryptUrl));
    }

    // ── /api/lyrics ──
    if (path === '/api/lyrics') {
      const id = q.get('id');
      if (!id) return error(res, 'Missing required parameter: id');
      const data = await jioGet('lyrics.getLyrics', { lyrics_id: id });
      if (!data) return error(res, 'Lyrics not found', 404);
      return success(res, { id, lyrics: data.lyrics || data.text || '' });
    }

    // ── /api/album ──
    if (path === '/api/album') {
      const id = q.get('id');
      if (!id) return error(res, 'Missing required parameter: id');
      const data = await jioGet('content.getAlbumDetails', { id });
      if (!data) return error(res, 'Album not found', 404);
      return success(res, {
        id: data.id,
        title: data.title || data.album || 'Unknown',
        artist: data.artist || data.singers || 'Unknown',
        year: data.year || '',
        image: (data.image || '').replace(/\d+x\d+\./, '500x500.'),
        songs: data.songs ? data.songs.map(s => parseTrack(s, decryptUrl)) : [],
      });
    }

    // ── /api/albums ──
    if (path === '/api/albums') {
      const query = q.get('q');
      if (!query) return error(res, 'Missing required parameter: q');
      const data = await jioGet('search.getAlbumResults', { q: query, n: limit });
      if (!data || !data.results) return error(res, 'No results found', 404);
      return success(res, data.results.slice(0, limit).map(s => parseAlbum(s)));
    }

    // ── /api/artist ──
    if (path === '/api/artist') {
      const id = q.get('id');
      if (!id) return error(res, 'Missing required parameter: id');
      const data = await jioGet('artist.getArtistPageDetails', { id });
      if (!data) return error(res, 'Artist not found', 404);
      return success(res, {
        id: data.id,
        title: data.name || data.title || 'Unknown',
        image: (data.image || '').replace(/\d+x\d+\./, '500x500.'),
        songs_count: data.songs ? data.songs.length : 0,
        albums_count: data.albums ? data.albums.length : 0,
        top_songs: data.songs ? data.songs.slice(0, 10).map(s => parseTrack(s, decryptUrl)) : [],
        top_albums: data.albums ? data.albums.slice(0, 10).map(s => parseAlbum(s)) : [],
      });
    }

    // ── /api/artists ──
    if (path === '/api/artists') {
      const query = q.get('q');
      if (!query) return error(res, 'Missing required parameter: q');
      const data = await jioGet('search.getArtistResults', { q: query, n: limit });
      if (!data || !data.results) return error(res, 'No results found', 404);
      return success(res, data.results.slice(0, limit).map(s => parseArtist(s)));
    }

    // ── /api/artist/songs ──
    if (path === '/api/artist/songs') {
      const id = q.get('id');
      const page = q.get('page') || '0';
      if (!id) return error(res, 'Missing required parameter: id');
      const data = await jioGet('artist.getArtistMoreSong', { id, page, sortBy: 'popularity', sortOrder: 'desc' });
      if (!data) return error(res, 'No songs found', 404);
      const songs = data.songs ? data.songs.map(s => parseTrack(s, decryptUrl)) : [];
      return success(res, songs);
    }

    // ── /api/artist/albums ──
    if (path === '/api/artist/albums') {
      const id = q.get('id');
      const page = q.get('page') || '0';
      if (!id) return error(res, 'Missing required parameter: id');
      const data = await jioGet('artist.getArtistMoreAlbum', { id, page, sortBy: 'popularity', sortOrder: 'desc' });
      if (!data) return error(res, 'No albums found', 404);
      const albums = data.albums ? data.albums.map(s => parseAlbum(s)) : [];
      return success(res, albums);
    }

    // ── /api/playlist ──
    if (path === '/api/playlist') {
      const id = q.get('id');
      if (!id) return error(res, 'Missing required parameter: id');
      const data = await jioGet('playlist.getDetails', { id });
      if (!data) return error(res, 'Playlist not found', 404);
      return success(res, {
        id: data.id,
        title: data.title || 'Unknown',
        image: (data.image || '').replace(/\d+x\d+\./, '500x500.'),
        songs: data.songs ? data.songs.map(s => parseTrack(s, decryptUrl)) : [],
      });
    }

    // ── /api/playlists ──
    if (path === '/api/playlists') {
      const query = q.get('q');
      if (!query) return error(res, 'Missing required parameter: q');
      const data = await jioGet('search.getPlaylistResults', { q: query, n: limit });
      if (!data || !data.results) return error(res, 'No results found', 404);
      return success(res, data.results.slice(0, limit).map(s => parsePlaylist(s)));
    }

    // ── /api/trending ──
    if (path === '/api/trending') {
      const data = await jioGet('content.getTrending');
      if (!data) return error(res, 'Could not fetch trending', 500);
      let songs = data.songs || [];
      if (typeof songs === 'object' && !Array.isArray(songs)) songs = songs.songs || [];
      return success(res, songs.slice(0, 30).map(s => parseTrack(s, decryptUrl)));
    }

    // ── /api/browse ──
    if (path === '/api/browse') {
      const data = await jioGet('content.getBrowseModules');
      if (!data) return error(res, 'Could not fetch browse data', 500);
      return success(res, data);
    }

    // ── 404 ──
    return error(res, `Endpoint not found: ${path}`, 404);

  } catch (err) {
    return error(res, err.message, 500);
  }
};
