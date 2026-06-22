const { jioGet, parseAlbum } = require('../../lib/jiosaavn');
const { success, error } = require('../../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, page = 0 } = req.query;
  if (!id) return error(res, 'Missing required parameter: id');

  const data = await jioGet('artist.getArtistMoreAlbum', { id, page, sortBy: 'popularity', sortOrder: 'desc' });
  if (!data) return error(res, 'No albums found', 404);

  const albums = data.albums ? data.albums.map(s => parseAlbum(s)) : [];
  return success(res, albums);
};
