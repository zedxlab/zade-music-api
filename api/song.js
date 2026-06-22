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

  const data = await jioGet('song.getDetails', { pids: id });
  if (!data) return error(res, 'Song not found', 404);

  const song = data[id] || data.songs?.[0];
  if (!song) return error(res, 'Song not found', 404);

  return success(res, parseTrack(song, decryptUrl));
};
