const { jioGet, parseTrack } = require('../../lib/jiosaavn');
const { decryptUrl } = require('../../lib/decrypt');
const { success, error } = require('../../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, page = 0 } = req.query;
  if (!id) return error(res, 'Missing required parameter: id');

  const data = await jioGet('artist.getArtistMoreSong', { id, page, sortBy: 'popularity', sortOrder: 'desc' });
  if (!data) return error(res, 'No songs found', 404);

  const songs = data.songs ? data.songs.map(s => parseTrack(s, decryptUrl)) : [];
  return success(res, songs);
};
