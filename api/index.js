const { jioGet, parseTrack, parseAlbum, parseArtist, parsePlaylist, parseAutocompleteTrack } = require('../lib/jiosaavn');
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
        name: 'Zade Music API',
        version: '1.0.0',
        description: 'Music Streaming API — Search, Stream 320kbps, Lyrics, Albums, Artists, Playlists, Trending',
        endpoints: {
          search: '/api/search?q=kesariya&limit=10 (songs only)',
          searchAlbums: '/api/search/albums?q=rockstar&limit=10',
          searchArtists: '/api/search/artists?q=arijit&limit=10',
          searchPlaylists: '/api/search/playlists?q=bollywood&limit=10',
          song: '/api/song?id=rjkrTnma',
          lyrics: '/api/lyrics?id=rjkrTnma',
          album: '/api/album?id=1045274',
          artist: '/api/artist?id=459320',
          artistSongs: '/api/artist/songs?id=459320&page=0',
          artistAlbums: '/api/artist/albums?id=459320&page=0',
          playlist: '/api/playlist?id=<id>',
          trending: '/api/trending',
          browse: '/api/browse',
        },
      });
    }

    // ── /api/search (songs only) — uses autocomplete.get for popular results ──
    if (path === '/api/search') {
      const query = q.get('q');
      if (!query) return error(res, 'Missing required parameter: q');
      const data = await jioGet('autocomplete.get', { query });
      if (!data) return error(res, 'No results found', 404);
      // Debug: log the structure
      console.log('Search response keys:', Object.keys(data));
      console.log('Songs type:', typeof data.songs, Array.isArray(data.songs));
      const songs = data.songs?.data || data.songs || [];
      return success(res, songs.slice(0, limit).map(parseAutocompleteTrack));
    }

    // ── /api/search/albums ──
    if (path === '/api/search/albums') {
      const query = q.get('q');
      if (!query) return error(res, 'Missing required parameter: q');
      const data = await jioGet('search.getAlbumResults', { q: query, n: limit });
      if (!data || !data.results) return error(res, 'No albums found', 404);
      return success(res, data.results.slice(0, limit).map(s => parseAlbum(s)));
    }

    // ── /api/search/artists ──
    if (path === '/api/search/artists') {
      const query = q.get('q');
      if (!query) return error(res, 'Missing required parameter: q');
      const data = await jioGet('search.getArtistResults', { q: query, n: limit });
      if (!data || !data.results) return error(res, 'No artists found', 404);
      return success(res, data.results.slice(0, limit).map(s => parseArtist(s)));
    }

    // ── /api/search/playlists ──
    if (path === '/api/search/playlists') {
      const query = q.get('q');
      if (!query) return error(res, 'Missing required parameter: q');
      const data = await jioGet('search.getPlaylistResults', { q: query, n: limit });
      if (!data || !data.results) return error(res, 'No playlists found', 404);
      return success(res, data.results.slice(0, limit).map(s => parsePlaylist(s)));
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
      const data = await jioGet('content.getAlbumDetails', { albumid: id });
      if (!data) return error(res, 'Album not found', 404);
      return success(res, {
        id: data.albumid || data.id || id,
        title: data.title || data.name || 'Unknown',
        artist: data.primary_artists || data.artist || 'Unknown',
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
      const data = await jioGet('artist.getArtistPageDetails', { artistId: id });
      if (!data) return error(res, 'Artist not found', 404);
      const topSongs = data.topSongs?.songs || data.songs || [];
      const topAlbums = data.topAlbums?.albums || data.albums || [];
      return success(res, {
        id: data.artistId || data.id || id,
        title: data.name || data.title || 'Unknown',
        image: (data.image || '').replace(/\d+x\d+\./, '500x500.'),
        follower_count: data.follower_count || '',
        is_verified: data.isVerified || false,
        songs_count: topSongs.length,
        albums_count: topAlbums.length,
        top_songs: topSongs.slice(0, 10).map(s => parseTrack(s, decryptUrl)),
        top_albums: topAlbums.slice(0, 10).map(s => parseAlbum(s)),
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
      const data = await jioGet('artist.getArtistMoreSong', { artistId: id, page, sortBy: 'popularity', sortOrder: 'desc' });
      if (!data) return error(res, 'No songs found', 404);
      // Response can have data.topSongs.songs or data.songs depending on page
      const songList = data.topSongs?.songs || data.songs || [];
      const songs = songList.map(s => parseTrack(s, decryptUrl));
      return success(res, songs);
    }

    // ── /api/artist/albums ──
    if (path === '/api/artist/albums') {
      const id = q.get('id');
      const page = q.get('page') || '0';
      if (!id) return error(res, 'Missing required parameter: id');
      const data = await jioGet('artist.getArtistMoreAlbum', { artistId: id, page, sortBy: 'popularity', sortOrder: 'desc' });
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
      if (!data || !Array.isArray(data)) return error(res, 'Could not fetch trending', 500);
      // Trending returns [{type, details, weight, language}, ...]
      const songs = data
        .filter(item => item.type === 'song' && item.details)
        .slice(0, 30)
        .map(item => parseTrack(item.details, decryptUrl));
      return success(res, songs);
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
