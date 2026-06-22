const { jioGet, parseTrack, parseAlbum } = require('../lib/jiosaavn');
const { decryptUrl } = require('../lib/decrypt');
const { success, error } = require('../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return error(res, 'Missing required parameter: id');

  const data = await jioGet('artist.getArtistPageDetails', { id });
  if (!data) return error(res, 'Artist not found', 404);

  const artist = {
    id: data.id,
    title: data.name || data.title || 'Unknown',
    image: (data.image || '').replace(/\d+x\d+\./, '500x500.'),
    songs_count: data.songs?.length || 0,
    albums_count: data.albums?.length || 0,
    top_songs: data.songs ? data.songs.slice(0, 10).map(s => parseTrack(s, decryptUrl)) : [],
    top_albums: data.albums ? data.albums.slice(0, 10).map(s => parseAlbum(s)) : [],
  };

  return success(res, artist);
};
