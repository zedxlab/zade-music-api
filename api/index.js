const { success } = require('../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  return success(res, {
    name: 'Zade JioSaavn API',
    version: '1.0.0',
    description: 'JioSaavn Music API — Search, Stream (320kbps), Lyrics, Albums, Artists, Playlists, Trending',
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
      playlist: '/api/playlist?id=<playlist_id>',
      playlists: '/api/playlists?q=bollywood&limit=10',
      trending: '/api/trending',
      browse: '/api/browse',
    },
  });
};
