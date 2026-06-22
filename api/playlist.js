const { jioGet, parseTrack } = require('../lib/jiosaavn');
const { decryptUrl } = require('../lib/decrypt');
const { success, error } = require('../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return error(res, 'Missing required parameter: id');

  const data = await jioGet('playlist.getDetails', { id });
  if (!data) return error(res, 'Playlist not found', 404);

  const playlist = {
    id: data.id,
    title: data.title || 'Unknown',
    image: (data.image || '').replace(/\d+x\d+\./, '500x500.'),
    songs: data.songs ? data.songs.map(s => parseTrack(s, decryptUrl)) : [],
  };

  return success(res, playlist);
};
